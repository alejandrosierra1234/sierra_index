const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {JSDOM}=require('../communications/node_modules/jsdom');
const root=path.join(__dirname,'../..'),html=fs.readFileSync(path.join(root,'auth.html'),'utf8'),script=fs.readFileSync(path.join(root,'js/auth-callback.js'),'utf8');
async function fixture(callback,{callbackError=false}={}) {
 const dom=new JSDOM(html,{url:'https://test.local/sierra_index/auth.html'+callback,runScripts:'outside-only'}),w=dom.window;
 let userId='invited',updates=0,clients=0,method='';
 const result=async name=>{method=name;return callbackError?{data:{session:null},error:{}}:{data:{session:{user:{id:userId}}},error:null};};
 w.supabase={createClient:()=>{clients++;return {auth:{setSession:async()=>result('setSession'),exchangeCodeForSession:async()=>result('exchangeCodeForSession'),verifyOtp:async()=>result('verifyOtp'),getUser:async()=>({data:{user:{id:userId,email:'invited@test.local'}}}),updateUser:async()=>{updates++;return {error:{message:'Simulated offline retry'}};}}};}};
 await vm.runInContext(script,dom.getInternalVMContext());
 return {w,close:()=>w.close(),switchAccount:()=>{userId='someone-else';},counts:()=>({updates,clients,method})};
}
(async()=>{
 const valid='#type=invite&access_token=fake-test-token&refresh_token=fake-test-refresh';
 let f=await fixture(valid);
 assert.equal(f.w.document.getElementById('password-form').hidden,false);assert.equal(f.w.location.hash,'');
 f.w.document.getElementById('password').value='Example-test-password';f.w.document.getElementById('confirm').value='Different-test-password';
 f.w.document.getElementById('password-form').dispatchEvent(new f.w.Event('submit',{cancelable:true}));
 assert.match(f.w.document.getElementById('status').textContent,/no coinciden/);assert.equal(f.counts().updates,0);
 f.w.document.getElementById('confirm').value='Example-test-password';
 f.w.document.getElementById('password-form').dispatchEvent(new f.w.Event('submit',{cancelable:true}));await new Promise(r=>setTimeout(r,0));
 assert.equal(f.counts().updates,1);assert.equal(f.w.document.getElementById('submit').disabled,false);
 f.switchAccount();f.w.document.getElementById('password-form').dispatchEvent(new f.w.Event('submit',{cancelable:true}));await new Promise(r=>setTimeout(r,0));
 assert.equal(f.counts().updates,1);assert.equal(f.w.document.getElementById('password-form').hidden,true);f.close();
 for(const hash of ['', '#error=access_denied&error_code=otp_expired']){
   f=await fixture(hash);assert.equal(f.counts().clients,0);assert.equal(f.w.document.getElementById('password-form').hidden,true);assert.match(f.w.document.getElementById('status').textContent,/enlace no es válido/);f.close();
 }
 f=await fixture(valid,{callbackError:true});assert.equal(f.w.document.getElementById('password-form').hidden,true);assert.equal(f.counts().updates,0);f.close();
 f=await fixture(valid.replace('invite','recovery'));assert.equal(f.w.document.getElementById('title').textContent,'Restablecer contraseña');f.close();
 for(const [callback,method] of [['?code=fake-test-code','exchangeCodeForSession'],['?type=invite&token_hash=fake-test-hash','verifyOtp']]){
   f=await fixture(callback);assert.equal(f.w.document.getElementById('password-form').hidden,false);assert.equal(f.w.location.search,'');assert.equal(f.counts().method,method);f.close();
 }
 const redirect=fs.readFileSync(path.join(root,'js/auth-redirect.js'),'utf8');let destination;
 const context={window:{},URL,URLSearchParams,location:{hash:valid,search:'?next=https://evil.test',href:'https://test.local/sierra_index/'+valid,replace:value=>{destination=value;}}};
 vm.runInNewContext(redirect,context);assert.equal(context.window.INDEX_AUTH_REDIRECT,true);assert.ok(destination.startsWith('/sierra_index/auth.html?'));assert.ok(!destination.startsWith('https://evil'));
 destination='';context.location={hash:'',search:'?code=fake-test-code',href:'https://test.local/sierra_index/?code=fake-test-code',replace:value=>{destination=value;}};
 vm.runInNewContext(redirect,context);assert.equal(destination,'/sierra_index/auth.html?code=fake-test-code');
 console.log('PASS: implicit, PKCE and token-hash callbacks, clean URLs, expired links, password mismatch, account switches, SDK errors, fixed redirect target');
})().catch(error=>{console.error(error);process.exitCode=1});
