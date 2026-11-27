import {adminSessionAuthorized} from '../../../../lib/admin-auth.mjs';
import {settings,saveProvider,removeProvider,storageEnabled} from '../../../../lib/provider-store.mjs';
export const runtime='nodejs';
const reply=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
async function handle(req,method){if(!adminSessionAuthorized(req))return reply({error:'Unauthorized'},401);if(!storageEnabled())return reply({error:'Database provider mode disabled'},503);try{if(method==='GET')return reply({providers:await settings()});if(!req.headers.get('content-type')?.startsWith('application/json'))return reply({error:'JSON required'},415);const reader=req.body.getReader();let size=0;const chunks=[];while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>16384){await reader.cancel();return reply({error:'Request too large'},413)}chunks.push(Buffer.from(value))}const input=JSON.parse(Buffer.concat(chunks).toString('utf8'));if(method==='PUT')await saveProvider(input);else await removeProvider(input.provider);return reply({ok:true})}catch{return reply({error:'Settings operation failed'},400)}}
export const GET=req=>handle(req,'GET');
export const PUT=req=>handle(req,'PUT');
export const DELETE=req=>handle(req,'DELETE');
