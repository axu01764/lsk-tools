import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {matchesProduct} from '../src/product-search.js';
const products=JSON.parse(readFileSync(new URL('../src/products.json',import.meta.url)));
test('torque searches accept catalogue punctuation and compact units',()=>{
  for(const query of ['550','550 Nm','550N·m','21V wrench']) {
    assert.deepEqual(products.filter(item=>matchesProduct(item,query)).map(item=>item.id),['brushless-wrench-21v-550nm']);
  }
});
test('search requires all words and ignores provenance paths',()=>{
  assert.equal(products.filter(item=>matchesProduct(item,'12V wrench')).length,0);
  assert.equal(products.filter(item=>matchesProduct(item,'reference')).length,0);
  assert.equal(products.filter(item=>matchesProduct(item,'')).length,3);
});
