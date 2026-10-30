export const PRODUCT_PAGE_SIZE=12;
export function readProductPage(path,search=''){
  const raw=path.match(/\/page\/([1-9]\d*)\/$/)?.[1] || new URLSearchParams(search).get('page');
  const page=Number(raw);
  return Number.isSafeInteger(page)&&page>0?page:1;
}
export function productArchiveHref(base,page,query=''){
  const params=new URLSearchParams();
  if(query.trim())params.set('q',query.trim());
  // HTML entry points are used by isolated development fixtures.
  if(base.endsWith('.html')&&page>1)params.set('page',String(page));
  const path=base.endsWith('.html')||page===1?base:base+'page/'+page+'/';
  return path+(params.size?'?'+params.toString():'');
}
export function paginateProducts(items,page){
  const pages=Math.max(1,Math.ceil(items.length/PRODUCT_PAGE_SIZE));
  const current=Math.min(Math.max(1,page),pages);
  return {pages,current,items:items.slice((current-1)*PRODUCT_PAGE_SIZE,current*PRODUCT_PAGE_SIZE)};
}
