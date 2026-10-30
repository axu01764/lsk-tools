import {existsSync,mkdirSync,readdirSync,readFileSync,writeFileSync,copyFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';

const root=fileURLToPath(new URL('../',import.meta.url));
const destination=resolve(process.argv[2]||resolve(root,'../deliverables/lsk-tools-template-candidate'));
if(existsSync(destination))throw new Error('Destination already exists; choose a new folder to preserve existing work.');
if(destination===root||root.startsWith(destination+'/'))throw new Error('Invalid destination.');
if(!existsSync(resolve(root,'dist/client/index.html')))throw new Error('Build the project first.');
const entries=[];
function add(from,to=from){
  const source=resolve(root,from),target=resolve(destination,to),data=readFileSync(source);
  if(/\.(json|jsx?|mjs|html|css|md|toml)$/.test(from)&&/sk-[a-zA-Z0-9]{20,}/.test(data.toString()))throw new Error('Credential-shaped content detected in '+from);
  entries.push({source,target,path:to.replaceAll('\\','/'),bytes:data.length,sha256:createHash('sha256').update(data).digest('hex')});
}
function tree(folder){
  for(const entry of readdirSync(resolve(root,folder),{withFileTypes:true})){
    const path=folder+'/'+entry.name;
    if(entry.isSymbolicLink())throw new Error('Symlink is not allowed: '+path);
    if(entry.isDirectory())tree(path);
    else if(!/-preview\.(jsx|html)$/.test(entry.name))add(path);
  }
}
for(const folder of ['src','public','worker','.openai','tests','scripts','dist'])tree(folder);
for(const file of ['package.json','package-lock.json','.npmrc','index.html','vite.config.mjs','CONFIGURATION.md','HANDOFF.md'])add(file);
add('HANDOFF.md','README.md');
add(existsSync(resolve(root,'reference/routes.json'))?'reference/routes.json':'../reference/jingli/routes.json','reference/routes.json');
// Validate every source before writing anything; never overwrite an existing delivery.
mkdirSync(destination,{recursive:true});
for(const entry of entries){mkdirSync(dirname(entry.target),{recursive:true});copyFileSync(entry.source,entry.target);}
const files=entries.map(({path,bytes,sha256})=>({path,bytes,sha256})).sort((a,b)=>a.path.localeCompare(b.path));
writeFileSync(resolve(destination,'PACKAGE-MANIFEST.json'),JSON.stringify({createdAt:new Date().toISOString(),status:'handoff-candidate; final visual comparison pending',files},null,2)+'\n');
console.log(JSON.stringify({destination,files:files.length,bytes:files.reduce((n,f)=>n+f.bytes,0)}));
