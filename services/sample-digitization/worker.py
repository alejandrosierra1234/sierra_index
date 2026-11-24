"""Outbound-only worker. No listener, browser secret, or third-party recognition API."""
import hashlib
import logging
import os
import socket
import threading
import time
from urllib.parse import quote
import httpx
from engine import Engine
from extraction import extract

logging.basicConfig(level=logging.INFO,format='%(asctime)s %(levelname)s %(message)s')

logging.getLogger('httpx').setLevel(logging.WARNING)
logging.getLogger('httpcore').setLevel(logging.WARNING)

class DirectBackend:
 def __init__(self):
  url=os.environ['SUPABASE_URL'].rstrip('/')
  if not url.startswith('https://') and not url.startswith('http://127.0.0.1:'):raise ValueError('HTTPS required')
  key=os.environ['SUPABASE_SERVICE_ROLE_KEY']
  self.client=httpx.Client(base_url=url,headers={'apikey':key,'Authorization':'Bearer '+key},timeout=60,follow_redirects=False)
 def rpc(self,name,**params):
  r=self.client.post('/rest/v1/rpc/'+name,json=params);r.raise_for_status();return r.json() if r.content else None
 def heartbeat(self):
  r=self.client.post('/rest/v1/digitization_workers',headers={'Prefer':'resolution=merge-duplicates'},json={'id':socket.gethostname(),'version':'1.0.0','seen_at':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'detail':{'engine':'PaddleOCR 3.3.2','device':'cpu'}});r.raise_for_status()
 def download(self,path,limit):
  data=bytearray()
  with self.client.stream('GET','/storage/v1/object/authenticated/sample-digitization/'+quote(path,safe='/')) as r:
   r.raise_for_status()
   for chunk in r.iter_bytes():
    data.extend(chunk)
    if len(data)>limit:raise ValueError('file_too_large')
  return bytes(data)
 def upload(self,path,raw):
  r=self.client.post('/storage/v1/object/sample-digitization/'+quote(path,safe='/'),headers={'Content-Type':'image/jpeg','x-upsert':'true'},content=raw);r.raise_for_status()

class GatewayBackend:
 """Scoped worker credential; no Supabase administrator key on the machine."""
 def __init__(self):
  self.url=os.environ['SUPABASE_URL'].rstrip('/')
  if not self.url.startswith('https://'):raise ValueError('HTTPS required')
  self.client=httpx.Client(timeout=60,follow_redirects=False)
  self.token=os.environ['OCR_WORKER_TOKEN'];self.job=None
 def call(self,action,**params):
  r=self.client.post(self.url+'/functions/v1/sample-digitization-worker',headers={'Authorization':'Bearer '+self.token},json={'action':action,**params});r.raise_for_status();return r.json()
 def rpc(self,name,**params):
  action={'digitization_claim':'claim','digitization_renew':'renew','digitization_finish':'finish','digitization_cached':'cached'}[name]
  if action=='claim':
   claim=self.call(action);self.job=claim['job'] if claim else None;return claim
  args={'job_id':params.get('p_id'), 'lease':params.get('p_lease') or self.job['lease']}
  if action=='finish':args.update(result=params.get('p_result'),error=params.get('p_error'))
  return self.call(action,**args)
 def heartbeat(self):return self.call('heartbeat')
 def signed(self,action,**params):
  data=self.call(action,job_id=self.job['id'],lease=self.job['lease'],**params)
  url=data['url']
  if not url.startswith(self.url+'/storage/v1/'):raise ValueError('Unexpected storage host')
  return url
 def download(self,path,limit):
  url=self.signed('download',cached=path!=self.job['original_path']);data=bytearray()
  with self.client.stream('GET',url) as r:
   r.raise_for_status()
   for chunk in r.iter_bytes():
    data.extend(chunk)
    if len(data)>limit:raise ValueError('file_too_large')
  return bytes(data)
 def upload(self,path,raw):
  expected=f"{self.job['batch_id']}/{self.job['id']}/processed-{self.job['lease']}.jpg"
  if path!=expected:raise ValueError('Unexpected upload path')
  r=self.client.put(self.signed('upload'),content=raw,headers={'Content-Type':'image/jpeg'});r.raise_for_status()


def run():
 backend=GatewayBackend() if os.getenv('OCR_WORKER_TOKEN') else DirectBackend();engine=Engine();logging.info('OCR model ready')
 while True:
  try:
   backend.heartbeat();claim=backend.rpc('digitization_claim')
   if not claim:time.sleep(30);continue
   job=claim['job'];stop=threading.Event()
   def renew():
    while not stop.wait(45):
     try:
      backend.heartbeat()
      if not backend.rpc('digitization_renew',p_id=job['id'],p_lease=job['lease']):return
     except Exception:logging.warning('Lease renewal unavailable')
   thread=threading.Thread(target=renew,daemon=True);thread.start()
   try:
    raw=backend.download(job['original_path'],min(claim['config']['max_bytes'],20971520))
    if hashlib.sha256(raw).hexdigest()!=job['sha256']:raise ValueError('hash_mismatch')
    cached=backend.rpc('digitization_cached',p_id=job['id'])
    if cached:
     result=cached['result'];processed=backend.download(cached['processed_path'],20971520)
     result.update(extract(result['lines'],claim['config']));result['reused_from']=cached['id'];result['elapsed_seconds']=0
    else:
     result,processed=engine.process(raw,claim['config'])
    result['config_revision']=claim['config_revision']
    backend.upload(f"{job['batch_id']}/{job['id']}/processed-{job['lease']}.jpg",processed)
    accepted=backend.rpc('digitization_finish',p_id=job['id'],p_lease=job['lease'],p_result=result)
    logging.info('Job %s completion accepted=%s',job['id'],accepted)
   except Exception as error:
    # Never log request headers, URLs, OCR text or raw exception contents.
    code=str(error) if isinstance(error,ValueError) and str(error) in ('file_too_large','resolution_limit','unsupported_image','animated_image_not_supported','hash_mismatch') else type(error).__name__
    backend.rpc('digitization_finish',p_id=job['id'],p_lease=job['lease'],p_result=None,p_error=code)
    logging.warning('Job %s failed: %s',job['id'],code)
   finally:stop.set();thread.join(timeout=1)
  except KeyboardInterrupt:return
  except Exception as error:
   logging.warning('Worker connection unavailable (%s); retrying',type(error).__name__);time.sleep(10)

if __name__=='__main__':run()
