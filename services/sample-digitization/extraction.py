"""Deterministic, evidence-preserving textile extraction. Never completes missing facts."""
import hashlib
import json
import re
import unicodedata

VERSION = '1.0.0'
ALIASES = {
 'Development Code': ['development code','dev code','codigo desarrollo','codigo de desarrollo','ref'],
 'Style Number': ['style number','style no','style'], 'Sample ID': ['sample id','muestra'],
 'Customer': ['customer','cliente'], 'Mill': ['mill','fabrica'],
 'Construction': ['fabric construction','construction','construccion','tejido'],
 'Composition': ['composition','composicion','fiber content','contenido de fibras'],
 'Yarn Count': ['yarn count','titulo'], 'Yarn Type': ['yarn type','tipo de hilo'],
 'Fabric Weight': ['fabric weight','peso'], 'GSM': ['gsm','gramaje','g/m2','g/m²'],
 'Width': ['width','ancho'], 'Color': ['color'], 'Color Code': ['color code','codigo color'],
 'Dyeing Process': ['dyeing process','tenido'], 'Finishing Process': ['finishing process','acabado'],
 'Lot Number': ['lot number','lot no','lot','lote'], 'Batch Number': ['batch number','batch'],
 'Date': ['date','fecha'], 'Certifications': ['certifications','certificaciones'],
 'Technical Notes': ['technical notes','notes','notas']
}
FIBERS = {'co':'Cotton','cot':'Cotton','cotton':'Cotton','algodon':'Cotton','pes':'Polyester','polyester':'Polyester','poliester':'Polyester','el':'Elastane','ea':'Elastane','spandex':'Elastane','elastane':'Elastane','elastano':'Elastane','viscose':'Viscose','viscosa':'Viscose','rayon':'Rayon','nylon':'Nylon','pa':'Polyamide','polyamide':'Polyamide','linen':'Linen','lino':'Linen','wool':'Wool','lana':'Wool','lyocell':'Lyocell','modal':'Modal'}

def fold(value):
 return ''.join(c for c in unicodedata.normalize('NFKD',str(value).lower()) if not unicodedata.combining(c)).strip()

def validate(fields, config):
 warnings=[]
 for key in config.get('required',['Development Code']):
  if not fields.get(key,{}).get('value'): warnings.append({'field':key,'code':'required'})
 for key,f in fields.items():
  if f.get('ocr_confidence',0)<config.get('ocr_threshold',.85): warnings.append({'field':key,'code':'low_ocr'})
  if f.get('interpretation_confidence',0)<config.get('interpretation_threshold',.9): warnings.append({'field':key,'code':'uncertain_interpretation'})
  if f.get('conflicts'): warnings.append({'field':key,'code':'contradictory_values'})
  norm=f.get('normalized',{})
  if key=='Composition':
   fibers=norm.get('fibers',[])
   if not fibers or abs(sum(x['percent'] for x in fibers)-100)>.1: warnings.append({'field':key,'code':'composition_total'})
   if any(not x['known'] for x in fibers): warnings.append({'field':key,'code':'unknown_fiber'})
  if key in ('GSM','Width','Fabric Weight'):
   if not norm: warnings.append({'field':key,'code':'unknown_unit_or_value'})
   elif key in config.get('ranges',{}) and not config['ranges'][key][0]<=norm['value']<=config['ranges'][key][1]: warnings.append({'field':key,'code':'out_of_range'})
  allowed=config.get('allowed_values',{}).get(key)
  if allowed and f.get('value') not in allowed: warnings.append({'field':key,'code':'unknown_nomenclature'})
 if fields.get('GSM',{}).get('normalized') and fields.get('Fabric Weight',{}).get('normalized'):
  a,b=fields['GSM']['normalized'],fields['Fabric Weight']['normalized']
  if a['unit']==b['unit'] and abs(a['value']-b['value'])>1: warnings.append({'field':'Fabric Weight','code':'weight_conflict'})
 return warnings

