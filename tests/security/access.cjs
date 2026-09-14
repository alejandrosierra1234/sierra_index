const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf8');
let now = 100000;
class Clock extends Date { static now() { return now; } }
let response = {data: {version: 2, active: true, grants: []}};
const ctx = vm.createContext({
  Date: Clock, me: {id: 'alice'}, profile: {role: 'admin', account_status: 'active'}, myGrants: [],
  sb: {rpc: async () => response}, window: {addEventListener() {}},
  document: {addEventListener() {}}, setInterval() {}
});
vm.runInContext(source.slice(source.indexOf('let accessVerifiedAt='), source.indexOf('// Division-aware helpers:')), ctx);
const can = (...args) => ctx.can(...args);
(async () => {
  assert.equal(can('read', 'fabric'), false, 'unverified fails closed');
  await ctx.loadGrants();
  assert.equal(can('admin', 'platform'), false, 'legacy admin is not authority');
  ctx.profile.role = 'editor';
  assert.equal(can('write', 'fabric'), false, 'legacy editor is not authority');
  response.data.grants = [{domain: 'fabric', capability: 'read', resource_id: 'one'}];
  await ctx.loadGrants();
  assert.equal(can('read', 'fabric'), false);
  assert.equal(can('read', 'fabric', 'one'), true);
  assert.equal(can('read', 'fabric', 'two'), false);
  assert.equal(can('read', 'yarn', 'one'), false);
  assert.equal(can('write', 'fabric', 'one'), false);
  response.data.grants[0].expires_at = new Date(now + 1000).toISOString();
  assert.equal(can('read', 'fabric', 'one'), true);
  now += 1000;
  assert.equal(can('read', 'fabric', 'one'), false, 'expiry checked on each call');
  response.data.grants = [{domain: 'platform', capability: 'admin'}];
  await ctx.loadGrants();
  assert.equal(can('write', 'talento_humano'), true);
  ctx.profile.account_status = 'suspended';
  assert.equal(can('write', 'talento_humano'), false);
  ctx.profile.account_status = 'active';
  now += 60001;
  assert.equal(can('write', 'fabric'), false, 'stale snapshot fails closed');
  response = {error: new Error('network')};
  assert.equal(await ctx.loadGrants(), false);
  assert.equal(can('admin', 'platform'), false);
  response = {data: {version: 1, active: true, grants: []}};
  assert.equal(await ctx.loadGrants(), false, 'old server cannot enable UI');
  response = {data: {version: 2, active: false, grants: []}};
  assert.equal(await ctx.loadGrants(), false);
  ctx.me = null;
  assert.equal(await ctx.loadGrants(), false);
  assert.equal(can('read', 'fabric'), false);
  const storage = source.match(/function commsStorageKey\(base\)\{[^\n]+/)[0];
  vm.runInContext(storage, ctx);
  assert.throws(() => ctx.commsStorageKey('drafts'));
  ctx.me = {id: 'alice'};
  assert.equal(ctx.commsStorageKey('drafts'), 'drafts:alice');
  ctx.me = {id: 'bob'};
  assert.equal(ctx.commsStorageKey('drafts'), 'drafts:bob');
  console.log('PASS: deny by default, no role fallback, scope, expiry, suspension, stale/network failure and account-specific storage');
})().catch(error => {console.error(error);process.exitCode = 1;});
