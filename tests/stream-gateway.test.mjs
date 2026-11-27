import test from 'node:test';import assert from 'node:assert/strict';import {sse,streamChat} from '../lib/stream-gateway.mjs';
const env={OPENROUTER_API_KEY:'test',OPENROUTER_MODEL:'test:free'};
test('SSE split chunks',async()=>{const body=new ReadableStream({start(c){const e=new TextEncoder();c.enqueue(e.encode('data: {"x":'));c.enqueue(e.encode('1}\n\ndata: [DONE]\n'));c.close()}});const out=[];for await(const x of sse(body))out.push(x);assert.deepEqual(out,[{x:1}])});
test('stream text without reasoning fields',async()=>{const out=[];for await(const x of streamChat([{role:'user',content:'hi'}],{env,request:async()=>new Response('data: {"choices":[{"delta":{"content":"hello","reasoning":"hidden"}}]}\n\ndata: [DONE]\n')}))out.push(x);assert.deepEqual(out,['hello'])});