def normalize(key,value):
 if key=='Composition':
  matches=re.findall(r'(\d+(?:[.,]\d+)?)\s*%\s*([A-Za-zÀ-ÿ]+)',value)
  return {'fibers':[{'percent':float(n.replace(',','.')),'fiber':FIBERS.get(fold(f),f),'original':f,'known':fold(f) in FIBERS} for n,f in matches]}
 if key in ('Width','GSM','Fabric Weight'):
  m=re.fullmatch(r'\s*(\d+(?:[.,]\d+)?)\s*([A-Za-z²2/". ]*)\s*',value)
  if not m:return None
  n=float(m[1].replace(',','.'));unit=fold(m[2]).replace(' ','')
  if key=='Width':
   if unit in ('cm','cms'):return {'value':n,'unit':'cm'}
   if unit in ('in','inch','inches','"'):return {'value':round(n*2.54,4),'unit':'cm'}
   if unit=='m':return {'value':n*100,'unit':'cm'}
  else:
   if unit in ('gsm','g/m2','g/m²') or (key=='GSM' and not unit):return {'value':n,'unit':'g/m²'}
   if unit in ('oz/yd2','oz/yd²'):return {'value':round(n*33.905747,4),'unit':'g/m²'}
 return None

def extract(lines, config=None):
 config=config or {};aliases={**ALIASES}
 for key,values in config.get('aliases',{}).items(): aliases[key]=aliases.get(key,[])+values
 # Templates add exact label aliases; no executable expressions or inferred values.
 full='\n'.join(x['text'] for x in lines)
 template_id=None
 for template in config.get('templates',[]):
  if template.get('contains') and fold(template['contains']) in fold(full):
   template_id=template.get('name')
   for key,values in template.get('aliases',{}).items():aliases[key]=aliases.get(key,[])+values
   break
 lookup=sorted([(fold(alias),key) for key,values in aliases.items() for alias in values],key=lambda x:-len(x[0]))
 fields={};used=set()
 for i,line in enumerate(lines):
  raw=line['text'].strip();lower=fold(raw)
  for alias,key in lookup:
   if lower==alias or lower.startswith(alias+':') or lower.startswith(alias+' ') or lower.startswith(alias+'='):
    value=raw[len(alias):].lstrip(' :=\t');sources=[i];confidence=.98
    if not value and i+1<len(lines):
     nxt=lines[i+1];box=line['polygon'];nb=nxt['polygon']
     # Accept an adjacent aligned line only, and never swallow the next field label.
     if abs(nb[0][0]-box[0][0])<max(40,box[1][0]-box[0][0]) and 0<=nb[0][1]-box[2][1]<max(60,3*(box[2][1]-box[0][1])) and not any(fold(nxt['text']).startswith(a+':') or fold(nxt['text'])==a for a,_ in lookup):
      value=nxt['text'].strip();sources.append(i+1);confidence=.75
    if not value:break
    field={'value':value,'original':value,'source_lines':sources,'ocr_confidence':min(lines[n]['confidence'] for n in sources),'interpretation_confidence':confidence,'normalized':normalize(key,value),'method':'label_rule'}
    if key in fields and fields[key]['value']!=value:
     fields[key].setdefault('conflicts',[]).append(field);fields[key]['interpretation_confidence']=0
    else:fields[key]=field
    used.update(sources);break
 warnings=validate(fields,config)
 if not lines:warnings.append({'field':None,'code':'no_readable_text'})
 technical={k:fields[k].get('normalized') or fields[k]['value'] for k in ('Composition','Construction','GSM','Width','Yarn Count') if k in fields}
 return {'technical_fingerprint':hashlib.sha256(json.dumps(technical,sort_keys=True).encode()).hexdigest() if len(technical)>=3 else '', 'fields':fields,'warnings':warnings,'text':full,'unmapped_lines':[i for i in range(len(lines)) if i not in used], 'template':template_id,'parser_version':VERSION,'text_fingerprint':hashlib.sha256(fold(full).encode()).hexdigest() if full.strip() else ''}
