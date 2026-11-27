const base=process.env.NEXT_PUBLIC_SUPABASE_URL;
const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
async function call(path,{token,method='GET',body}={}){if(!base||!key)throw Error('Cloud configuration missing');const url=new URL(base);if(url.protocol!=='https:'||url.hostname!=='bpvochmjcxhsmftncdvv.supabase.co')throw Error('Invalid cloud endpoint');const r=await fetch(url.origin+path,{method,headers:{apikey:key,'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},...(body?{body:JSON.stringify(body)}:{}),cache:'no-store',redirect:'error'});if(!r.ok)throw Error(r.status===401?'Session expired or invalid credentials':'Cloud operation failed');const raw=await r.text();return raw?JSON.parse(raw):null}
export async function login(email,password){const session=await call('/auth/v1/token?grant_type=password',{method:'POST',body:{email,password}});if(!session.access_token||!session.user?.id||session.user.is_anonymous)throw Error('Private account required');return {token:session.access_token,user:session.user.id}}
export const logout=token=>call('/auth/v1/logout',{method:'POST',token});
export const conversations=token=>call('/rest/v1/conversations?select=id,title,created_at&order=created_at.desc&limit=100',{token});
export const messages=(token,id)=>call('/rest/v1/messages?select=id,role,content,created_at&conversation_id=eq.'+encodeURIComponent(id)+'&order=created_at.asc,id.asc&limit=500',{token});
export const createConversation=(session,title)=>{const id=crypto.randomUUID();return call('/rest/v1/conversations',{method:'POST',token:session.token,body:{id,user_id:session.user,title:title.slice(0,200)}}).then(()=>id)};
export const addMessage=(session,id,role,content)=>call('/rest/v1/messages',{method:'POST',token:session.token,body:{conversation_id:id,user_id:session.user,role,content}});
export const deleteConversation=(token,id)=>call('/rest/v1/conversations?id=eq.'+encodeURIComponent(id),{method:'DELETE',token});
