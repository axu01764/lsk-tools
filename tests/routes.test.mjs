import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolveRoute} from '../src/routes.js';
const products = JSON.parse(readFileSync(new URL('../src/products.json',import.meta.url)));
const site = JSON.parse(readFileSync(new URL('../src/site-config.json',import.meta.url)));

test('every configured hero target opens its exact product', () => {
  for (const slide of site.hero) {
    const route = resolveRoute(`/product/${slide.productId}`, products, site.news);
    assert.equal(route.kind,'product');
    assert.equal(route.product.id,slide.productId);
  }
});
test('unknown paths cannot be mistaken for products, categories or news', () => {
  for(const path of ['/product/missing/','/news/missing/','/not-a-page/',`/product/${products[0].id}-wrong/`,`/foo/${products[0].id}/`,'/%E0%A4%A']) {
    assert.equal(resolveRoute(path,products,site.news).kind,'not-found',path);
  }
});
test('source production URL and earlier internal aliases remain reachable', () => {
  for(const path of ['/capacity/intelligent-production/smart-factory.html','/about/factory','/factory/','/about/faq/','/faq/','/privacy-policy/','/oem-odm/','/capacity/oem-odm/']) {
    assert.equal(resolveRoute(path,products,site.news).kind,'page',path);
  }
});
test('configured articles resolve exactly while unknown slugs remain missing', () => {
  const news = [{id:'fixture-update',title:'Fixture only'}];
  assert.equal(resolveRoute('/news/fixture-update/',products,news).article,news[0]);
  assert.equal(resolveRoute('/news/fixture-update-extra/',products,news).kind,'not-found');
});

test('capacity child pages resolve exactly without accepting arbitrary HTML slugs', () => {
  for (const path of [
    '/capacity/intelligent-production/robot-assistive-technology.html',
    '/capacity/intelligent-production/fully-automated-threedimensional-warehouse.html',
    '/capacity/strict-quality-control/production-process-quality-control.html',
    '/capacity/strict-quality-control/international-certification.html'
  ]) assert.equal(resolveRoute(path,products,site.news).kind,'page',path);
  assert.equal(resolveRoute('/capacity/strict-quality-control/missing.html',products,site.news).kind,'not-found');
});

test('news categories and canonical article paths preserve exact routing', () => {
  const news=[{id:'fixture',category:'company-news'}];
  for(const path of ['/news/company-news/','/news/industry-news/']) assert.equal(resolveRoute(path,products,news).kind,'page');
  assert.equal(resolveRoute('/news/company-news/fixture.html',products,news).article,news[0]);
  assert.equal(resolveRoute('/news/fixture/',products,news).article,news[0]);
  assert.equal(resolveRoute('/news/industry-news/fixture.html',products,news).kind,'not-found');
});
