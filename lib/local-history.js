function openDB(){return new Promise((resolve,reject)=>{const r=indexedDB.open('abhiai-local',1);r.onupgradeneeded=()=>r.result.createObjectStore('chats',{keyPath:'id'});r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
async function run(mode,operation){const db=await openDB();try{return await new Promise((resolve,reject)=>{const tx=db.transaction('chats',mode);const req=operation(tx.objectStore('chats'));tx.oncomplete=()=>resolve(req.result);tx.onabort=()=>reject(tx.error);tx.onerror=()=>reject(tx.error)})}finally{db.close()}}
export const listChats=()=>run('readonly',s=>s.getAll());
export const saveChat=chat=>run('readwrite',s=>s.put(chat));
export const deleteChat=id=>run('readwrite',s=>s.delete(id));
