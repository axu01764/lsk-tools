import React,{useEffect,useState} from 'react';
import catalogue from './products.json';
import {readProductPage,productArchiveHref,paginateProducts} from './product-pagination.js';
import {matchesProduct} from './product-search.js';
import SlidingRail from './SlidingRail.jsx';
import ProductCategoryMenu from './ProductCategoryMenu.jsx';
import {productCategorySlug} from './product-categories.js';
const thumbnailBreakpoints=[{breakpoint:1000,slidesToShow:3},{breakpoint:500,slidesToShow:2}];
export function ClassificationThumbnails({items,name}){
  return <SlidingRail items={items} label={name+' products'} className="classification-thumbnails" slidesToShow={4} responsive={thumbnailBreakpoints} render={item=><a href={'/product/'+item.id+'/'} aria-label={item.name}><img src={item.image} alt="" loading="lazy"/></a>}/>;
}
const slug=productCategorySlug;
const descriptions={
  'Cordless Drills':'Compare our 12V and 21V cordless drills, including torque, chuck capacity and speed ranges. Select a product to review its specifications and prepare an enquiry.',
  'Impact Wrenches':'Explore the 21V brushless impact wrench and review its torque, speed and impact rate. Confirm the battery, charger and packaging required for your order.'
};
export default function ProductArchive({category='',products=catalogue}){
  const base=location.pathname.replace(/page\/[1-9]\d*\/$/,'');
  const [query,setQuery]=useState(()=>new URLSearchParams(location.search).get('q')||'');
  const [page,setPage]=useState(()=>readProductPage(location.pathname,location.search));
  const categories=[...new Set(products.map(item=>item.category))];
  const results=products.filter(item=>(!category||item.category===category)&&matchesProduct(item,query));
  const pagination=paginateProducts(results,page);
  const updateQuery=value=>{setQuery(value);setPage(1);};
  useEffect(()=>{history.replaceState(history.state,'',productArchiveHref(base,pagination.current,query));},[base,pagination.current,query]);
  useEffect(()=>{const restore=()=>{setQuery(new URLSearchParams(location.search).get('q')||'');setPage(readProductPage(location.pathname,location.search));};window.addEventListener('popstate',restore);return()=>window.removeEventListener('popstate',restore);},[]);
  const grouped=!category&&!query.trim();
  return <div className="product-page-layout product-archive"><div className="product-mobile-tools"><ProductCategoryMenu products={products} category={category}/><label>Search products<input type="search" placeholder="Product name, voltage or torque" value={query} onChange={event=>updateQuery(event.target.value)}/></label></div><aside className="product-page-sidebar">
    <label>Search products<input type="search" placeholder="Product name, voltage or torque" value={query} onChange={event=>updateQuery(event.target.value)}/></label>
    <h2>Product Category</h2><ul><li><a href="/product/" aria-current={!category?'page':undefined}>All products<span>{products.length}</span></a></li>{categories.map(name=><li key={name}><a href={'/product/'+slug(name)+'/'} aria-current={category===name?'page':undefined}>{name}<span>{products.filter(item=>item.category===name).length}</span></a></li>)}</ul>
    <h2>Featured Products</h2><div className="product-side-related">{products.slice(0,2).map(item=><a key={item.id} href={'/product/'+item.id+'/'}><img src={item.image} alt="" loading="lazy"/><span>{item.name}</span></a>)}</div>
    <div className="product-side-contact"><h3>Contact Us</h3><p>Discuss your model, quantity and destination with LSK Tools.</p><a href="/contact/">Prepare an enquiry →</a></div>
  </aside><div className="product-page-content"><em>Product Classification</em><h2 className="archive-heading">{category||'Our product range'}</h2>
    {grouped ? <div className="product-classifications">{categories.map(name=>{
      const items=products.filter(item=>item.category===name),href='/product/'+slug(name)+'/';
      return <section className="product-classification" key={name}><a className="classification-image" href={href} aria-label={'Browse '+name}><img src={items[0].image} alt={items[0].imageAlt} loading="lazy"/></a><div><span>Product Classification</span><h3><a href={href}>{name}<b aria-hidden="true">→</b></a></h3><h4>Product details</h4><p>{descriptions[name]||'Browse the range and compare product specifications.'}</p><ClassificationThumbnails items={items} name={name}/></div></section>;
    })}</div> : <><p role="status">{results.length} {results.length===1?'product':'products'}{query.trim()?' matching “'+query.trim()+'”':''}</p><div className="catalog-grid">{pagination.items.map(item=><a key={item.id} href={'/product/'+item.id+'/'}><img src={item.image} alt={item.imageAlt||item.name} loading="lazy"/><h3>{item.name}</h3><p>{item.voltage} · {item.torque}</p><span>View product →</span></a>)}</div>{pagination.pages>1&&<nav className="product-pagination" aria-label="Product pages">{pagination.current>1&&<a aria-label="Previous page" href={productArchiveHref(base,pagination.current-1,query)}>‹</a>}{Array.from({length:pagination.pages},(_,i)=>i+1).map(number=><a key={number} aria-label={'Page '+number} aria-current={pagination.current===number?'page':undefined} href={productArchiveHref(base,number,query)}>{number}</a>)}{pagination.current<pagination.pages&&<a aria-label="Next page" href={productArchiveHref(base,pagination.current+1,query)}>›</a>}</nav>}{!results.length&&<div className="archive-empty"><h3>No matching products</h3><p>Try a product name, voltage or torque.</p>{query&&<button onClick={()=>updateQuery('')}>Clear search</button>}</div>}</>}
  </div></div>;
}
