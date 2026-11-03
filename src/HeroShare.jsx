import React from 'react';
import site from './site-config.json';

export default function HeroShare({className='hero-share'}) {
  return <aside className={className} aria-label="Contact us on social media">
    <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Visit our Facebook page (opens a new tab)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 22v-9h3l.5-4H14V6.5c0-1 .3-1.5 1.7-1.5H18V1.4A28 28 0 0 0 14.7 1C11.4 1 9 3 9 6.5V9H6v4h3v9z"/></svg></a>
    <a href={site.social.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp (opens a new tab)"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><path d="M5.2 19.1 2 22l1.1-5.3A10 10 0 1 1 5.2 19.1Z" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M8 6c-.8 0-1.5 1.1-1.5 2.2 0 2.8 4.6 7.3 7.4 7.3 1.1 0 2.2-.7 2.2-1.5l-2.5-1.5-1.1 1c-1.5-.7-2.8-2-3.5-3.5l1-1.2L8.5 6Z"/></svg></a>
  </aside>;
}
