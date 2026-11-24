const assert=require('node:assert/strict');const {csv,xlsx,unzip}=require('../../js/digitization-core');
(async()=>{
 assert.match(csv([['=HYPERLINK("evil")','+cmd','@SUM(1)','normal']]),/"'=HYPERLINK/);
 const blob=xlsx([['Sample','Value'],['TEST','<script>&=1']]);assert.equal(new DataView(await blob.arrayBuffer()).getUint32(0,true),0x04034b50);
 // The XLSX ZIP must not be accepted as a photo archive.
 await assert.rejects(async()=>{for await(const f of unzip(new File([blob],'bad.zip'))){}},/unsupported file/);
 await assert.rejects(async()=>{for await(const f of unzip(new File(['bad'],'bad.zip'))){}},/invalid/);
 console.log('PASS: safe CSV, XLSX archive, ZIP type and structure rejection');
})().catch(e=>{console.error(e);process.exit(1)});
