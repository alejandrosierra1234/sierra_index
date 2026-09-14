import * as Y from 'yjs';
import {generateKeyBetween} from 'fractional-indexing';

const forbidden = new Set(['__proto__', 'prototype', 'constructor']);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const object = value => value && typeof value === 'object' && !Array.isArray(value);
const keyed = value => Array.isArray(value) && value.every(item => object(item) && (item.id || item.uid));
const identity = item => String(item.id || item.uid);
const textual = key => /^(subject|summary|content|text|title|description|name|author|salutation|closing|intro|caption|heroCaption|contactNote)$/.test(key);

export function replaceText(type, before, after) {
  let start = 0;
  while (start < before.length && start < after.length && before[start] === after[start]) start++;
  let end = 0;
  while (end < before.length - start && end < after.length - start && before.at(-end - 1) === after.at(-end - 1)) end++;
  if (before.length - start - end) type.delete(start, before.length - start - end);
  if (after.length - start - end) type.insert(start, after.slice(start, after.length - end));
}

function encode(value, key) {
  if (typeof value === 'string' && textual(key)) return new Y.Text(value);
  if (keyed(value)) {
    const result = new Y.Map(), items = new Y.Map(), positions = new Y.Map();
    result.set('_kind', 'list'); result.set('_items', items); result.set('_positions', positions);
    let position = null;
    value.forEach(item => {
      const id = identity(item);
      items.set(id, encode(item)); position = generateKeyBetween(position, null); positions.set(id, position);
    });
    return result;
  }
  if (object(value)) {
    const result = new Y.Map();
    Object.entries(value).forEach(([k, v]) => { if (!forbidden.has(k)) result.set(k, encode(v, k)); });
    return result;
  }
  return structuredClone(value);
}

function decode(value) {
  if (value instanceof Y.Text) return value.toString();
  if (value instanceof Y.Map) {
    if (value.get('_kind') === 'list') {
      const items = value.get('_items'), positions = value.get('_positions');
      return [...items.keys()].sort((a, b) => {
        const x = positions.get(a), y = positions.get(b);
        return x === y ? (a < b ? -1 : 1) : (x < y ? -1 : 1);
      }).map(id => decode(items.get(id)));
    }
    const result = {};
    value.forEach((v, k) => { if (!forbidden.has(k)) result[k] = decode(v); });
    return result;
  }
  return structuredClone(value);
}

function patch(type, before, after) {
  for (const key of Object.keys(before)) if (!(key in after) && !forbidden.has(key)) type.delete(key);
  for (const [key, value] of Object.entries(after)) {
    if (forbidden.has(key) || same(before[key], value)) continue;
    const current = type.get(key), previous = before[key];
    if (current instanceof Y.Text && typeof previous === 'string' && typeof value === 'string') {
      replaceText(current, previous, value);
    } else if (current instanceof Y.Map && current.get('_kind') === 'list' && keyed(previous) && keyed(value)) {
      const items = current.get('_items'), positions = current.get('_positions');
      const old = new Map(previous.map(item => [identity(item), item]));
      const next = new Set(value.map(identity));
      for (const id of old.keys()) if (!next.has(id)) { items.delete(id); positions.delete(id); }
      value.forEach(item => {
        const id = identity(item);
        if (!old.has(id)) items.set(id, encode(item));
        else if (items.has(id)) patch(items.get(id), old.get(id), item);
        // A concurrently deleted item is not resurrected by an edit.
      });
      if (!same(previous.map(identity), value.map(identity))) {
        let left = null;
        value.forEach((item, i) => {
          const id = identity(item);
          if (!items.has(id)) return;
          let position = positions.get(id);
          const right = value.slice(i + 1).map(identity).map(k => positions.get(k)).find(p => p && (!left || p > left));
          if (!position || (left && position <= left) || (right && position >= right)) {
            position = generateKeyBetween(left, right || null); positions.set(id, position);
          }
          left = position;
        });
      }
    } else if (current instanceof Y.Map && object(previous) && object(value)) patch(current, previous, value);
    else type.set(key, encode(value, key));
  }
}

export class CommunicationModel {
  constructor(doc = new Y.Doc()) { this.doc = doc; this.root = doc.getMap('communication'); }
  seed(value) { this.doc.transact(() => patch(this.root, {}, value), 'local'); }
  read() { return decode(this.root); }
  apply(before, after) { this.doc.transact(() => patch(this.root, before, after), 'local'); }
}

export const toBase64 = bytes => {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
  return btoa(binary);
};
export const fromBase64 = value => Uint8Array.from(atob(value.replace(/\s/g, '')), c => c.charCodeAt(0));
export {Y};
