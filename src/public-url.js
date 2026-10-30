export function inspectPublicUrl(value) {
  if(value==null || (typeof value==='string' && !value.trim())) return {url:null,error:null};
  try {
    if(typeof value!=='string') throw new Error();
    const url=new URL(value.trim());
    if(!['http:','https:'].includes(url.protocol) || url.username || url.password) throw new Error();
    return {url:url.href,error:null};
  } catch {
    return {url:null,error:'publicUrl must be empty or an absolute HTTP(S) website URL without credentials.'};
  }
}

export function resolvePublicUrl(value,fallback) {
  return inspectPublicUrl(value).url || fallback;
}
