import {test} from 'node:test';
import assert from 'node:assert/strict';
import {IDBFactory} from 'fake-indexeddb';
import {createOutbox} from '../outbox.js';

test('durable outbox isolates accounts and preserves concurrent tab changes',async()=>{
  const db=new IDBFactory(),first=createOutbox('account-a:doc',db),second=createOutbox('account-a:doc',db),other=createOutbox('account-b:doc',db);
  await first.save('old');const recovered=await second.load();
  assert.equal(recovered.length,1);assert.deepEqual(await other.load(),[]);
  await first.save('new');await second.remove(recovered);
  assert.equal((await second.load())[0].update,'new','acknowledging old version preserves newer edits');
  await second.save('second-tab');assert.equal((await first.load()).length,2);
  await second.save(null);assert.equal((await first.load()).length,1,'one tab cannot erase another pending entry');
  const reopened=createOutbox('account-a:doc',db);assert.equal((await reopened.load())[0].update,'new');
  await reopened.remove(await reopened.load());assert.deepEqual(await first.load(),[]);
});
