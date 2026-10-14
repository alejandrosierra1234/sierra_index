/* The SDK consumes email credentials. Never log or render tokens or passwords. */
(async () => {
  const status=document.getElementById('status'),form=document.getElementById('password-form');
  const message=(text,error=false)=>{status.textContent=text;status.toggleAttribute('data-error',error);};
  const hash=new URLSearchParams(location.hash.slice(1)),query=new URLSearchParams(location.search);
  const allowedFlows=['invite','recovery'],flow=hash.get('type')||query.get('type');
  const implicit=allowedFlows.includes(flow)&&hash.has('access_token')&&hash.has('refresh_token');
  const code=query.get('code'),tokenHash=query.get('token_hash');
  const verifiedToken=allowedFlows.includes(flow)&&Boolean(tokenHash);
  const callback=implicit||Boolean(code)||verifiedToken;
  const invalid=hash.has('error')||hash.has('error_code')||query.has('error')||query.has('error_code');
  const clean=()=>history.replaceState(null,'',location.pathname);
  if(flow==='recovery')document.getElementById('title').textContent='Restablecer contraseña';
  const expired=()=>{form.hidden=true;message('El enlace no es válido, ya fue utilizado o venció. Vuelve a Index e ingresa tu correo en “Olvidé mi contraseña” para recibir uno nuevo.',true);};
  if(invalid||!callback){clean();expired();return;}
  let client,userId;
  try {
    client=supabase.createClient('https://vhyddogeemohtqijohry.supabase.co','sb_publishable_9g8UJRbV3NxOlmQgPxjDqg_Xw6hFB0f',{auth:{detectSessionInUrl:false}});
    let result;
    if(implicit) result=await client.auth.setSession({access_token:hash.get('access_token'),refresh_token:hash.get('refresh_token')});
    else if(code) result=await client.auth.exchangeCodeForSession(code);
    else result=await client.auth.verifyOtp({type:flow,token_hash:tokenHash});
    clean();
    if(result.error||!result.data?.session){expired();return;}
    const identity=await client.auth.getUser();
    if(identity.error||!identity.data?.user){expired();return;}
    userId=identity.data.user.id;
    document.getElementById('account').textContent=identity.data.user.email||'';
    message('');form.hidden=false;document.getElementById('password').focus();
  } catch {clean();message('No se pudo verificar el enlace. Comprueba tu conexión y abre nuevamente el correo de invitación.',true);return;}
  let saving=false;
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(saving||!form.reportValidity())return;
    const password=document.getElementById('password'),confirm=document.getElementById('confirm'),button=document.getElementById('submit');
    if(password.value!==confirm.value){message('Las contraseñas no coinciden.',true);confirm.focus();return;}
    saving=true;button.disabled=true;message('Guardando contraseña...');
    try {
      const identity=await client.auth.getUser();
      if(identity.error||identity.data?.user?.id!==userId){expired();return;}
      const {error}=await client.auth.updateUser({password:password.value});
      if(error){message(error.message||'No se pudo guardar la contraseña.',true);return;}
      password.value='';confirm.value='';form.hidden=true;
      message('Contraseña guardada. Abriendo Index...');location.replace('./');
    } catch {message('No se pudo completar la solicitud. Comprueba tu conexión e inténtalo de nuevo.',true);}
    finally{saving=false;button.disabled=false;}
  });
})();
