import {allowPreviewRequest} from '../../../lib/preview-limit.mjs';
import {streamChat} from '../../../lib/stream-gateway.mjs';
import {runtimeEnv} from '../../../lib/provider-store.mjs';
import {chat,validateMessages,candidates} from '../../../lib/gateway.mjs';
import {timingSafeEqual} from 'node:crypto';
export const runtime='nodejs';
export const maxDuration=60;
function authorized(req){const secret=process.env.AI_PREVIEW_TOKEN;if(!secret||secret.length<32)return false;const a=Buffer.from(req.headers.get('authorization')||''),b=Buffer.from('Bearer '+secret);return a.length===b.length&&timingSafeEqual(a,b)}
export async function POST(req){
if(!authorized(req))return Response.json({error:'Preview access required'},{status:401});
if(!allowPreviewRequest())return Response.json({error:'Too many requests'},{status:429,headers:{'Retry-After':'60','Cache-Control':'no-store'}});
if(!req.headers.get('content-type')?.startsWith('application/json'))return Response.json({error:'JSON required'},{status:415});
let messages,provider,stream;
try{const reader=req.body.getReader();let size=0;const chunks=[];while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>1700000){await reader.cancel();return Response.json({error:'Request too large'},{status:413})}chunks.push(Buffer.from(value))}const payload=JSON.parse(Buffer.concat(chunks).toString('utf8'));messages=validateMessages(payload.messages);provider=payload.provider??'auto';stream=payload.stream===true;if(provider!=='auto'&&typeof provider!=='string')throw Error('Invalid provider')}catch{return Response.json({error:'Invalid request'},{status:400})}
try{const env=await runtimeEnv();if(stream){const iterator=streamChat(messages,{provider,env,signal:req.signal});const encoder=new TextEncoder();const body=new ReadableStream({async pull(controller){try{const {done,value}=await iterator.next();controller.enqueue(encoder.encode(JSON.stringify(done?{done:true}:{delta:value})+'\n'));if(done)controller.close()}catch{controller.enqueue(encoder.encode(JSON.stringify({error:'AI stream unavailable'})+'\n'));controller.close()}},async cancel(){await iterator.return()}});return new Response(body,{headers:{'Content-Type':'application/x-ndjson','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}})}return Response.json({answer:await chat(messages,{provider,env})},{headers:{'Cache-Control':'no-store'}})}catch{return Response.json({error:'AI service unavailable'},{status:503})}
}

export async function GET(req){if(!authorized(req))return Response.json({error:'Preview access required'},{status:401});try{return Response.json({providers:candidates(await runtimeEnv()).map(({id,model})=>({id,model}))},{headers:{'Cache-Control':'no-store'}})}catch{return Response.json({error:'Configuration unavailable'},{status:503})}}
