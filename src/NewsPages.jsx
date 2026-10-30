import React, {useState} from 'react';
import site from './site-config.json';
import products from './products.json';
import {productCategoryPath} from './product-categories.js';
import {newsPath,newsCategories} from './news-model.js';

function Metadata({entry}) {
  return <div className="news-meta">{entry.author && <span>{entry.author}</span>}<time dateTime={entry.date}>{entry.date}</time></div>;
}

export function NewsArchive({items=site.news,category=''}) {
  const [query,setQuery]=useState('');
  const [page,setPage]=useState(1);
  const entries=items.filter(entry => (!category || entry.category===category) && `${entry.title} ${entry.summary}`.toLowerCase().includes(query.trim().toLowerCase()));
  const pages=Math.max(1,Math.ceil(entries.length/12));
  const current=Math.min(page,pages);
  return <section className="news-archive">
    <div className="news-tools"><nav aria-label="News categories"><a href="/news/" aria-current={!category?'page':undefined}>All news</a>{newsCategories.map(item=><a key={item.id} href={'/news/'+item.id+'/'} aria-current={category===item.id?'page':undefined}>{item.label}</a>)}</nav><label>Search news<input type="search" value={query} onChange={event=>{setQuery(event.target.value);setPage(1);}} placeholder="Search articles"/></label></div>
    <p className="news-result" role="status">{entries.length} {entries.length===1?'article':'articles'}</p>
    {entries.length ? <div className="news-cards">{entries.slice((current-1)*12,current*12).map(entry=><article key={entry.id}>
      {entry.image && <a className="news-cover" href={newsPath(entry)}><img src={entry.image} alt={entry.imageAlt||''} loading="lazy"/></a>}
      <div className="news-card-copy"><Metadata entry={entry}/><h2><a href={newsPath(entry)}>{entry.title}</a></h2><p>{entry.summary}</p><a className="news-read" href={newsPath(entry)}>Read More <span aria-hidden="true">＋</span></a></div>
    </article>)}</div> : <div className="news-no-results"><h2>{query?'No matching articles':'Stay connected with LSK Tools'}</h2><p>{query?'Try another search term.':'Company updates will appear here when they are published.'}</p>{query && <button onClick={()=>setQuery('')}>Clear search</button>}</div>}
    {pages>1 && <nav className="news-pagination" aria-label="News pages"><button disabled={current===1} onClick={()=>setPage(current-1)}>Previous</button>{Array.from({length:pages},(_,index)=><button key={index} aria-current={current===index+1?'page':undefined} onClick={()=>setPage(index+1)}>{index+1}</button>)}<button disabled={current===pages} onClick={()=>setPage(current+1)}>Next</button></nav>}
  </section>;
}

function BodyBlock({block}) {
  if(typeof block==='string') return <p>{block}</p>;
  if(block.type==='heading') return block.level===3?<h3>{block.text}</h3>:<h2>{block.text}</h2>;
  if(block.type==='list') return <ul>{block.items.map((item,index)=><li key={index}>{item}</li>)}</ul>;
  if(block.type==='image') return <figure><img src={block.src} alt={block.alt||''} loading="lazy"/>{block.caption && <figcaption>{block.caption}</figcaption>}</figure>;
  if(block.type==='table') return <div className="news-table" tabIndex={0} role="region" aria-label={block.caption||'Article table'}><table><caption>{block.caption}</caption><thead><tr>{block.headers.map((text,index)=><th scope="col" key={index}>{text}</th>)}</tr></thead><tbody>{block.rows.map((row,index)=><tr key={index}>{row.map((text,column)=><td key={column}>{text}</td>)}</tr>)}</tbody></table></div>;
  return <p>{block.text}</p>;
}

export function NewsArticle({article,items=site.news}) {
  const [query,setQuery]=useState('');
  const index=items.findIndex(item=>item.id===article.id);
  const previous=items[index-1];
  const next=items[index+1];
  const categories=[...new Set(products.map(product=>product.category))];
  const body=Array.isArray(article.body)?article.body:[article.body||article.summary];
  return <div className="news-detail-layout"><article className="news-detail">
    <Metadata entry={article}/><h2 className="news-detail-title">{article.title}</h2>
    {article.image && <img className="news-detail-cover" src={article.image} alt={article.imageAlt||''}/>}
    <div className="news-body">{body.map((block,index)=><BodyBlock key={index} block={block}/>)}</div>
    <nav className="news-adjacent" aria-label="Adjacent articles"><div>{previous?<a href={newsPath(previous)}>PREV: {previous.title}</a>:<span>PREV: No previous article</span>}</div><div>{next?<a href={newsPath(next)}>NEXT: {next.title}</a>:<span>NEXT: No next article</span>}</div><a href="/news/">All news →</a></nav>
  </article><aside className="news-sidebar"><div className="news-contact"><h2>Contact Us</h2><p>Discuss your power tool requirements with LSK Tools.</p><a href="/contact/">Prepare an enquiry →</a></div><label>Search products<input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Product category"/></label><h2>Product Category</h2><ul>{categories.filter(category=>category.toLowerCase().includes(query.toLowerCase())).map(category=><li key={category}><a href={productCategoryPath(category)}>{category} <span>{products.filter(product=>product.category===category).length}</span></a></li>)}</ul></aside></div>;
}
