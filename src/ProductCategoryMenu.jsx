import React,{useEffect,useId,useRef,useState} from 'react';
import {productCategories,productCategoryPath} from './product-categories.js';

export default function ProductCategoryMenu({products,category}){
  const [open,setOpen]=useState(false),[closing,setClosing]=useState(false);
  const dialog=useRef(null),trigger=useRef(null),timer=useRef(null),id=useId();
  const close=()=>{
    if(timer.current)return;
    setClosing(true);
    timer.current=setTimeout(()=>{setOpen(false);setClosing(false);timer.current=null;},matchMedia('(prefers-reduced-motion: reduce)').matches?0:200);
  };
  useEffect(()=>()=>clearTimeout(timer.current),[]);
  useEffect(()=>{
    if(!open)return;
    const element=dialog.current,previous=document.body.style.overflow;
    element.showModal();document.body.style.overflow='hidden';
    const wide=matchMedia('(min-width:1001px)'),resize=()=>{if(wide.matches)close();};
    wide.addEventListener('change',resize);
    return()=>{wide.removeEventListener('change',resize);element.close();document.body.style.overflow=previous;trigger.current?.focus();};
  },[open]);
  return <><button ref={trigger} type="button" className="category-menu-trigger" aria-haspopup="dialog" aria-expanded={open} aria-controls={id} onClick={()=>setOpen(true)}>Categories <span aria-hidden="true">+</span></button>
    {open&&<dialog ref={dialog} id={id} aria-label="Product categories" className={'category-menu-dialog'+(closing?' is-closing':'')} onCancel={event=>{event.preventDefault();close();}} onClick={event=>{if(event.target!==event.currentTarget)return;const r=event.currentTarget.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();}}>
      <div className="category-menu-heading"><h2>Product categories</h2><button type="button" aria-label="Close categories" onClick={close}>×</button></div>
      <ul><li><a href="/product/" aria-current={!category?'page':undefined}>All products <span>{products.length}</span></a></li>{productCategories(products).map(name=><li key={name}><a href={productCategoryPath(name)} aria-current={category===name?'page':undefined}>{name}<span>{products.filter(item=>item.category===name).length}</span></a></li>)}</ul>
    </dialog>}</>;
}
