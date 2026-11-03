import React from 'react';
import site from './site-config.json';
import HeroShare from './HeroShare.jsx';

export default function FooterConnect() {
  return <div className="footer-connect"><h3>WHATSAPP<small>Scan to chat with us</small></h3><a className="footer-qr" href={site.social.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Chat with LSK Tools on WhatsApp"><img src={site.social.whatsappQr} alt="LSK Tools WhatsApp QR code" width="180" height="180"/></a><HeroShare className="footer-share"/></div>;
}
