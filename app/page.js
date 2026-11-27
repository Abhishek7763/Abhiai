'use client';
import {useState} from 'react';
export default function Home(){
 const [draft,setDraft]=useState('');
 const [notice,setNotice]=useState(false);
 return <main><header><strong>AbhiAI</strong><span>Guest workspace · Preview</span></header><section className="hero"><div className="orbit" aria-hidden="true"><div>∞</div></div><h1>How can I help you?</h1><p>Think, create and explore with AbhiAI.</p><div className="suggestions">{['Explain a concept','Write something','Brainstorm ideas'].map(s=><button key={s} onClick={()=>{setDraft(s+' ');setNotice(false)}}>{s}</button>)}</div></section><form onSubmit={e=>{e.preventDefault();if(draft.trim())setNotice(true)}}><label htmlFor="prompt" className="sr">Your message</label><textarea id="prompt" placeholder="Ask anything…" value={draft} maxLength={12000} onChange={e=>{setDraft(e.target.value);setNotice(false)}}/><div className="actions"><small>AI gateway not connected</small><button type="submit" disabled={!draft.trim()} aria-label="Send message">↑</button></div>{notice&&<p role="status">AI service is not configured yet. Your draft is unchanged.</p>}</form><footer>Development preview · No messages are transmitted.</footer></main>
}
