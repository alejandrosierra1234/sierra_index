"""Generate clearly synthetic local fixtures; requires Pillow. Never real sample data."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter
import json
root=Path(__file__).resolve().parents[2];out=root/'work/ocr-fixtures';out.mkdir(parents=True,exist_ok=True)
font=ImageFont.truetype(str(root/'Aeonik-Regular.ttf'),44)
im=Image.new('RGB',(1400,900),'white');draw=ImageDraw.Draw(im)
for i,line in enumerate(['SYNTHETIC TEST - NOT A REAL SAMPLE','Development Code: TEST-001','Composition: 95% Cotton 5% Elastane','GSM: 180','Width: 150 cm','Color: Navy']):draw.text((60,60+i*115),line,fill='black',font=font)
expected={'Development Code':'TEST-001','Composition':'95% Cotton 5% Elastane','GSM':'180','Width':'150 cm','Color':'Navy'}
manifest=[]
for name,img in [('synthetic',im),('rotated',im.rotate(90,expand=True)),('small',im.resize((700,450))),('dim',ImageEnhance.Brightness(im).enhance(.45)),('blurred',im.filter(ImageFilter.GaussianBlur(2))),('damaged',im.copy())]:
 if name=='damaged':ImageDraw.Draw(img).rectangle((400,170,600,210),fill='white')
 img.save(out/(name+'.png'));manifest.append({'image':name+'.png','synthetic':True,'expected':expected})
img=Image.new('RGB',(1400,900),'white');draw=ImageDraw.Draw(img)
for i,line in enumerate(['PRUEBA SINTETICA','Código de desarrollo: PRUEBA-002','Composición: 60% Algodón 35% Poliéster 5% Elastano','Gramaje: 220','Ancho: 160 cm','Color: Azul']):draw.text((40,50+i*115),line,fill='black',font=font)
img.save(out/'spanish.png');manifest.append({'image':'spanish.png','synthetic':True,'expected':{'Development Code':'PRUEBA-002','Composition':'60% Algodón 35% Poliéster 5% Elastano','GSM':'220','Width':'160 cm','Color':'Azul'}})
(out/'suite.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
