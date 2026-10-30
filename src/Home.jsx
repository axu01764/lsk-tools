import React, { useEffect, useRef, useState } from "react";
import products from "./products.json";
import site from "./site-config.json";
import factoryGallery from "./factory-gallery.json";
import { resolveRoute } from './routes.js';
import "./home.css";
import SlidingRail from "./SlidingRail.jsx";
import oemContent from './oem-content.json';
import cultureContent from './culture-content.json';
import {capacityGroups} from './capacity-content.js';
import {newsPath,newsCategories} from './news-model.js';
import {NewsArchive,NewsArticle} from './NewsPages.jsx';
import aboutContent from './about-content.json';
import ProductArchive from './ProductArchive.jsx';
import useBackgroundParallax from './useBackgroundParallax.js';
import PrivacyPage from './PrivacyPage.jsx';
import PageTitle from './PageTitle.jsx';
import HeroShare from './HeroShare.jsx';
import FooterConnect from './FooterConnect.jsx';
import {productCategories,productCategoryPath} from './product-categories.js';
import ZoomableImage from './ZoomableImage.jsx';
import {matchesProduct} from './product-search.js';
const media = products.map((p) => p.image.replace("/media/", ""));
const nav = [
  ["Home", "/"],
  ["About Us", "/about/"],
  ["Product", "/product/"],
  ["Capacity", "/capacity/"],
  ["News", "/news/"],
  ["Contact Us", "/contact/"],
];
const children = {
  News: newsCategories.map(category => [category.label,'/news/'+category.id+'/']),
  "About Us": [["Corporate Culture", "/corporate-culture/"], ["Factory", "/factory/"], ["Certificate", "/honor/"], ["FAQ", "/faq/"]],
  Product: productCategories(products).map(category=>[category,productCategoryPath(category)]),
  Capacity: [["Intelligent Production", "/capacity/intelligent-production/smart-factory.html"], ["Quality Control", "/capacity/strict-quality-control/"], ["OEM / ODM", "/oem-odm/"]],
};
const slug = (s) => s.toLowerCase().replaceAll(" / ", "-").replaceAll(" ", "-");
const Arrow = () => (
  <img className="arrow" src="/design/images/icon-more.png" alt="" />
);
const Logo = () => (
  <a className="brand" href="/" aria-label="LSK Tools home">
    <img src={site.brand.logo} alt={site.brand.name} />
  </a>
);
const More = ({ href, children = "READ MORE" }) => (
  <a className="more" href={href}>
    {children}
    <Arrow />
  </a>
);
function useAuto(length,paused=false) {
  const [i, set] = useState(0);
  const [reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [hidden,setHidden]=useState(()=>document.hidden);
  useEffect(()=>{
    const media=matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion=()=>setReduced(media.matches);
    const updateVisibility=()=>setHidden(document.hidden);
    media.addEventListener('change',updateMotion);
    document.addEventListener('visibilitychange',updateVisibility);
    return ()=>{media.removeEventListener('change',updateMotion);document.removeEventListener('visibilitychange',updateVisibility);};
  },[]);
  useEffect(() => {
    if (length < 2 || paused || reduced || hidden) return;
    const t = setInterval(
      () => set((n) => (n + 1) % length),
      site.motion.autoplayMs,
    );
    return () => clearInterval(t);
  }, [length,paused,reduced,hidden]);
  return [i, set];
}
function Modal({ title, close, children, onKeyDown, returnFocus, className='' }) {
  const r = useRef();
  useEffect(() => {
    const previous = returnFocus?.current || document.activeElement;
    r.current.showModal();
    r.current.querySelector('input')?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={r}
      className={className}
      aria-label={title}
      onCancel={event=>{event.preventDefault();close();}}
      onKeyDown={onKeyDown}
      onClick={(e) => {
        if (e.target === r.current) close();
      }}
    >
      <button className="close" onClick={close} aria-label="Close dialog">
        ×
      </button>
      {children}
    </dialog>
  );
}
function MobileNavigation({close,search,returnFocus}) {
  const [closing,setClosing]=useState(false);
  const closeTimer=useRef(null);
  useEffect(()=>{
    document.body.classList.add('navigation-open');
    return ()=>{document.body.classList.remove('navigation-open');clearTimeout(closeTimer.current);};
  },[]);
  const dismiss=()=>{
    if(closing)return;
    setClosing(true);
    document.body.classList.remove('navigation-open');
    closeTimer.current=setTimeout(close,matchMedia('(prefers-reduced-motion: reduce)').matches?0:500);
  };
  return <Modal title="Navigation" close={dismiss} returnFocus={returnFocus} className={'navigation-drawer'+(closing?' is-closing':'')}>
    <div className="mobile-nav"><Logo/><h2>Web Menu</h2><nav aria-label="Mobile navigation">{nav.map(([name,href])=><div key={name}><a href={href} aria-current={location.pathname===href?'page':undefined}>{name}</a>{children[name]?.map(([label,path])=><a className="sub" key={path} href={path} aria-current={location.pathname===path?'page':undefined}>{label}</a>)}</div>)}</nav><button className="mobile-search-button" onClick={search}>Search products</button><button className="mobile-menu-close" onClick={dismiss}>Close menu ×</button></div>
  </Modal>;
}
function Header() {
  const menuTrigger=useRef(null);
  const searchTrigger=useRef(null);
  const [sticky, S] = useState(false),
    [menu, M] = useState(false),
    [search, Q] = useState(false),
    [q, F] = useState("");
  useEffect(() => {
    const fn = () => S(scrollY > site.motion.stickyAfterPx);
    fn();
    addEventListener("scroll", fn, { passive: true });
    return () => removeEventListener("scroll", fn);
  }, []);
  return (
    <>
      <header className={[sticky ? "sticky" : "", location.pathname !== '/' ? 'interior-header' : ''].join(' ')}>
        <button
          className="menu-toggle"
          ref={menuTrigger}
          aria-haspopup="dialog"
          aria-expanded={menu}
          aria-label="Open navigation"
          onClick={() => M(true)}
        >
          <span />
          <span />
          <span />
        </button>
        <Logo />
        <nav>
          {nav.map(([n, h]) => (
            <div className="nav-item" key={n}>
              <a href={h}>{n}</a>
              {children[n] && (
                <div className="dropdown">
                  {children[n].map(([c,href]) => (
                    <a key={c} href={href}>
                      {c}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button
            className="search-toggle"
            aria-label="Search products"
            onClick={event => {searchTrigger.current=event.currentTarget;Q(true);}}
          >
            <img src="/design/images/icon-search-white.png" alt="" />
          </button>
        </nav>
      </header>
      {menu && (
        <MobileNavigation close={() => M(false)} returnFocus={menuTrigger} search={() => {
                searchTrigger.current=menuTrigger.current;
                M(false);
                Q(true);
              }}/>
      )}
      {search && (
        <Modal title="Search products" close={() => Q(false)} returnFocus={searchTrigger}>
          <section className="search-panel">
            <h2>Find your tool</h2>
            <label htmlFor="search">Search products</label>
            <input
              autoFocus
              id="search"
              value={q}
              onChange={(e) => F(e.target.value)}
              placeholder="Drill, wrench, 21V…"
            />
            <div aria-live="polite">
              {products
                .filter(p => matchesProduct(p,q))
                .map((p) => (
                  <a href={"/product/" + p.id + "/"} key={p.id}>
                    {p.name}
                    <Arrow />
                  </a>
                ))}
              {!products.some(p => matchesProduct(p,q)) && <p>No matches. Try “drill”, “21V” or “550 Nm”.</p>}
            </div>
          </section>
        </Modal>
      )}
    </>
  );
}
function Sparks() {
  return (
    <div className="sparks" aria-hidden="true">
      {Array.from({ length: 18 }, (_, i) => (
        <i
          key={i}
          style={{
            left: `${(i * 37) % 100}%`,
            animationDelay: `${i * 0.39}s`,
            animationDuration: `${4 + (i % 5)}s`,
          }}
        />
      ))}
    </div>
  );
}
function Hero() {
  const [paused,setPaused]=useState(false);
  const [focusWithin,setFocusWithin]=useState(false);
  const [i, S] = useAuto(site.hero.length,paused || focusWithin),
    touch = useRef(null);
  return (
    <section
      className="hero"
      style={{'--hero-backdrop':`url("${site.heroBackground || '/media/hero-workshop-v1.png'}")`}}
      role="region" aria-roledescription="carousel" aria-label="Featured products" tabIndex={0}
      onFocusCapture={()=>setFocusWithin(true)}
      onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget))setFocusWithin(false);}}
      onKeyDown={event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();S(index=>(index+(event.key==='ArrowRight'?1:site.hero.length-1))%site.hero.length);}}}
      onTouchStart={event=>{touch.current=event.touches.length===1?{x:event.touches[0].clientX,y:event.touches[0].clientY}:null;}}
      onTouchCancel={()=>{touch.current=null;}}
      onTouchEnd={(e) => {
        if(!touch.current || !e.changedTouches.length) return;
        const delta = e.changedTouches[0].clientX - touch.current.x;
        const vertical=e.changedTouches[0].clientY-touch.current.y;
        touch.current=null;
        if (Math.abs(delta) > 40 && Math.abs(delta)>Math.abs(vertical))
          S((n) => (n + (delta < 0 ? 1 : site.hero.length - 1)) % site.hero.length);
      }}
    >
      <div className="hero-photo" />
      <img className="paint" src="/media/paint.png" alt="" />
      {site.hero.map((slide, j) => (
        <div
          className={"hero-slide " + (i === j ? "active" : "")}
          key={slide.productId}
          aria-hidden={i !== j}
        >
          <div className="hero-copy">
            <h1>{slide.title}</h1>
            <p>{slide.description}</p>
          </div>
          <a
            tabIndex={i === j ? 0 : -1}
            className="hero-product"
            href={"/product/" + slide.productId + "/"}
          >
            <img src={products.find(p => p.id === slide.productId).image} alt={slide.title} />
          </a>
        </div>
      ))}
      <div className="hero-dots">
        {site.hero.map((slide, j) => (
          <button
            key={j}
            aria-label={"Show slide " + (j + 1)}
            aria-pressed={i === j}
            onClick={() => S(j)}
          />
        ))}
        <button className="hero-pause" aria-label={paused?'Resume featured products':'Pause featured products'} aria-pressed={paused} onClick={()=>setPaused(value=>!value)}>{paused?'▶':'Ⅱ'}</button>
      </div>
      <Sparks />
      <HeroShare />
    </section>
  );
}
function Carousel() {
  return <SlidingRail items={products} className="product-carousel" label="popular products" arrows render={p => <article className="paint-card">
    <div className="card-copy"><h3>{p.name}</h3><div className="bars"/><p>{p.voltage} power. {p.torque} maximum torque.<br/>{p.speed}.</p><a href={'/product/'+p.id+'/'}>More Details <Arrow/></a></div>
    <a className="card-product" href={'/product/'+p.id+'/'}><img src={p.image} alt={p.name}/></a>
  </article>}/>;
}
export function AboutPage({content=aboutContent}) {
  const [videoOpen,setVideoOpen]=useState(false);
  const trigger=useRef(null);
  return <main className="interior about-page-full"><PageTitle>About Us</PageTitle>
    <section className="company-intro company-container"><div className="company-picture"><span className="company-side-label" aria-hidden="true">ABOUT US</span><img src={content.image} alt={content.imageAlt}/><strong>{content.badge}</strong></div><div className="company-copy"><em>About Us</em><h2>{content.title}</h2>{content.intro.map((paragraph,index)=><p key={index}>{paragraph}</p>)}<div className="company-links"><More href="/corporate-culture/">Corporate culture</More><More href="/factory/">Factory</More></div></div></section>
    {site.companyStats.length>0 && <section className="company-statistics company-container" aria-label="Company facts">{site.companyStats.map(stat=><AnimatedFact key={stat.label} stat={stat}/>)}</section>}
    <section className="company-video"><div className="company-container"><div className="company-copy"><em>Inside LSK Tools</em><h2>{content.videoHeading}</h2><p>{content.videoText}</p><More href="/factory/">Explore the factory</More></div><button className="company-video-trigger" ref={trigger} onClick={()=>setVideoOpen(true)} aria-label="Play LSK Tools workshop video"><img src={site.video.poster} alt="LSK Tools factory video preview"/><span className="play"><span className="play-ripple" aria-hidden="true"/></span></button></div></section>
    <section className="company-services company-container"><em>Explore LSK Tools</em><h2>From selection to enquiry</h2><div className="company-service-grid">{content.services.map(item=><a key={item.title} href={item.href}><span className="company-service-icon" aria-hidden="true">{item.icon}</span><h3>{item.title}</h3><p>{item.text}</p><span className="company-service-more" aria-hidden="true">→</span></a>)}</div></section>
    <section className="company-development"><div className="company-container"><div className="company-collage">{content.developmentImages.map((item,index)=><img key={item.src} src={item.src} alt={item.alt} loading="lazy" className={'company-collage-'+index}/>)}</div><div className="company-copy"><em>Product development</em><h2>{content.developmentHeading}</h2><p>{content.developmentText}</p><More href="/oem-odm/">OEM / ODM</More></div></div></section>
    <section className="company-documents company-container"><em>Product information</em><h2>Documentation & certifications</h2>{site.certificates.length ? <CertificateGallery/> : <><p>Contact LSK Tools to request documentation for the specific models and destination market in your enquiry.</p><More href="/capacity/strict-quality-control/international-certification.html">Product documentation</More></>}</section>
    {site.partners.length>0 && <section className="company-container company-partners"><h2>Partners</h2><div className="partner-logos">{site.partners.map(partner=><img key={partner.name} src={partner.logo} alt={partner.name}/>)}</div></section>}
    {videoOpen && <Modal title="LSK Tools workshop video" close={()=>setVideoOpen(false)} returnFocus={trigger}><video controls autoPlay playsInline src={site.video.src}/></Modal>}
  </main>;
}
function About() {
  const parallaxRef=useBackgroundParallax(site.motion.aboutParallaxSpeed ?? 0.5);
  const [v, V] = useState(false);
  const videoTrigger = useRef(null);
  return (
    <section ref={parallaxRef} className="about" style={{'--factory-poster': `url("${site.video.poster}")`}}>
      <div className="about-backdrop" aria-hidden="true" />
      <div className="about-copy reveal">
        <em>ABOUT LSK TOOLS</em>
        <h2>
          <strong>Power for</strong>{" "}
          <br />
          your next{" "}
          <br />
          project
        </h2>
        <p>
          Explore cordless drills and impact wrenches from LSK Tools. Compare
          product specifications, browse the catalogue and see our factory
          video.
        </p>
        <div className="facts">
          {(site.companyStats.length ? site.companyStats : [
            {value:12,suffix:'V',label:'COMPACT DRILLS'},
            {value:21,suffix:'V',label:'CORDLESS RANGE'},
            {value:550,suffix:' N·m',label:'IMPACT WRENCH'},
          ]).map(stat => <AnimatedFact key={stat.label} stat={stat}/>)}
        </div>
      </div>
      <button
        className="factory"
        ref={videoTrigger}
        aria-label="Play LSK Tools factory video"
        onClick={() => V(true)}
      >
        <img src={site.video.poster} alt="LSK Tools factory video preview" />
        <span className="play"><span className="play-ripple" aria-hidden="true" /></span>
      </button>
      <More href="/about/" />
      <Sparks />
      {v && (
        <Modal title="LSK Tools factory video" close={() => V(false)} returnFocus={videoTrigger}>
          <video controls autoPlay playsInline src={site.video.src} />
        </Modal>
      )}
    </section>
  );
}
export function AnimatedFact({stat}) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  useEffect(() => {
    const target = Number(stat.value);
    if (!Number.isFinite(target)) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {setValue(target); return;}
    let timer;
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      let step = 0;
      timer = setInterval(() => {
        step += 1;
        setValue(target * Math.min(step / 50, 1));
        if (step >= 50) clearInterval(timer);
      }, 60);
    }, {threshold: site.motion.revealThreshold});
    observer.observe(ref.current);
    return () => {observer.disconnect();clearInterval(timer);};
  }, [stat.value]);
  return <div ref={ref}><b aria-label={String(stat.value) + (stat.suffix || '')}><span aria-hidden="true">{value.toLocaleString('en-US',{maximumFractionDigits:stat.decimals || 0})}{stat.suffix || ''}</span></b><span>{stat.label}</span></div>;
}
const features = [
  ["Customization", "Explore OEM options for your product range."],
  ["Product Range", "Compare cordless drills and impact wrenches."],
  [
    "Specifications",
    "Review voltage, torque and speed in the product catalogue.",
  ],
  ["Factory", "Take a closer look through our factory video."],
  [
    "Product Selection",
    "Choose a tool around the requirements of your project.",
  ],
  ["Enquiries", "Share the products and quantities you are interested in."],
];
function Feature({ i }) {
  return (
    <article className="feature reveal">
      <h3>
        <span className="feature-icon" aria-hidden="true"><img src={"/design/images/int-4-" + (i + 1) + ".png"} alt="" /></span>
        {features[i][0]}
      </h3>
      <p>{features[i][1]}</p>
    </article>
  );
}
function Form({expanded = false, productName = '', company = false, question=false, compact=false}) {
  const enquiryProduct=productName || new URLSearchParams(location.search).get('product') || '';
  const [status, S] = useState("");
  const [downloadUrl,setDownloadUrl] = useState(null);
  useEffect(() => () => {if(downloadUrl) URL.revokeObjectURL(downloadUrl);},[downloadUrl]);
  return (
    <form className={expanded ? 'enquiry-expanded' : compact ? 'enquiry-compact' : undefined} aria-label={question?'Question enquiry':undefined}
      onSubmit={(e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));
        const url = URL.createObjectURL(
          new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
          }),
        );
        const a = document.createElement("a");
        a.href = url;
        a.download = "lsk-tools-enquiry.json";
        a.click();
        setDownloadUrl(url);
        S("Your enquiry file is ready. Check your browser downloads. It has not been sent.");
      }}
    >
      <div className="form-row">
        <input required name="name" aria-label="Name" placeholder="Name*" />
        {question ? <input required type="email" name="email" aria-label="Email" placeholder="Email*"/> : <input name="phone" type="tel" aria-label="Phone" placeholder="Phone"/>}
      </div>
      {question ? <input required type="tel" name="phone" aria-label="Phone" placeholder="Phone*"/> : <input
        required
        type="email"
        name="email"
        aria-label="Email"
        placeholder="E-mail*"
      />}
      {expanded && <input name="subject" aria-label="Subject" placeholder="Subject" defaultValue={enquiryProduct ? 'Product enquiry: ' + enquiryProduct : ''}/>}
      {company && <input name="company" aria-label="Company" placeholder="Company"/>}
      <textarea
        required
        name="message"
        aria-label={question?'Message':'Enquiry'}
        placeholder={question?'Your question*':'Products and quantities*'}
        defaultValue={enquiryProduct ? 'I am interested in ' + enquiryProduct + '.\nQuantity: ' : ''}
      />
      <button type="submit" aria-label={compact ? 'Download enquiry file' : undefined} title={compact ? 'Download enquiry file' : undefined}>
        {!compact && 'DOWNLOAD ENQUIRY '}<Arrow />
      </button>
      <small>
        {compact ? 'Download enquiry file. Not sent online.' : 'This preview downloads your enquiry. Online sending is not connected.'}
      </small>
      <p role="status">{status}</p>
      {downloadUrl && <a className="enquiry-download" href={downloadUrl} download="lsk-tools-enquiry.json">Download enquiry file again</a>}
    </form>
  );
}
function Footer() {
  return (
    <footer>
      <div>
        <Logo />
        <Form compact />
      </div>
      <div>
        <h3>QUICK LINKS</h3>
        {nav.slice(1).map(([n, h]) => (
          <a key={n} href={h}>
            {n}
          </a>
        ))}
        <a href="/faq/">FAQ</a>
      </div>
      <div>
        <h3>PRODUCT</h3>
        {products.map((p) => (
          <a key={p.id} href={"/product/" + p.id + "/"}>
            {p.name}
          </a>
        ))}
      </div>
      <div>
        <h3>CONTACT LSK TOOLS</h3>
        <p>Tell us about your next project.</p>
        <a href="/contact/">
          Prepare an enquiry
        </a>
      </div>
      <FooterConnect />
      <p className="copyright">
        Copyright © {new Date().getFullYear()} LSK Tools. All Rights Reserved.
        {' '}<a href="/privacy-policy/">Privacy Policy</a>
      </p>
    </footer>
  );
}
export function News({ home = false, items = site.news }) {
  const entries = home ? items.slice(0, 6) : items;
  const renderArticle = entry => <article key={entry.id}><time dateTime={entry.date}>{entry.date}</time><h3><a href={newsPath(entry)}>{entry.title}</a></h3><p>{entry.summary}</p>{home ? <a className="news-article-link" href={newsPath(entry)} aria-label={'Read article: '+entry.title}><Arrow/></a> : <More href={newsPath(entry)}>Read article</More>}</article>;
  return <section className={home ? 'updates news-module' : 'catalog news-module'}>
    <div className="news-heading"><em>Latest Updates</em><h2>What's <br/><strong>news</strong></h2>{home && <More href="/news/"/>}</div>
    {entries.length ? home ? <SlidingRail items={entries} label="company news" className="news-rail" render={renderArticle}/> : <div className="news-list">{entries.map(renderArticle)}</div> : <div className="news-list"><article className="news-empty"><h3>Stay connected with LSK Tools</h3><p>Company updates will appear here when they are published.</p><More href="/contact/">Contact us</More></article></div>}
    {home && <Sparks/>}
  </section>;
}
function Home() {
  return (
    <>
      <Hero />
      <section className="popular">
        <div className="popular-visual">
          <img src={products[1].image} alt="Cordless drill" />
        </div>
        <div className="popular-copy reveal">
          <h2>
            <strong>Popular</strong> products
          </h2>
          <p>Discover the LSK Tools power tool range.</p>
          <div className="categories">
            {[
              ["Cordless Drills", 1],
              ["Impact Wrenches", 4],
            ].map(([n, i]) => (
              <a href={productCategoryPath(n)} key={n}>
                <img src={"/design/images/icon-1-" + i + ".png"} alt="" />
                {n}
              </a>
            ))}
          </div>
          <More href="/product/" />
        </div>
      </section>
      <Carousel />
      <About />
      <section className="features">
        <div className="section-heading reveal">
          <em>Why Choose Us</em>
          <h2>
            What sets us <strong>apart</strong>
          </h2>
        </div>
        <div className="feature-layout">
          <div>
            {[0, 1, 2].map((i) => (
              <Feature key={i} i={i} />
            ))}
          </div>
          <img
            className="feature-product"
            src={products[1].image}
            alt="LSK Tools cordless drill"
          />
          <div>
            {[3, 4, 5].map((i) => (
              <Feature key={i} i={i} />
            ))}
          </div>
        </div>
      </section>
      <News home />
      <PartnersSection />
    </>
  );
}
const partnerRailResponsive = [{breakpoint:1000,slidesToShow:2}];
export function PartnersSection({items=site.partners}) {
  const [rows,setRows]=useState(()=>matchMedia('(max-width: 999px)').matches?1:2);
  useEffect(()=>{
    const media=matchMedia('(max-width: 999px)');
    const update=()=>setRows(media.matches?1:2);
    media.addEventListener('change',update);
    return ()=>media.removeEventListener('change',update);
  },[]);
  const columns=[];
  for(let index=0;index<items.length;index+=rows) columns.push(items.slice(index,index+rows));
  return <section className="partners"><div className="partners-copy">
    <em>Build your next product range</em><h2>Partners</h2>
    <p>Looking for tools for your business? Browse our catalogue and prepare a product enquiry.</p>
    <More href="/contact/">Contact us</More>
  </div>{items.length>0 && <SlidingRail key={rows} items={columns} label="partners" className="partner-carousel" slidesToShow={3} responsive={partnerRailResponsive} render={column=><div className="partner-column">{column.map(partner=><a key={partner.name} href={partner.href || '/contact/'}><img src={partner.logo} alt={partner.name} loading="lazy"/></a>)}</div>}/>}</section>;
}
export function ProductPage({product}) {
  const [search,setSearch]=useState('');
  const categories=[...new Set(products.map(item=>item.category))];
  const related=products.filter(item=>item.id!==product.id).sort((a,b)=>Number(b.category===product.category)-Number(a.category===product.category));
  const index=products.findIndex(item=>item.id===product.id);
  const labels={voltage:'Voltage',torque:'Maximum torque',chuck:'Chuck size',speed:'No-load speed',impactRate:'Impact rate'};
  return <div className="product-page-layout"><aside className="product-page-sidebar"><label>Search categories<input type="search" value={search} onChange={event=>setSearch(event.target.value)} placeholder="Product category"/></label><h2>Product Category</h2><ul>{categories.filter(category=>category.toLowerCase().includes(search.toLowerCase())).map(category=><li key={category}><a aria-current={category===product.category?'true':undefined} href={productCategoryPath(category)}>{category}<span>{products.filter(item=>item.category===category).length}</span></a></li>)}</ul><h2>Related Products</h2><div className="product-side-related">{related.map(item=><a key={item.id} href={'/product/'+item.id+'/'}><img src={item.image} alt="" loading="lazy"/><span>{item.name}</span></a>)}</div><div className="product-side-contact"><h3>Contact Us</h3><p>Discuss your model, quantity and destination with LSK Tools.</p><a href="#product-enquiry">Prepare an enquiry →</a></div></aside>
    <div className="product-page-content"><ProductDetail product={product} fullPage/>
      <section className="product-specifications"><h2>Product specifications</h2><table><tbody>{Object.entries(labels).filter(([key])=>product[key]).map(([key,label])=><tr key={key}><th scope="row">{label}</th><td>{product[key]}</td></tr>)}</tbody></table><p>Confirm the required battery, charger, accessories and packaging when requesting a quotation.</p></section>
      <nav className="product-adjacent" aria-label="Adjacent products">{products[index-1] && <a href={'/product/'+products[index-1].id+'/'}>PREV: {products[index-1].name}</a>}{products[index+1] && <a href={'/product/'+products[index+1].id+'/'}>NEXT: {products[index+1].name}</a>}</nav>
      <section className="product-company"><img src={site.video.poster} alt="LSK Tools workshop" loading="lazy"/><div><em>About Us</em><h2>LSK Tools</h2><p>Explore our workshop and the cordless power tool range. Contact us to confirm the details for your next order.</p><More href="/about/">About LSK Tools</More></div></section>
      {site.certificates.length>0 && <section className="product-document-section"><h2>Certificates</h2><CertificateGallery/></section>}
      {site.news.length>0 && <News items={site.news.slice(0,3)}/>}
      <section id="product-enquiry" className="product-enquiry"><h2>Message Feedback</h2><p>Enquiry for {product.name}</p><Form expanded company productName={product.name}/></section>
      <section className="product-related"><h2>Related products</h2><div>{related.map(item=><a key={item.id} href={'/product/'+item.id+'/'}><img src={item.image} alt={item.imageAlt||item.name} loading="lazy"/><h3>{item.name}</h3><span>View product →</span></a>)}</div></section>
    </div>
  </div>;
}
export function ProductDetail({ product,fullPage=false }) {
  const pictures = product.gallery?.length ? product.gallery : [product.image];
  const [selected, select] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [galleryVersion,setGalleryVersion]=useState(0);
  const [galleryPaused,setGalleryPaused]=useState(false);
  const zoomTrigger = useRef(null);
  const closeGallery=()=>{setZoom(false);setGalleryVersion(value=>value+1);requestAnimationFrame(()=>zoomTrigger.current?.focus());};
  const labels = {voltage:'Voltage',torque:'Maximum torque',chuck:'Chuck size',speed:'No-load speed',impactRate:'Impact rate'};
  return <section className="detail"><div className="product-gallery">
    <SlidingRail key={galleryVersion} initialPaused={galleryPaused} onPauseChange={setGalleryPaused} initialIndex={selected} items={pictures.map((src,index)=>({src,index}))} label="product images" className="product-image-rail" slidesToShow={1} breakpoint={1000} pausedOverride={zoom} arrows verticalNavigation navigationLabel={pictures.length>1 ? item=><img src={item.src} alt={'View product image '+(item.index+1)}/> : undefined} render={(item,active)=><button ref={active?zoomTrigger:undefined} className="product-zoom" onClick={()=>{select(item.index);setZoom(true);}} aria-label={'Enlarge '+product.name}><img src={item.src} alt={product.name}/><span>View larger +</span></button>}/>
    </div><div className="product-summary"><em>{product.category}</em><h2>{product.name}</h2>{fullPage ? <><p>{product.description || `${product.name} from LSK Tools. Review the specifications below and tell us the quantity and configuration you require.`}</p><ul>{Object.entries(labels).filter(([key])=>product[key]).slice(0,3).map(([key,label])=><li key={key}>{label}: {product[key]}</li>)}</ul></> : <dl>{Object.entries(labels).filter(([key]) => product[key]).map(([key,label]) => <React.Fragment key={key}><dt>{label}</dt><dd>{product[key]}</dd></React.Fragment>)}</dl>}<More href={fullPage?'#product-enquiry':'/contact/?product=' + encodeURIComponent(product.name)}>ENQUIRE NOW</More></div>
    {zoom && <Modal title={product.name + ' enlarged image'} returnFocus={zoomTrigger} close={closeGallery} onKeyDown={event => {if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();select(value => (value+(event.key==='ArrowLeft'?pictures.length-1:1))%pictures.length);}}}><div className="product-lightbox"><ZoomableImage key={pictures[selected]} src={pictures[selected]} alt={product.name}/>{pictures.length > 1 && <div className="gallery-controls"><button aria-label="Previous image" onClick={() => select((selected+pictures.length-1)%pictures.length)}>←</button><span>{selected+1} / {pictures.length}</span><button aria-label="Next image" onClick={() => select((selected+1)%pictures.length)}>→</button></div>}</div></Modal>}
  </section>;
}
function FactoryPage() {
  const [category, setCategory] = useState('All');
  const [selected, select] = useState(null);
  const [video, showVideo] = useState(false);
  const imageTrigger=useRef(null);
  const videoTrigger=useRef(null);
  const entries = factoryGallery.filter(item => category === 'All' || item.category === category);
  const categories = ['All', ...new Set(factoryGallery.map(item => item.category))];
  return <main className="interior"><PageTitle>Factory</PageTitle><section className="factory-page">
    <div className="factory-intro"><div><em>Inside LSK Tools</em><h2>Take a closer look</h2><p>Explore scenes from our factory video, or watch the full introduction.</p></div><button className="more" ref={videoTrigger} onClick={() => showVideo(true)}>WATCH VIDEO <span aria-hidden="true">▶</span></button></div>
    <div className="filters" aria-label="Factory gallery categories">{categories.map(item => <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>
    <div className="factory-grid">{entries.map((item,index) => <figure key={item.src}><button onClick={event => {imageTrigger.current=event.currentTarget;select(index);}} aria-label={'Enlarge ' + item.title}><img src={item.src} alt={item.title} loading="lazy"/><span aria-hidden="true">+</span></button><figcaption>{item.title}</figcaption></figure>)}</div>
    <p className="gallery-note">Images are stills from the LSK Tools introduction video.</p>
    {selected !== null && <Modal title={entries[selected].title} close={() => select(null)} returnFocus={imageTrigger} onKeyDown={event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();select(index=>(index+(event.key==='ArrowRight'?1:entries.length-1))%entries.length);}}}><div className="factory-lightbox"><ZoomableImage key={entries[selected].src} src={entries[selected].src} alt={entries[selected].title}/><div className="gallery-controls"><button aria-label="Previous factory image" onClick={() => select((selected+entries.length-1)%entries.length)}>←</button><span aria-live="polite">{entries[selected].title} · {selected+1}/{entries.length}</span><button aria-label="Next factory image" onClick={() => select((selected+1)%entries.length)}>→</button></div></div></Modal>}
    {video && <Modal title="LSK Tools factory video" close={() => showVideo(false)} returnFocus={videoTrigger}><video src={site.video.src} poster={site.video.poster} controls autoPlay playsInline/></Modal>}
  </section></main>;
}
function OemPage() {
  return <main className="interior oem-page"><PageTitle>OEM &amp; ODM</PageTitle>
    <div className="oem-body">
      <div className="oem-product-banner" aria-label="LSK Tools cordless product range">{products.map(product => <a key={product.id} href={'/product/'+product.id+'/'}><img src={product.image} alt={product.name}/></a>)}</div>
      <section className="oem-intro reveal"><em>OEM &amp; ODM</em><h2>{oemContent.title}</h2><p>{oemContent.intro}</p></section>
      <section className="oem-capabilities"><div className="oem-heading reveal"><em>Customized</em><h2>Customization capability</h2></div>
        {oemContent.sections.map((section,index) => {
          const product = products.find(item => item.id === section.productId);
          return <article className="oem-row" key={section.id}>
            <a className={'oem-visual '+(product ? 'is-product' : 'is-workshop')} href={section.href}><img src={product?.image || section.image} alt={product?.name || section.imageAlt} loading="lazy"/></a>
            <div className="oem-text"><span className="oem-number" aria-hidden="true">{String(index+1).padStart(2,'0')}</span><div className="reveal"><h3>{section.title}</h3><p>{section.body}</p><More href={section.href}>{section.linkLabel}</More></div></div>
          </article>;
        })}
      </section>
      <section className="oem-quality"><div className="oem-heading reveal"><em>Customized</em><h2>Quality assurance</h2><p>Discuss the checks and documentation required for your order.</p></div><div className="oem-quality-grid">{oemContent.quality.map((item,index) => <article className="reveal" key={item.id}><span className="quality-symbol" aria-hidden="true">{['◇','⚙','✓'][index]}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></section>
      <section className="oem-documents"><div className="oem-heading reveal"><em>Documentation</em><h2>Third party inspection</h2><p>Tell us which test reports or supporting documents your project requires. Availability must be confirmed for the selected model and market.</p></div>{site.certificates.length ? <CertificateGallery/> : <More href="/contact/">REQUEST DOCUMENTATION</More>}</section>
      <section className="oem-partners"><div><em>Build your next product range</em><h2>Partners</h2><p>Talk to LSK Tools about your business requirements.</p><More href="/contact/">CONTACT US</More></div>{site.partners.length > 0 && <div className="partner-logos">{site.partners.map(partner => <img key={partner.name} src={partner.logo} alt={partner.name}/>)}</div>}</section>
    </div>
  </main>;
}
function CapacityPage({path}) {
  const [query,setQuery] = useState('');
  const quality = path.includes('quality');
  const oem = path.includes('oem');
  const index = path === '/capacity/' || path === '/capacity';
  const title = index ? 'Capacity' : oem ? 'OEM & ODM' : quality ? 'Quality control' : 'Intelligent production';
  const cards = [{title:'Intelligent production',image:factoryGallery[0].src,href:'/capacity/intelligent-production/smart-factory.html',copy:'Explore the workshop through the LSK Tools factory video.'},{title:'Quality control',image:factoryGallery[1].src,href:'/capacity/strict-quality-control/',copy:'Discuss the inspection requirements for your selected tools.'}];
  const group = capacityGroups[quality ? 1 : 0];
  const page = group.pages.find(item => item.path === path) || group.pages[quality ? 1 : 0];
  const matches = group.pages.filter(item => (item.title+' '+item.body.join(' ')).toLowerCase().includes(query.trim().toLowerCase()));
  return <main className="interior"><PageTitle>{index ? title : group.title}</PageTitle>{index ? <section className="capacity-grid">{cards.map(card => <article key={card.href}><a className="capacity-image" href={card.href}><img src={card.image} alt={card.title}/></a><div><h2>{card.title}</h2><p>{card.copy}</p><More href={card.href}/></div></article>)}</section> : <div className="capacity-layout"><aside className="capacity-sidebar"><input type="search" aria-label="Search capacity topics" placeholder="Search topics…" value={query} onChange={event => setQuery(event.target.value)}/><h2>{group.title}</h2><nav aria-label="Capacity topics">{matches.map(item => <a key={item.path} href={item.path} aria-current={item.path === page.path ? 'page' : undefined}>{item.title}<span aria-hidden="true">›</span></a>)}</nav>{!matches.length && <p role="status">No matching topics.</p>}<div className="capacity-contact"><h3>Contact us</h3><p>Discuss your next product range with LSK Tools.</p><More href="/contact/">PREPARE AN ENQUIRY</More></div><a className="capacity-other" href={capacityGroups[quality ? 0 : 1].pages[0].path}>{capacityGroups[quality ? 0 : 1].title} →</a></aside><article className="capacity-article"><nav className="capacity-crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/capacity/">Capacity</a><span>/</span><span>{page.title}</span></nav>{page.image && <figure><img src={page.image} alt={page.imageAlt}/><figcaption>{page.imageAlt}</figcaption></figure>}<h2>{page.title}</h2>{page.body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}{page.video && <video controls playsInline preload="metadata" poster={site.video.poster} src={site.video.src}/>} {page.certificates && <CertificateGallery/>}<More href="/contact/">DISCUSS YOUR REQUIREMENTS</More></article></div>}</main>;
}
export function CertificateGallery({items = site.certificates || [], pageSize = 12}) {
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(null);
  const trigger = useRef(null);
  const pages = Math.ceil(items.length / pageSize);
  const currentPage = Math.min(page, Math.max(0, pages - 1));
  const selectedItem = selected === null ? null : items[selected];
  const move = delta => setSelected(index => (index + delta + items.length) % items.length);
  const changePage = next => { setPage(next); setSelected(null); };
  return <section className="certificate-page" aria-label="Certificate gallery">
    {items.length ? <>
      <div className="certificate-grid">{items.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map((item,index) => <figure key={item.id || item.src}>
        <button aria-label={'Enlarge ' + item.title} onClick={event => {trigger.current = event.currentTarget; setSelected(currentPage * pageSize + index);}}>
          <img src={item.thumbnail || item.src} alt={item.title} loading="lazy"/>
          <span aria-hidden="true">+</span>
        </button>
        <figcaption>{item.title}</figcaption>
      </figure>)}</div>
      {pages > 1 && <nav className="gallery-pagination" aria-label="Certificate pages">
        <button disabled={currentPage === 0} aria-label="Previous certificate page" onClick={() => changePage(currentPage - 1)}>‹</button>
        {Array.from({length:pages},(_,index) => <button key={index} aria-current={currentPage === index ? 'page' : undefined} aria-label={'Certificate page ' + (index+1)} onClick={() => changePage(index)}>{index+1}</button>)}
        <button disabled={currentPage === pages - 1} aria-label="Next certificate page" onClick={() => changePage(currentPage + 1)}>›</button>
      </nav>}
      <p className="gallery-count" aria-live="polite">{currentPage * pageSize + 1}–{Math.min((currentPage+1)*pageSize,items.length)} / {items.length}</p>
    </> : <div className="certificate-empty"><h2>Product documentation</h2><p>Contact us for documentation for the product you are considering.</p><More href="/contact/">CONTACT US</More></div>}
    {selectedItem && <Modal title={selectedItem.title} close={() => setSelected(null)} returnFocus={trigger} onKeyDown={event => {if(event.key === 'ArrowRight') {event.preventDefault();move(1);} if(event.key === 'ArrowLeft') {event.preventDefault();move(-1);}}}>
      <div className="certificate-lightbox"><ZoomableImage key={selected} src={selectedItem.src} alt={selectedItem.title}/>
        <div className="gallery-controls"><button aria-label="Previous certificate" onClick={() => move(-1)}>←</button><span aria-live="polite">{selectedItem.title} · {selected+1}/{items.length}</span><button aria-label="Next certificate" onClick={() => move(1)}>→</button></div>
      </div>
    </Modal>}
  </section>;
}
export function CultureSections({content = cultureContent}) {
  const [tabIndex,setTab] = useState(0);
  const tabRefs = useRef([]);
  const history = content.history || [];
  const activities = content.activities || [];
  const activity = activities[Math.min(tabIndex,activities.length-1)];
  const chooseTab = index => {setTab(index);tabRefs.current[index]?.focus();};
  return <div className="culture-body">
    <section className="culture-services"><div className="culture-heading"><em>Corporate culture</em><h2>{content.heading}</h2></div><div className="culture-service-grid">{content.services.map((service,index) => <article key={service.title}><span className="culture-service-icon" aria-hidden="true">{index === 0 ? '◇' : '⚙'}</span><h3><a href={service.href}>{service.title}</a></h3><p>{service.body}</p><More href={service.href}/></article>)}</div></section>
    <section className="culture-history"><em>Every step of the journey</em><h2>Development history</h2>{history.length ? <SlidingRail items={history} label="company history" className="history-rail" breakpoint={1000} cycle navigationLabel={item => item.year} render={item => <div className="history-entry"><strong>{item.year}</strong><div><h3>{item.title}</h3><p>{item.body}</p></div></div>}/> : <p className="culture-empty">Company milestones will appear here when published.</p>}</section>
    <section className="culture-activities"><div className="culture-heading"><em>Life at LSK Tools</em><h2>Employee care</h2></div>
      {activities.length > 0 && <><div className="culture-tabs" role="tablist" aria-label="Employee care topics">{activities.map((item,index) => <button key={item.id} ref={element => {tabRefs.current[index]=element;}} role="tab" id={'culture-tab-'+item.id} aria-controls={'culture-panel-'+item.id} aria-selected={tabIndex === index} tabIndex={tabIndex === index ? 0 : -1} onClick={() => setTab(index)} onKeyDown={event => {const targets={ArrowRight:(index+1)%activities.length,ArrowLeft:(index+activities.length-1)%activities.length,Home:0,End:activities.length-1};if(event.key in targets){event.preventDefault();chooseTab(targets[event.key]);}}}>{item.label}</button>)}</div>
      <div className="culture-panel" role="tabpanel" id={'culture-panel-'+activity.id} aria-labelledby={'culture-tab-'+activity.id} tabIndex={0} key={activity.id}><p>{activity.description}</p>{activity.images?.length > 0 && <div className="culture-photo-grid">{activity.images.map(image => <figure key={image.src}><img src={image.src} alt={image.alt} loading="lazy"/>{image.caption && <figcaption>{image.caption}</figcaption>}</figure>)}</div>}</div></>}
    </section>
  </div>;
}
export function ContactInformation({contact = site.contact}) {
  return <section className="contact-information"><div className="contact-heading"><em>Contact info</em><h2>{site.brand.name}</h2>{contact.address && <address>{contact.address}</address>}</div>
    {contact.departments?.length > 0 ? <div className="contact-departments">{contact.departments.map(department => <article key={department.name}><h3>{department.name}</h3><dl>
      {department.phone && <div><dt>Call us</dt><dd><a href={'tel:'+department.phone.replace(/[^+\d]/g,'')}>{department.phone}</a></dd></div>}
      {department.officePhone && <div><dt>Office phone</dt><dd><a href={'tel:'+department.officePhone.replace(/[^+\d]/g,'')}>{department.officePhone}</a></dd></div>}
      {department.email && <div><dt>Email us</dt><dd><a href={'mailto:'+department.email}>{department.email}</a></dd></div>}
      {department.whatsapp && <div><dt>WhatsApp</dt><dd><a href={'https://wa.me/'+department.whatsapp.replace(/\D/g,'')} target="_blank" rel="noreferrer">{department.whatsapp}</a></dd></div>}
      {department.wechat && <div><dt>WeChat</dt><dd>{department.wechat}</dd></div>}
    </dl></article>)}</div> : <p className="contact-empty">Prepare an enquiry below with your selected products and requirements.</p>}
  </section>;
}
function ContactPage() {
  return <main className="interior"><PageTitle>Contact us</PageTitle><div className="contact-layout"><ContactInformation/><section className="contact-enquiry"><div><em>Contact us</em><h2>Get in touch</h2><p>Tell us which tools you are interested in, your quantities and any branding, packaging or inspection requirements.</p><p>Include your destination market and preferred schedule so the details can be reviewed together.</p></div><Form expanded/></section>{site.contact.mapEmbedUrl && <section className="contact-map" aria-label="Factory location"><iframe title="LSK Tools factory location" src={site.contact.mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer"/></section>}</div></main>;
}
export function FaqPage({items=site.faq||[]}){
  const [active,setActive]=useState(null);
  return <main className="interior"><PageTitle>FAQ</PageTitle><section className="faq-page"><em>Some Frequently Asked Questions</em><h2>You can learn more<br/>from our questions</h2>
    {items.length ? <div className="faq-list">{items.map((item,index)=><section className={'faq-item'+(active===index?' is-open':'')} key={item.question}><h3><button id={'faq-question-'+index} aria-expanded={active===index} aria-controls={'faq-answer-'+index} onClick={()=>setActive(index)}>{item.question}<span aria-hidden="true">{active===index?'−':'+'}</span></button></h3><div className="faq-answer" id={'faq-answer-'+index} role="region" aria-labelledby={'faq-question-'+index} aria-hidden={active!==index} inert={active!==index}><div><p>{item.answer}</p></div></div></section>)}</div> : <p>Frequently asked questions will be added here.</p>}
    <div className="faq-enquiry"><em>Your Question</em><h2>Ask LSK Tools</h2><Form expanded question/></div></section></main>;
}
function Interior() {
  const route = resolveRoute(location.pathname, products, site.news);
  const path = route.path, p = route.product;

  if (route.kind === 'not-found') return <main className="interior"><PageTitle>Page not found</PageTitle><section className="content-pending"><h2>Let's get you back on track</h2><p>This page is unavailable. Browse our product range or return to the homepage.</p><More href="/">BACK TO HOME</More></section></main>;
  if (path === '/factory/' || path === '/about/factory/') return <FactoryPage/>;
  if (path === '/contact/') return <ContactPage/>;
  if (path === '/privacy-policy/') return <PrivacyPage/>;
  if (path === '/about/') return <AboutPage/>;
  if (path === '/oem-odm/' || path === '/capacity/oem-odm/') return <OemPage/>;
  if (path.startsWith('/capacity') || path === '/oem-odm/') return <CapacityPage path={path}/>;
  if (path === '/corporate-culture/' || path === '/about/corporate-culture/') return <main className="interior"><PageTitle>Corporate culture</PageTitle><CultureSections/></main>;
  if (path.startsWith('/news/')) {
    const article = site.news.find(entry => path === newsPath(entry) || path === '/news/' + entry.id + '/');
    const category=newsCategories.find(item=>path==='/news/'+item.id+'/');
    return <main className="interior"><PageTitle>{article?.title || category?.label || 'News'}</PageTitle>{article ? <NewsArticle article={article}/> : <NewsArchive key={category?.id||'all'} category={category?.id||''}/>}</main>;
  }
  if (path === '/faq/' || path === '/about/faq/') {
    return <FaqPage/>;
  }
  if (path === '/honor/' || path === '/about/certificate/') {
    return <main className="interior"><PageTitle>Certificate</PageTitle><CertificateGallery/></main>;
  }
  return (
    <main className="interior">
      <PageTitle>
          {p?.name ||
            (path.includes("product")
              ? "Products"
              : path.includes("contact")
                ? "Contact us"
                : path.includes("about")
                  ? "About LSK Tools"
                  : path.includes("capacity")
                    ? "Capacity"
                    : "News")}
      </PageTitle>
      {p ? (
        <ProductPage product={p} />
      ) : path.includes("product") ? (
        <ProductArchive category={productCategories(products).find(category=>productCategoryPath(category)===path)||''}/>
      ) : path.includes("contact") ? (
        <section className="contact-page">
          <h2>Let's talk tools</h2>
          <Form />
        </section>
      ) : path.includes("about") ? (
        <About />
      ) : (
        <section className="content-pending">
          <h2>LSK Tools</h2>
          <p>
            {path.includes("news")
              ? "No company news has been added yet."
              : "Explore our product range and contact us about your requirements."}
          </p>
          <More href="/product/">EXPLORE PRODUCTS</More>
        </section>
      )}
    </main>
  );
}
export function App() {
  useEffect(() => {
    const o = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            o.unobserve(e.target);
          }
        }),
      { threshold: site.motion.revealThreshold },
    );
    document.querySelectorAll(".reveal").forEach((e) => o.observe(e));
    return () => o.disconnect();
  }, []);
  return (
    <div className="site-shell" style={{'--transition-duration':site.motion.transitionMs+'ms','--product-mask-duration':site.motion.productMaskMs+'ms','--product-text-delay':site.motion.productTextDelayMs+'ms','--product-image-delay':site.motion.productImageDelayMs+'ms'}}>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header />
      <div id="main">{location.pathname === "/" ? <Home /> : <Interior />}</div>
      <Footer />
    </div>
  );
}
