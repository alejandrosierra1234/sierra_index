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
