"""Real PaddleOCR CPU adapter; output coordinates refer to saved processed JPEG."""
import hashlib
import io
import os
import time
import warnings
from importlib.metadata import version
import numpy as np
import cv2
from PIL import Image, ImageOps
from extraction import extract

Image.MAX_IMAGE_PIXELS=24_000_000
warnings.simplefilter('error',Image.DecompressionBombWarning)
try:
 from pillow_heif import register_heif_opener
 register_heif_opener()
except ImportError: pass

class Engine:
 def __init__(self):
  from paddleocr import PaddleOCR
  self.ocr=PaddleOCR(text_detection_model_name='PP-OCRv5_mobile_det',text_recognition_model_name='latin_PP-OCRv5_mobile_rec',device='cpu',use_doc_orientation_classify=True,use_doc_unwarping=False,use_textline_orientation=True,enable_mkldnn=False,cpu_threads=int(os.getenv('OCR_CPU_THREADS','4')))
 def process(self,raw,config):
  start=time.monotonic()
  if len(raw)>min(config.get('max_bytes',20971520),20971520):raise ValueError('file_too_large')
  with Image.open(io.BytesIO(raw)) as source:
   if source.format not in ('JPEG','PNG','WEBP','HEIF','HEIC'):raise ValueError('unsupported_image')
   if source.width*source.height>min(config.get('max_pixels',24000000),24000000):raise ValueError('resolution_limit')
   if getattr(source,'n_frames',1)>1:raise ValueError('animated_image_not_supported')
   source.load();im=ImageOps.exif_transpose(source).convert('RGB')
  im.thumbnail((3200,3200));rgb=np.asarray(im);gray=cv2.cvtColor(rgb,cv2.COLOR_RGB2GRAY)
  quality={'blur_score':float(cv2.Laplacian(gray,cv2.CV_64F).var()),'glare_fraction':float(np.mean(gray>250))}
  # Conservative rectangular label crop. Preserve original; no crop if geometry is uncertain.
  edges=cv2.Canny(gray,50,150);contours,_=cv2.findContours(edges,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
  transform=None
  for contour in sorted(contours,key=cv2.contourArea,reverse=True)[:8]:
   poly=cv2.approxPolyDP(contour,.02*cv2.arcLength(contour,True),True)
   ratio=cv2.contourArea(poly)/(gray.shape[0]*gray.shape[1])
   if len(poly)==4 and cv2.isContourConvex(poly) and .3<ratio<.98:
    pts=poly.reshape(4,2).astype('float32');s=pts.sum(axis=1);d=np.diff(pts,axis=1).ravel()
    rect=np.array([pts[s.argmin()],pts[d.argmin()],pts[s.argmax()],pts[d.argmax()]],dtype='float32')
    if len(np.unique(rect,axis=0))!=4:continue
    w=int(max(np.linalg.norm(rect[1]-rect[0]),np.linalg.norm(rect[2]-rect[3])));h=int(max(np.linalg.norm(rect[3]-rect[0]),np.linalg.norm(rect[2]-rect[1])))
    if min(w,h)<200:continue
    transform=cv2.getPerspectiveTransform(rect,np.array([[0,0],[w-1,0],[w-1,h-1],[0,h-1]],dtype='float32'))
    rgb=cv2.warpPerspective(rgb,transform,(w,h));break
  pred=list(self.ocr.predict(cv2.cvtColor(rgb,cv2.COLOR_RGB2BGR)))[0]
  data=pred.json
  if callable(data):data=data()
  if isinstance(data,str):
   import json
   data=json.loads(data)
  data=data.get('res',data)
  # doc orientation may rotate; save that exact image for evidence overlays.
  angle=data.get('doc_preprocessor_res',{}).get('angle',0)
  rgb=cv2.cvtColor(pred['doc_preprocessor_res']['output_img'],cv2.COLOR_BGR2RGB)
  out=io.BytesIO();Image.fromarray(rgb).save(out,'JPEG',quality=92)
  lines=[{'text':str(t),'confidence':float(c),'polygon':np.asarray(p).tolist()} for t,c,p in zip(data.get('rec_texts',[]),data.get('rec_scores',[]),data.get('rec_polys',[]))]
  result=extract(lines,config);result.update({'lines':lines,'quality':quality,'width':rgb.shape[1],'height':rgb.shape[0],'orientation':angle,'perspective_matrix':transform.tolist() if transform is not None else None,'engine':'PaddleOCR','engine_version':version('paddleocr'),'runtime_version':version('paddlepaddle'),'model':'PP-OCRv5_mobile_det + latin_PP-OCRv5_mobile_rec','language':'es (Latin multilingual)','elapsed_seconds':time.monotonic()-start,'sha256':hashlib.sha256(raw).hexdigest()})
  if quality['blur_score']<config.get('blur_threshold',70):result['warnings'].append({'field':None,'code':'blur'})
  if quality['glare_fraction']>config.get('glare_threshold',.2):result['warnings'].append({'field':None,'code':'possible_glare'})
  tiny=Image.fromarray(rgb).convert('L').resize((9,8));a=np.asarray(tiny);result['dhash']=''.join(f'{int(x):02x}' for x in np.packbits(a[:,1:]>a[:,:-1]))
  return result,out.getvalue()
