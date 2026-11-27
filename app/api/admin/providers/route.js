import {adminAuthorized} from '../../../../lib/admin-auth.mjs';
import {candidates} from '../../../../lib/gateway.mjs';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(req){const headers={'Cache-Control':'no-store'};if(!adminAuthorized(req))return Response.json({error:'Unauthorized'},{status:401,headers});const eligible=new Set(candidates().map(p=>p.id));return Response.json({paidEnabled:process.env.AI_ALLOW_PAID==='true',providers:['openrouter','gemini','nvidia','groq','cerebras','openai'].map(id=>({id,keyConfigured:!!process.env[id.toUpperCase()+'_API_KEY'],model:process.env[id.toUpperCase()+'_MODEL']||null,eligible:eligible.has(id)}))},{headers})}
