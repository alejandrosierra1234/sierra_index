// Older email links may return to the site root. Preserve the callback for the SDK.
(() => {
  const hash=new URLSearchParams(location.hash.slice(1)),query=new URLSearchParams(location.search);
  const flow=hash.get('type')||query.get('type');
  const callback=['invite','recovery'].includes(flow)||query.has('code')||query.has('token_hash');
  const invalid=hash.has('error')||hash.has('error_code')||query.has('error')||query.has('error_code');
  if(callback||invalid) {
    window.INDEX_AUTH_REDIRECT=true;
    location.replace(new URL('auth.html',location.href).pathname+location.search+location.hash);
  }
})();
