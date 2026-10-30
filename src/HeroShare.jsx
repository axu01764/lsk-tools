import React from 'react';
import site from './site-config.json';
import {resolvePublicUrl} from './public-url.js';

export default function HeroShare({className='hero-share'}) {
  const url=encodeURIComponent(resolvePublicUrl(site.publicUrl,window.location.href));
  const title=encodeURIComponent(document.title);
  return <aside className={className} aria-label="Share this page">
    <a href={`https://www.facebook.com/sharer/sharer.php?u=${url}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook (opens a new tab)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 22v-9h3l.5-4H14V6.5c0-1 .3-1.5 1.7-1.5H18V1.4A28 28 0 0 0 14.7 1C11.4 1 9 3 9 6.5V9H6v4h3v9z"/></svg></a>
    <a href={`https://twitter.com/intent/tweet?url=${url}&text=${title}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter (opens a new tab)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 5.9a8.2 8.2 0 0 1-2.4.7 4.2 4.2 0 0 0 1.8-2.3 8.4 8.4 0 0 1-2.7 1 4.2 4.2 0 0 0-7.2 3.8A11.9 11.9 0 0 1 2.9 4.7a4.2 4.2 0 0 0 1.3 5.6 4.2 4.2 0 0 1-1.9-.5 4.2 4.2 0 0 0 3.4 4.2 4.2 4.2 0 0 1-1.9.1 4.2 4.2 0 0 0 3.9 2.9A8.4 8.4 0 0 1 2 18.7a11.9 11.9 0 0 0 18.3-10c0-.2 0-.4-.1-.5A8.5 8.5 0 0 0 22 5.9z"/></svg></a>
    <a href={`https://wa.me/?text=${url}`} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp (opens a new tab)"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><path d="M5.2 19.1 2 22l1.1-5.3A10 10 0 1 1 5.2 19.1Z" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M8 6c-.8 0-1.5 1.1-1.5 2.2 0 2.8 4.6 7.3 7.4 7.3 1.1 0 2.2-.7 2.2-1.5l-2.5-1.5-1.1 1c-1.5-.7-2.8-2-3.5-3.5l1-1.2L8.5 6Z"/></svg></a>
  </aside>;
}
