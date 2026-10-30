import {capacityGroups} from './capacity-content.js';
import {newsPath} from './news-model.js';
import {productCategories,productCategoryPath} from './product-categories.js';
export function normalizePath(pathname) {
  try {
    const decoded = decodeURI(pathname).replace(/\/{2,}/g, '/');
    return decoded.endsWith('.html') || decoded.endsWith('/') ? decoded : decoded + '/';
  } catch {
    return null;
  }
}

const pages = new Set([
  '/', '/about/', '/privacy-policy/', '/factory/', '/about/factory/', '/corporate-culture/',
  '/about/corporate-culture/', '/honor/', '/about/certificate/', '/faq/', '/about/faq/',
  '/capacity/', '/capacity/intelligent-production/',
  '/capacity/intelligent-production/smart-factory.html',
  '/capacity/strict-quality-control/', '/capacity/quality-control/',
  '/capacity/oem-odm/', '/oem-odm/', '/contact/', '/news/', '/news/company-news/', '/news/industry-news/',
  '/product/', '/product/cordless-drills/', '/product/impact-wrenches/',
  ...capacityGroups.flatMap(group => group.pages.map(page => page.path))
]);

export function resolveRoute(pathname, products, news) {
  const path = normalizePath(pathname);
  if (!path) return { kind: 'not-found', path: pathname };
  const categoryPaths=new Set(productCategories(products).map(productCategoryPath));
  const archivePaths=new Set(['/product/','/product/cordless-drills/','/product/impact-wrenches/',...categoryPaths]);
  const paged=path.match(/^(\/product\/(?:[^/]+\/)?)page\/([1-9]\d*)\/$/);
  if(paged&&archivePaths.has(paged[1])&&Number.isSafeInteger(Number(paged[2])))return {kind:'page',path:paged[1],pageNumber:Number(paged[2])};
  const product = products.find(item => path === `/product/${item.id}/`);
  if (product) return {kind:'product',path,product};
  const article = news.find(item => path === newsPath(item) || path === `/news/${item.id}/`);
  if (article) return {kind:'article',path,article};
  return {kind:pages.has(path)||categoryPaths.has(path) ? 'page' : 'not-found',path};
}
