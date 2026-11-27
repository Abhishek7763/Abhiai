const records=new Map();
export function record(id,ok,ms,now=Date.now()){const old=records.get(id)||{success:0,failure:0,consecutive:0};const consecutive=ok?0:old.consecutive+1;records.set(id,{success:old.success+Number(ok),failure:old.failure+Number(!ok),consecutive,latencyMs:Math.max(0,Math.round(ms)),lastAttempt:now,cooldownUntil:consecutive>=3?now+60000:0})}
export function available(id,now=Date.now()){return (records.get(id)?.cooldownUntil||0)<=now}
export function health(id){return records.get(id)||{success:0,failure:0,consecutive:0,latencyMs:null,lastAttempt:null,cooldownUntil:0}}
