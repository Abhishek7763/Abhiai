import {timingSafeEqual} from 'node:crypto';
export function adminAuthorized(req,env=process.env){const secret=env.AI_ADMIN_TOKEN;if(!secret||secret.length<32||secret===env.AI_PREVIEW_TOKEN)return false;const a=Buffer.from(req.headers.get('authorization')||''),b=Buffer.from('Bearer '+secret);return a.length===b.length&&timingSafeEqual(a,b)}
