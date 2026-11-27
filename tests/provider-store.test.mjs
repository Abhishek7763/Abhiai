import test from 'node:test';import assert from 'node:assert/strict';import {runtimeEnv,saveProvider,removeProvider} from '../lib/provider-store.mjs';
test('disabled database mode preserves existing environment',async()=>{const env={OPENROUTER_API_KEY:'example'};assert.equal(await runtimeEnv(env),env)});
test('invalid inputs fail before database access',async()=>{await assert.rejects(saveProvider({provider:'unknown'},{}),/Invalid settings/);await assert.rejects(removeProvider('unknown',{}),/Invalid provider/)});
test('database mode fails closed without valid configuration',async()=>{await assert.rejects(runtimeEnv({AI_DATABASE_PROVIDERS:'true'}));await assert.rejects(runtimeEnv({AI_DATABASE_PROVIDERS:'true',NEXT_PUBLIC_SUPABASE_URL:'https://example.com'}),/Invalid database endpoint/)});
