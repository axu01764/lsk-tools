import React from 'react';
import site from './site-config.json';

export default function PageTitle({children}) {
  return <div className="page-title" style={{backgroundImage:`linear-gradient(90deg,#000b,#0008),url("${site.innerBannerBackground || '/media/hero-workshop-v1.png'}")`}}><div className="page-title-content"><h1>{children}</h1><nav className="page-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">{children}</span></nav></div></div>;
}
