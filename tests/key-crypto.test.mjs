import test from 'node:test';import assert from 'node:assert/strict';import {encryptSecret,decryptSecret} from '../lib/key-crypto.mjs';
const env={AI_KEY_ENCRYPTION_KEY:'ab'.repeat(32)};
test('round trip and random nonce',()=>{const a=encryptSecret('secret','gemini',env),b=encryptSecret('secret','gemini',env);assert.notEqual(a,b);assert.equal(decryptSecret(a,'gemini',env),'secret')});
test('reject wrong provider and key',()=>{const a=encryptSecret('secret','gemini',env);assert.throws(()=>decryptSecret(a,'groq',env));assert.throws(()=>decryptSecret(a,'gemini',{AI_KEY_ENCRYPTION_KEY:'cd'.repeat(32)}))});
test('reject tampering and missing key',()=>{const a=encryptSecret('secret','gemini',env);assert.throws(()=>decryptSecret(a.slice(0,-2)+(a.endsWith('00')?'ff':'00'),'gemini',env));assert.throws(()=>encryptSecret('secret','gemini',{}))});
