import sys
import unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[2]/'services/sample-digitization'))
from extraction import extract,normalize

def lines(*values):return [{'text':v,'confidence':.98,'polygon':[[0,i*40],[500,i*40],[500,i*40+30],[0,i*40+30]]} for i,v in enumerate(values)]
class ExtractionTest(unittest.TestCase):
 def test_english(self):
  r=extract(lines('Development Code: TEST-001','Composition: 95% Cotton 5% Elastane','GSM: 180','Width: 60 in'))
  self.assertEqual(r['fields']['Width']['normalized'],{'value':152.4,'unit':'cm'});self.assertFalse(r['warnings'])
 def test_spanish(self):
  r=extract(lines('Código de desarrollo: TEST-002','Composición: 60% Algodón 40% Poliéster','Gramaje: 220'))
  self.assertEqual(r['fields']['Composition']['normalized']['fibers'][1]['fiber'],'Polyester')
 def test_no_invention(self):
  r=extract(lines('Navy 180','some illegible text'));self.assertEqual(r['fields'],{});self.assertEqual(r['unmapped_lines'],[0,1])
 def test_conflict(self):self.assertIn('contradictory_values',[w['code'] for w in extract(lines('GSM: 180','GSM: 200'))['warnings']])
 def test_bad_sum(self):self.assertIn('composition_total',[w['code'] for w in extract(lines('Composition: 80% CO 5% EL'))['warnings']])
 def test_no_guessed_units(self):self.assertIsNone(normalize('Width','60'))
 def test_unknown_fiber(self):self.assertIn('unknown_fiber',[w['code'] for w in extract(lines('Composition: 100% Unknown'))['warnings']])
 def test_separate_confidence(self):
  r=extract(lines('Development Code','TEST-001'));f=r['fields']['Development Code'];self.assertEqual(f['ocr_confidence'],.98);self.assertEqual(f['interpretation_confidence'],.75)
 def test_custom_template(self):
  r=extract(lines('MILL TEMPLATE','Reference: ABC'),{'templates':[{'name':'Mill','contains':'MILL TEMPLATE','aliases':{'Development Code':['Reference']}}]});self.assertEqual(r['fields']['Development Code']['value'],'ABC')
 def test_never_take_next_label(self):
  r=extract(lines('Development Code','GSM: 180'));self.assertNotIn('Development Code',r['fields'])
if __name__=='__main__':unittest.main()
