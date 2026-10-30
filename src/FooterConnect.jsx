import React, {useMemo} from 'react';
import {websiteQrDataUrl} from './website-qr.js';
import {resolvePublicUrl} from './public-url.js';
import site from './site-config.json';
import HeroShare from './HeroShare.jsx';

export default function FooterConnect() {
  const url=resolvePublicUrl(site.publicUrl,`${window.location.origin}/`);
  const image=useMemo(()=>websiteQrDataUrl(url),[url]);
  return <div className="footer-connect"><h3>{image?'QR CODE':'WEBSITE'}<small>{image?'Scan our website':'Visit our website'}</small></h3><a className="footer-qr" href={url} aria-label="Open LSK Tools website">{image?<img src={image} alt="QR code for the LSK Tools website" width="180" height="180"/>:'Open website'}</a><HeroShare className="footer-share"/></div>;
}
