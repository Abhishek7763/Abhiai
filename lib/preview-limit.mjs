export function createLimiter({limit=12,windowMs=60000,clock=Date.now}={}){let start=clock(),count=0;return ()=>{const now=clock();if(now-start>=windowMs){start=now;count=0}if(count>=limit)return false;count++;return true}}
export const allowPreviewRequest=createLimiter();
