"""Local evaluation; all images and ground truth remain outside the repository."""
import argparse
import csv
import json
import statistics
import time
from pathlib import Path
from engine import Engine
from extraction import fold

def main():
 p=argparse.ArgumentParser();p.add_argument('manifest',type=Path);p.add_argument('--output',type=Path,required=True);args=p.parse_args()
 items=json.loads(args.manifest.read_text());engine=Engine();results=[];totals={}
 for item in items:
  try:
   result,_=engine.process((args.manifest.parent/item['image']).read_bytes(),{})
   for field,expected in item.get('expected',{}).items():
    stat=totals.setdefault(field,{'correct':0,'reviewed':0});stat['reviewed']+=1
    stat['correct']+=int(fold(result['fields'].get(field,{}).get('value',''))==fold(expected))
   results.append({'image':item['image'],'elapsed_seconds':result['elapsed_seconds'],'warnings':result['warnings'],'fields':result['fields']})
  except Exception as e:results.append({'image':item['image'],'error':type(e).__name__})
 report={'synthetic':all(x.get('synthetic') is True for x in items),'count':len(items),'results':results,'field_accuracy':{k:{**v,'accuracy':v['correct']/v['reviewed']} for k,v in totals.items()},'errors':sum('error'in x for x in results),'pilot_passed':False}
 args.output.write_text(json.dumps(report,ensure_ascii=False,indent=2))
if __name__=='__main__':main()
