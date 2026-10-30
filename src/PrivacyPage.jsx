import React,{useState} from 'react';
import content from './privacy-content.json';
import products from './products.json';
import PageTitle from './PageTitle.jsx';
import {productCategories,productCategoryPath} from './product-categories.js';
export default function PrivacyPage({policy=content}){
  const [query,setQuery]=useState('');
  return <main className="interior"><PageTitle>{policy.title}</PageTitle><div className="news-detail-layout policy-layout">
    <article className="policy-article"><h2>{policy.title}</h2>{policy.updatedAt&&<p>Last updated: <time dateTime={policy.updatedAt}>{policy.updatedAt}</time></p>}{policy.introduction&&<p>{policy.introduction}</p>}
      {policy.sections.length ? policy.sections.map((section,index)=><section key={index}><h3>{section.heading}</h3>{section.paragraphs?.map((paragraph,i)=><p key={i}>{paragraph}</p>)}{section.items?.length>0&&<ul>{section.items.map((item,i)=><li key={i}>{item}</li>)}</ul>}</section>) : <p>Privacy information has not been published yet.</p>}
    </article><aside className="news-sidebar"><div className="news-contact"><h2>Contact Us</h2><p>Contact LSK Tools with your questions.</p><a href="/contact/">Contact us →</a></div><label>Search categories<input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Product category"/></label><h2>Product Category</h2><ul>{productCategories(products).filter(category=>category.toLowerCase().includes(query.toLowerCase())).map(category=><li key={category}><a href={productCategoryPath(category)}>{category}<span>{products.filter(item=>item.category===category).length}</span></a></li>)}</ul><h2>Related Products</h2><div className="product-side-related">{products.map(item=><a key={item.id} href={'/product/'+item.id+'/'}><img src={item.image} alt="" loading="lazy"/><span>{item.name}</span></a>)}</div></aside>
  </div></main>;
}
