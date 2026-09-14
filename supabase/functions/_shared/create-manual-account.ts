// Authentication and authorization use the caller's client, never the service role.
export function createManualAccountHandler(createClient: any, env: Record<string,string>) {
  const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS'};
  const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json'}});
  return async(req:Request)=>{
    if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
    if(req.method!=='POST')return json({error:'Método no permitido.'},405);
    const authorization=req.headers.get('Authorization')||'';
    if(!authorization.startsWith('Bearer '))return json({error:'Inicia sesión para continuar.'},401);
    try {
      const caller=createClient(env.SUPABASE_URL,env.SUPABASE_ANON_KEY,{global:{headers:{Authorization:authorization}},auth:{persistSession:false,autoRefreshToken:false}});
      const {data:identity,error:identityError}=await caller.auth.getUser();
      if(identityError || !identity?.user)return json({error:'Sesión no válida.'},401);
      const {data:authorized,error:authError}=await caller.rpc('authorize',{p_domain:'platform',p_capability:'admin'});
      if(authError || authorized!==true)return json({error:'Solo un administrador activo puede crear cuentas.'},403);
      let body:any;
      try{body=await req.json();}catch{return json({error:'Solicitud no válida.'},400);}
      if(!body || typeof body!=='object' || Array.isArray(body))return json({error:'Solicitud no válida.'},400);
      if(body.action) {
        if(!['resend','delete'].includes(body.action) || typeof body.user_id!=='string' || !/^[0-9a-f-]{36}$/i.test(body.user_id))return json({error:'Acción no válida.'},400);
        if(body.user_id===identity.user.id)return json({error:'Otro administrador debe gestionar tu cuenta.'},403);
        const admin=createClient(env.SUPABASE_URL,env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
        const {data:target,error:targetError}=await admin.auth.admin.getUserById(body.user_id);
        if(targetError || !target?.user)return json({error:'No se encontró la cuenta.'},404);
        const {data:account,error:accountError}=await admin.from('profiles').select('email,account_status,access_deleted_at').eq('id',body.user_id).single();
        if(accountError || !account)return json({error:'No se pudo verificar la cuenta. Comprueba que update44.sql esté aplicada.'},503);
        if(body.action==='resend') {
          if(account.account_status!=='active' || account.access_deleted_at || target.user.deleted_at)return json({error:'Esta cuenta no está activa. No se envió ningún enlace.'},409);
          const email=target.user.email;
          if(!email || email.toLowerCase()!==account.email?.toLowerCase())return json({error:'El correo de la cuenta no coincide con autenticación.'},409);
          const redirectTo='https://alejandrosierra1234.github.io/sierra_index/auth.html';
          const confirmed=!!target.user.email_confirmed_at;
          const {error}=confirmed
            ? await admin.auth.resetPasswordForEmail(email,{redirectTo})
            : await admin.auth.admin.inviteUserByEmail(email,{redirectTo});
          if(error)return json({error:error.status===429?'Espera unos minutos antes de reenviar otro enlace.':error.message},error.status===429?429:400);
          return json({ok:true,kind:confirmed?'recovery':'invitation'});
        }
        if(typeof body.confirm_email!=='string' || body.confirm_email.trim().toLowerCase()!==account.email?.toLowerCase())return json({error:'Escribe el correo exacto para confirmar la eliminación.'},400);
        if(account.access_deleted_at)return json({ok:true,kind:'deleted'});
        // Revoke data access before removing credentials: old JWTs must also be denied.
        const {error:prepareError}=await caller.rpc('prepare_index_account_removal',{p_user:body.user_id,p_email:body.confirm_email});
        if(prepareError)return json({error:prepareError.message},409);
        const {error:deleteError}=target.user.deleted_at?{error:null}:await admin.auth.admin.deleteUser(body.user_id,true);
        if(deleteError)return json({error:'El acceso quedó deshabilitado, pero no se completó la eliminación. Puedes volver a intentarlo.'},502);
        const {error:finishError}=await admin.from('profiles').update({access_deleted_at:new Date().toISOString()}).eq('id',body.user_id);
        if(finishError)return json({error:'Las credenciales se eliminaron y el acceso está bloqueado. Vuelve a intentar para actualizar el estado de la lista.'},502);
        return json({ok:true,kind:'deleted'});
      }
      const email=typeof body.email==='string'?body.email.trim().toLowerCase():'';
      const full_name=typeof body.full_name==='string'?body.full_name.trim():'';
      if(email.length>254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !full_name || full_name.length>160 || /[\x00-\x1f]/.test(full_name))return json({error:'Ingresa un nombre y un correo válidos.'},400);
      if(body.employee_id || (body.account_type && !['manual','external'].includes(body.account_type)) || (body.role && body.role!=='user'))return json({error:'Las cuentas son manuales. Los permisos se asignan por separado.'},400);
      const admin=createClient(env.SUPABASE_URL,env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
      const {data:ready,error:setupError}=await admin.from('index_security_migrations').select('version').eq('version',42).maybeSingle();
      if(setupError || !ready)return json({error:'Falta aplicar update42.sql en Index antes de crear cuentas manuales.'},503);
      const {data,error}=await admin.auth.admin.inviteUserByEmail(email,{
        redirectTo:'https://alejandrosierra1234.github.io/sierra_index/auth.html',
        data:{full_name,role:'user'}
      });
      if(error)return json({error:error.message},400);
      if(!data?.user?.id)return json({error:'No se confirmó la creación. Revisa la lista antes de reenviar.'},502);
      return json({user:{id:data.user.id,email:data.user.email}});
    } catch {
      return json({error:'No se pudo completar la solicitud. Revisa la lista antes de volver a enviarla.'},502);
    }
  };
}
