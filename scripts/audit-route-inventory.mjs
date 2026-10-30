import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {resolveRoute} from '../src/routes.js';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=path=>JSON.parse(readFileSync(resolve(root,path),'utf8'));
const products=read('src/products.json'),site=read('src/site-config.json');
const source=read(existsSync(resolve(root,'reference/routes.json'))?'reference/routes.json':'../reference/jingli/routes.json');
const mapped={
  '/product/cordless-power-tools/cordless-drill/':'/product/cordless-drills/',
  '/product/cordless-power-tools/impact-wrench/':'/product/impact-wrenches/'
};
const entries=source.map(url=>{
  const path=new URL(url).pathname;
  if(resolveRoute(path,products,site.news).kind!=='not-found')return {source:path,status:'local-route',target:path};
  if(mapped[path])return {source:path,status:'mapped-to-lsk-category',target:mapped[path]};
  if(path.startsWith('/product/')&&path.endsWith('.html'))return {source:path,status:'data-driven-product-template',target:'/product/:configured-product-id/',note:'Source manufacturer record not imported; local sample product routes demonstrate the shared detail template.'};
  if(path.startsWith('/product/'))return {source:path,status:'data-driven-category-template',target:'/product/:configured-category/',note:'No LSK products configured for this source category; add verified product data to instantiate a category.'};
  if(path.startsWith('/news/')&&path.endsWith('.html'))return {source:path,status:'data-driven-news-template',target:'/news/:category/:configured-id.html',note:'Original company article not republished as LSK news.'};
  return {source:path,status:'unmapped',target:null};
});
const counts=Object.fromEntries([...new Set(entries.map(item=>item.status))].map(status=>[status,entries.filter(item=>item.status===status).length]));
const report={generatedAt:new Date().toISOString(),scope:'Static captured route inventory and current resolver. Template-family coverage is not a claim that source records or all source URLs are instantiated, nor a visual/interaction audit.',counts,entries,external:[{source:'https://www.720yun.com/vr/383jO0tfra8',status:'source-only-external-integration',note:'Reference manufacturer VR; not presented as an LSK factory tour. Local supplied video and factory gallery are separate assets, not a VR replica.'}]};
mkdirSync(resolve(root,'reports'),{recursive:true});
writeFileSync(resolve(root,'reports/route-inventory.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({counts,unmapped:entries.filter(item=>item.status==='unmapped')},null,2));
if(counts.unmapped)process.exitCode=1;
