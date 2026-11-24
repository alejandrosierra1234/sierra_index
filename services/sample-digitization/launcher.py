"""IT entrypoint for OS service registration. Read secret env file without shell eval."""
import os
from pathlib import Path
root=Path(__file__).resolve().parent
for line in (root/'.env').read_text().splitlines():
 line=line.strip()
 if not line or line.startswith('#'):continue
 key,sep,value=line.partition('=')
 if not sep or key not in ('SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY','OCR_CPU_THREADS','PADDLE_PDX_CACHE_HOME'):raise ValueError('Invalid service environment setting')
 os.environ[key]=value.strip()
os.environ.setdefault('DISABLE_MODEL_SOURCE_CHECK','True')
os.environ.setdefault('PADDLE_PDX_MODEL_SOURCE','BOS')
from worker import run
run()
