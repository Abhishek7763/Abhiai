import {chat,validateMessages} from '../../../lib/gateway.mjs';
import {timingSafeEqual} from 'node:crypto';
export const runtime='nodejs';
export const maxDuration=60;
function authorized(req){const secret=process.env.AI_PREVIEW_TOKEN;if(!secret||secret.length<32)return false;const a=Buffer.from(req.headers.get('authorization')||''),b=Buffer.from('Bearer '+secret);return a.length===b.length&&timingSafeEqual(a,b)}
export async function POST(req){
if(!authorized(req))return Response.json({error:'Preview access required'},{status:401});
if(!req.headers.get('content-type')?.startsWith('application/json'))return Response.json({error:'JSON required'},{status:415});
let messages;
try{const reader=req.body.getReader();let size=0;const chunks=[];while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>262144){await reader.cancel();return Response.json({error:'Request too large'},{status:413})}chunks.push(Buffer.from(value))}messages=validateMessages(JSON.parse(Buffer.concat(chunks).toString('utf8')).messages)}catch{return Response.json({error:'Invalid request'},{status:400})}
try{return Response.json({answer:await chat(messages)},{headers:{'Cache-Control':'no-store'}})}catch{return Response.json({error:'AI service unavailable'},{status:503})}
}
