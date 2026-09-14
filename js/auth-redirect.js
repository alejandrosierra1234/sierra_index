// Older email links may return to the site root. Preserve the callback for the SDK.
(() => {
  const hash=new URLSearchParams(location.hash.slice(1));
  if(['invite','recovery'].includes(hash.get('type'))||hash.has('error')||hash.has('error_code')) {
    window.INDEX_AUTH_REDIRECT=true;
    location.replace(new URL('auth.html',location.href).pathname+location.search+location.hash);
  }
})();
