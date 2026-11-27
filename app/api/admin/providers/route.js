import {adminAuthorized} from '../../../../lib/admin-auth.mjs';
import {candidates} from '../../../../lib/gateway.mjs';
import {runtimeEnv,ids,storageEnabled} from '../../../../lib/provider-store.mjs';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(req){const headers={'Cache-Control':'no-store'};if(!adminAuthorized(req))return Response.json({error:'Unauthorized'},{status:401,headers});try{const env=await runtimeEnv();const eligible=new Set(candidates(env).map(p=>p.id));return Response.json({databaseMode:storageEnabled(),paidEnabled:env.AI_ALLOW_PAID==='true',providers:ids.map(id=>({id,keyConfigured:!!env[id.toUpperCase()+'_API_KEY'],model:env[id.toUpperCase()+'_MODEL']||null,eligible:eligible.has(id)}))},{headers})}catch{return Response.json({error:'Configuration unavailable'},{status:503,headers})}}
