/* Keep durable asset references in records; authorize temporary URLs at read time. */
(function(root){
  function create({origin,key,fetch:request,ttl=300}) {
    const prefix=origin+'/storage/v1/object/',cache=new Map();
    let authorization='',epoch=0;
    function path(value){
      if(typeof value!=='string')return null;
      try{const u=new URL(value);if(u.origin!==origin)return null;
        const match=u.pathname.match(/^\/storage\/v1\/object\/(?:public|sign)\/product-images\/(.+)$/);
        return match?decodeURIComponent(match[1]):null;
      }catch{return null;}
    }
    function canonical(value){const p=path(value);return p===null?value:prefix+'public/product-images/'+p.split('/').map(encodeURIComponent).join('/');}
    function scope(token){if(token!==authorization){authorization=token;epoch++;cache.clear();}}
    async function resolve(value){
      const p=path(value);if(p===null)return value;
      const existing=cache.get(p);if(existing&&existing.until>Date.now())return existing.promise;
      const generation=epoch,token=authorization;
      const entry={until:Date.now()+(ttl-30)*1000,promise:null};
      entry.promise=(async()=>{
        const response=await request(prefix+'sign/product-images/'+p.split('/').map(encodeURIComponent).join('/'),{
          method:'POST',headers:{apikey:key,Authorization:token||'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({expiresIn:ttl})
        });
        if(!response.ok)throw Error('Asset access denied');
        const data=await response.json(),signed=data.signedURL||data.signedUrl;
        if(!signed||generation!==epoch)throw Error('Asset session changed');
        const url=new URL(signed.startsWith('/object/')?'/storage/v1'+signed:signed,origin+'/storage/v1/');
        if(url.origin!==origin)throw Error('Invalid asset origin');
        return url.href;
      })().catch(error=>{if(cache.get(p)===entry)cache.delete(p);throw error;});
      cache.set(p,entry);return entry.promise;
    }
    async function map(value,fn){
      if(typeof value==='string')return fn(value);
      if(Array.isArray(value))return Promise.all(value.map(item=>map(item,fn)));
      if(value&&typeof value==='object')return Object.fromEntries(await Promise.all(Object.entries(value).map(async([k,v])=>[await fn(k),await map(v,fn)])));
      return value;
    }
    async function fetch(input,init){
      const url=new URL(typeof input==='string'?input:input.url||input);
      if(url.origin!==origin||!url.pathname.startsWith('/rest/v1/'))return request(input,init);
      const headers=new Headers(init?.headers||input?.headers);
      scope(headers.get('Authorization')||'');
      const generation=epoch;
      let options=init;
      if(typeof init?.body==='string'&&headers.get('Content-Type')?.includes('application/json')){
        try{options={...init,body:JSON.stringify(await map(JSON.parse(init.body),canonical))};}catch{}
      }
      const response=await request(input,options);
      if(!response.ok||!response.headers.get('content-type')?.includes('application/json'))return response;
      const data=await response.json();
      const hydrated=await map(data,async value=>{
        if(generation!==epoch)return canonical(value);
        try{return await resolve(value);}catch{return canonical(value);}
      });
      const responseHeaders=new Headers(response.headers);responseHeaders.delete('content-length');responseHeaders.delete('content-encoding');
      return new Response(JSON.stringify(hydrated),{status:response.status,statusText:response.statusText,headers:responseHeaders});
    }
    async function images(doc){await Promise.all(Array.from(doc.images||[],async img=>{
      const original=img.getAttribute('src');if(path(original)===null)return;
      const signed=await resolve(original);
      if(img.getAttribute('src')===original){img.crossOrigin='anonymous';img.src=signed;}
    }));}
    async function html(markup){const doc=new DOMParser().parseFromString(markup,'text/html');await images(doc);return '<!doctype html>'+doc.documentElement.outerHTML;}
    return {path,canonical,resolve,fetch,images,html,scope};
  }
  if(typeof module!=='undefined')module.exports={create};else root.IndexPrivateAssets={create};
})(typeof window==='undefined'?globalThis:window);
