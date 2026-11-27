import {createHmac,timingSafeEqual,randomBytes} from 'node:crypto';
function key(env){const k=env.AI_ADMIN_TOKEN;if(!k||k.length<32||k===env.AI_PREVIEW_TOKEN)throw Error('Admin unavailable');return k}
const sign=(payload,env)=>createHmac('sha256',key(env)).update('admin-session:'+payload).digest('base64url');
export function issueSession(env=process.env,now=Date.now()){const payload=String(now+900000)+'.'+randomBytes(24).toString('base64url');return payload+'.'+sign(payload,env)}
export function validSession(value,env=process.env,now=Date.now()){try{if(typeof value!=='string'||value.length>200)return false;const [expires,nonce,mac,...rest]=value.split('.');if(rest.length||!/^\d{13}$/.test(expires)||! /^[\w-]{32}$/.test(nonce)||Number(expires)<=now||Number(expires)>now+900000)return false;const a=Buffer.from(mac||''),b=Buffer.from(sign(expires+'.'+nonce,env));return a.length===b.length&&timingSafeEqual(a,b)}catch{return false}}
export function sameOrigin(req){try{return req.headers.get('origin')===new URL(req.url).origin}catch{return false}}
export function sessionCookie(req){return (req.headers.get('cookie')||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('__Host-abhiai-admin='))?.slice('__Host-abhiai-admin='.length)}
