import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectPublicUrl,resolvePublicUrl} from '../src/public-url.js';
import {websiteQrDataUrl} from '../src/website-qr.js';

test('blank and malformed deployment settings retain working preview links',()=>{
  const fallback='http://localhost:4173/product/';
  for(const value of ['',null,undefined,' ','lsktools.com','/website',{},'javascript:alert(1)','https://user:password@example.com/']) {
    assert.equal(resolvePublicUrl(value,fallback),fallback);
  }
  assert.equal(inspectPublicUrl('').error,null);
  assert.ok(inspectPublicUrl('lsktools.com').error);
});

test('configured international and subdirectory URLs are normalized without losing destinations',()=>{
  assert.equal(resolvePublicUrl(' https://example.com/catalogue/?lang=en ',''),'https://example.com/catalogue/?lang=en');
  const result=inspectPublicUrl('https://例子.测试/产品');
  assert.equal(result.error,null);
  assert.equal(result.url,'https://xn--fsqu00a.xn--0zwm56d/%E4%BA%A7%E5%93%81');
  assert.match(websiteQrDataUrl(result.url),/^data:image\/gif;base64,/);
});

test('a URL exceeding QR capacity returns a link-only fallback rather than throwing',()=>{
  assert.equal(websiteQrDataUrl('https://example.com/?q='+'x'.repeat(10000)),null);
});
