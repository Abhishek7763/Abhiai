import test from 'node:test';import assert from 'node:assert/strict';import {reserveGuest} from '../lib/guest-quota.mjs';
test('disabled guest does not contact database',async()=>assert.equal(await reserveGuest({},()=>assert.fail()),false));
test('quota fails closed on database error',async()=>{await assert.rejects(reserveGuest({AI_PUBLIC_GUEST:'true',NEXT_PUBLIC_SUPABASE_URL:'https://bpvochmjcxhsmftncdvv.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'mock'},async()=>new Response('',{status:503})))});
