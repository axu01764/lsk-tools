import test from 'node:test';
import assert from 'node:assert/strict';
import {productCategories,productCategoryPath} from '../src/product-categories.js';
import {resolveRoute} from '../src/routes.js';
test('a configured new category resolves its archive, pagination and exact products',()=>{
  const products=[{id:'test-router',category:'Woodworking Tools'},{id:'test-router-2',category:'Woodworking Tools'}];
  assert.deepEqual(productCategories(products),['Woodworking Tools']);
  const path=productCategoryPath(products[0].category);
  assert.equal(path,'/product/woodworking-tools/');
  assert.equal(resolveRoute(path,products,[]).kind,'page');
  assert.equal(resolveRoute(path+'page/2/',products,[]).path,path);
  assert.equal(resolveRoute('/product/test-router/',products,[]).product,products[0]);
  assert.equal(resolveRoute('/product/woodworking-tool/page/2/',products,[]).kind,'not-found');
});
