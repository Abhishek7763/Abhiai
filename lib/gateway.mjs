// Provider adapter pattern adapted from the original AbhiAI archive.
const endpoints={openrouter:'https://openrouter.ai/api/v1/chat/completions',groq:'https://api.groq.com/openai/v1/chat/completions',nvidia:'https://integrate.api.nvidia.com/v1/chat/completions'};
export function candidates(env=process.env){
return Object.entries(endpoints).flatMap(([id,url])=>{const prefix=id.toUpperCase(),key=env[prefix+'_API_KEY'],model=env[prefix+'_MODEL'];return key&&model&&id==='openrouter'&&model.endsWith(':free')?[{id,url,key,model}]:[]});
}
export function validateMessages(value){if(!Array.isArray(value)||value.length<1||value.length>30)throw new Error('Invalid messages');let total=0;for(const m of value){if(!m||!['user','assistant'].includes(m.role)||typeof m.content!=='string'||!m.content.trim()||m.content.length>12000)throw new Error('Invalid messages');total+=m.content.length;}if(total>48000||value.at(-1).role!=='user')throw new Error('Invalid messages');return value.map(({role,content})=>({role,content}));}
export async function chat(messages,{env=process.env,request=fetch}={}){
const clean=validateMessages(messages);for(const p of candidates(env)){const r=await request(p.url,{method:'POST',redirect:'error',headers:{Authorization:'Bearer '+p.key,'Content-Type':'application/json'},body:JSON.stringify({model:p.model,messages:clean,max_tokens:1024}),signal:AbortSignal.timeout(20000)});if(!r.ok)throw new Error('Provider unavailable');const data=await r.json();const answer=data.choices?.[0]?.message?.content;if(typeof answer!=='string'||!answer.trim())throw new Error('Invalid provider response');return answer;}throw new Error('No verified free model configured');
}
