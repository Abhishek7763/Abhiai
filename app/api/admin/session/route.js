import {adminAuthorized,adminSessionAuthorized} from '../../../../lib/admin-auth.mjs';
import {issueSession,sameOrigin} from '../../../../lib/admin-session.mjs';
export const runtime='nodejs';
const reply=(body,status=200,cookie)=>Response.json(body,{status,headers:{'Cache-Control':'no-store',...(cookie?{'Set-Cookie':cookie}:{})}});
const attrs='; Path=/; HttpOnly; Secure; SameSite=Strict';
export async function POST(req){if(!sameOrigin(req)||!adminAuthorized(req))return reply({error:'Access denied'},401);return reply({ok:true},200,'__Host-abhiai-admin='+issueSession()+attrs+'; Max-Age=900')}
export async function GET(req){return reply({ok:adminSessionAuthorized(req)},adminSessionAuthorized(req)?200:401)}
export async function DELETE(req){if(!sameOrigin(req))return reply({error:'Access denied'},403);return reply({ok:true},200,'__Host-abhiai-admin='+attrs+'; Max-Age=0')}
