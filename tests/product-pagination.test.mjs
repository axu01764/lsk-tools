import test from 'node:test';
import assert from 'node:assert/strict';
import {readProductPage,productArchiveHref,paginateProducts} from '../src/product-pagination.js';
import {resolveRoute} from '../src/routes.js';
test('twelve-item pages include every item exactly once and clamp out of range',()=>{
  const items=Array.from({length:25},(_,i)=>i);
  assert.deepEqual([1,2,3].flatMap(page=>paginateProducts(items,page).items),items);
  assert.deepEqual(paginateProducts(items,999),{pages:3,current:3,items:[24]});
  assert.deepEqual(paginateProducts([],2),{pages:1,current:1,items:[]});
});
test('pagination URLs retain search terms and match only supported archive routes',()=>{
  const href=productArchiveHref('/product/cordless-drills/',2,'21V & drill');
  assert.equal(href,'/product/cordless-drills/page/2/?q=21V+%26+drill');
  assert.equal(readProductPage('/product/cordless-drills/page/2/'),2);
  assert.equal(productArchiveHref('/product/',1,''),'/product/');
  assert.equal(resolveRoute('/product/cordless-drills/page/2/',[],[]).path,'/product/cordless-drills/');
  for(const path of ['/product/unknown/page/2/','/product/cordless-drills/page/0/','/product/cordless-drills/page/2.5/'])assert.equal(resolveRoute(path,[],[]).kind,'not-found');
  assert.equal(readProductPage('/fixture.html','?page=-2'),1);
});
