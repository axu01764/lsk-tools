import {readdir,readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve,relative,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const directory=resolve(root,'dist/client');
const base=process.argv[2]||'http://127.0.0.1:4174/';
async function files(path){const entries=await readdir(path,{withFileTypes:true});return (await Promise.all(entries.map(entry=>entry.isDirectory()?files(resolve(path,entry.name)):[resolve(path,entry.name)]))).flat();}
const hash=buffer=>createHash('sha256').update(buffer).digest('hex');
const rows=[];
for(const file of await files(directory)){
  const path=relative(directory,file).split(sep).join('/');
  const response=await fetch(new URL(path.split('/').map(encodeURIComponent).join('/'),base));
  const served=Buffer.from(await response.arrayBuffer()),built=await readFile(file);
  rows.push({path,status:response.status,bytes:served.length,sha256:hash(built),matchesBuild:response.ok&&hash(served)===hash(built)});
}
const failures=rows.filter(row=>!row.matchesBuild);
const report={generatedAt:new Date().toISOString(),base,scope:'Every file in dist/client fetched and SHA-256 compared with the built artifact. This does not exercise a remote hosting deployment or rendered interactions.',files:rows.length,totalBytes:rows.reduce((sum,row)=>sum+row.bytes,0),failures,rows};
await mkdir(resolve(root,'reports'),{recursive:true});
await writeFile(resolve(root,'reports/production-assets-audit.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({files:report.files,totalBytes:report.totalBytes,failures},null,2));
if(failures.length)process.exitCode=1;
