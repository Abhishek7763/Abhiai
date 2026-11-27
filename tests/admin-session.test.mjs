import test from 'node:test';import assert from 'node:assert/strict';import {issueSession,validSession,sameOrigin} from '../lib/admin-session.mjs';
const env={AI_ADMIN_TOKEN:'a'.repeat(40)};
test('signed session expires and rejects tampering',()=>{const now=Date.now(),s=issueSession(env,now);assert.equal(validSession(s,env,now),true);assert.equal(validSession(s,env,now+900000),false);assert.equal(validSession(s+'x',env,now),false);assert.equal(validSession(s,{AI_ADMIN_TOKEN:'b'.repeat(40)},now),false)});
test('origin validation rejects cross-origin mutations',()=>{assert.equal(sameOrigin(new Request('https://example.com/api',{headers:{origin:'https://evil.example'}})),false);assert.equal(sameOrigin(new Request('https://example.com/api',{headers:{origin:'https://example.com'}})),true)});
