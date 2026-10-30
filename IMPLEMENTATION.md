# LSK Tools frontend template — current implementation

Status: in progress; full reference fidelity and final handoff have not been approved. This document supersedes IMPLEMENTATION-history.md. Detailed chronological evidence is in design-qa.md; configuration guidance is in CONFIGURATION.md.

## Run and check

Run from the prototype directory with Node22.12+ or Node24 (the production runtime):

- npm ci
- npm run dev -- --host 127.0.0.1 --port 4173 --strictPort
- npm run build
- npm test
- npm run audit:content

The build produces dist/client and the Sites worker/hosting manifest. Preview source is frontend-only; enquiries generate a local JSON download and are not sent to a company or backend.

## Implemented surfaces

| Surface | Current behavior and evidence |
|---|---|
| Home | English LSK branding, yellow paint/torn design, AI conceptual work background, transparent product cutouts,5s/1.5s hero and product rails, keyboard/touch/pause,150px sticky navigation, reveal/sparks, video ripple, bounded About parallax. Browser evidence: reference/captures/home-generated-workshop-background.png and home-about-parallax.png. |
| Navigation/search | Desktop dropdowns,280px mobile push drawer with independent scrolling/close/focus return; product search supports names and specifications. Mobile drawer and search checked. |
| Product archive | Category introduction rows, circular4/3/2 thumbnail rail; category lists/search;12-item pagination, URL query/page persistence, invalid-page normalization. New categories now derive routes and header/side links from products.json. |
| Product details | Specifications, related products, enquiry prefill, synchronized main/vertical thumbnail gallery, lightbox zoom/navigation, pause while enlarged, selection/pause/focus restoration. Single-image catalogue entries omit extra gallery controls. |
| About/factory/culture/OEM | Dedicated configured layouts, real supplied video and extracted stills, factory filters/lightbox, culture history rail and activity tabs, alternating OEM rows. Optional company claims remain unpopulated. |
| Capacity | Production and quality overview/detail pages, topic sidebar/filter, breadcrumbs, video and documentation surfaces. Routes come from capacity-content.js. |
| News/certificates | Configurable archive/detail or gallery templates; development fixtures exercise populated states and pagination. Real arrays remain empty. |
| FAQ/contact | Single-answer FAQ with200ms reveal; full question/contact forms and optional contact departments/map. No invented company FAQ, contact data or policy statements. |

## Content and source boundaries

Three current product records are traced to supplied PDF pages36/37. Their clear-v3 PNGs are AI reconstructions with transparency, not exact engineering photographs. Original extractions remain under reference/lsk. The supplied portrait factory video and three frame extracts are local. AI hero background provenance is recorded in reference/lsk/hero-workshop-v1.md.

Source English HTML/CSS/JS and route inventory are under reference/jingli. REA static evidence and setup verification were completed earlier; current runtime work uses captured source and browser observations. No reason to rerun REA installation for ordinary source edits. The current client may still require reconnecting to expose registered MCP tools.

No original manufacturer product photographs, address, contacts, certificates or corporate history are presented as LSK facts. Source-specific article/product records are replaced by configurable LSK data, not copied as company claims.

## Verification scope

Public URL handling now guards malformed settings (previously a bare domain threw from FooterConnect), normalizes international/subdirectory URLs, and retains a link if QR capacity is exceeded. Three regression tests added;18 tests pass. Content audit reports invalid publicUrl. Footer FAQ navigation restored. Build and tests were verified after these changes; see the versioned package verification report for the exact archive snapshot.

Footer QR/share region restored: local QR generation from publicUrl (current origin fallback), yellow diagonal area, three share links, hidden at<=1250px as in the source CSS. qrcode-generator2.0.4 is pinned in the lockfile. Browser-generated QR was independently decoded with zxing-cpp and matched http://localhost:4173/ (reports/footer-qr-check.json); desktop1440/mobile390 checked without horizontal overflow. Portable v4 and later include this addition and dependency.

Home social sharing is restored from the captured source #banner .share: three32px circular links, left20px/bottom40px,12px vertical spacing, yellow hover/focus state, delayed left entrance and reduced-motion support. publicUrl can supply the deployment URL. Desktop1440/mobile390 layout and encoded href/target/rel inspected in reports/home-share-check.json; no external post was submitted. Captures: reference/captures/home-share-desktop.png and home-share-mobile.png. The portable v3 candidate predates this addition.

Shared interior banner now follows the measured English source ratio1914:626: desktop navigation overlays the image (1440px header60px/top10px), title begins at50% height; mobile banner sits below40px navigation with content at20% and0.8 scale. Source measurements: reports/source-inner-banner.json. Local factory/product/privacy/contact checks: reports/interior-banner-check.json. Desktop sticky navigation checked at scroll787px: top0/height60px/dark background. Images are configurable through innerBannerBackground and reuse the AI illustration. The v3 portable candidate predates this banner change and must be refreshed at final handoff.

npm test currently runs18 tests covering exact routes, new configured categories, pagination boundaries/query URLs, specification matching, hosting fallback, public URLs and QR failure handling. npm run audit:content checks configured asset existence, JSON/capacity links and product/category routes, plus duplicate/colliding IDs. Latest report: reports/content-audit.json. This audit does not crawl rendered links or validate arbitrary JSX/CSS resources and is not a visual-fidelity proof.

## Deployment and latest template changes

Repository: https://github.com/axu01764/lsk-tools (main). Production: https://lsk-tools.vercel.app/. Vercel is connected to GitHub and uses Node24, npm ci, npm run build and dist/client. Deep-link rewrites exclude asset and API namespaces. publicUrl is set to the production homepage for QR and sharing; change it when reusing the template for another site. Environment files and local deployment credentials are excluded.

Footer enquiry now uses the reference's 42px fields and inline action, preserving its explicit download-only behavior. At 1440px the measured footer is453px high (source462px); desktop and390px mobile show no horizontal overflow. The populated home-news template uses arrow article links, reference typography and a light Read More button. Six development articles verified pause/keyboard navigation, two visible desktop cards and one mobile card. Six sample partner cards verified responsive layout. QA fixtures remain local and are excluded from builds and deployment. These checks cover the named components, not complete site fidelity.

Browser evidence includes desktop and390px mobile checks, multi-image/gallery fixtures, multiple rail breakpoints, lightboxes, focus return, video, search and list navigation. Test pages ending -preview.html are development-only entry points and are not included by the default production build.

## Remaining work before claiming complete

Route inventory reconciliation is recorded in reports/route-inventory.json (62 captured URLs). Privacy now has a configurable local template; source-only VR and manufacturer records are explicitly distinguished from LSK pages. This closes the previously missing route-family mapping, not the visual audit.
1. Run a consolidated source-to-local visual/interaction audit across Home and representative interior templates at matched viewport sizes. Historical screenshots and isolated successful controls do not prove the entire site matches.
2. Baseline production artifact checks now cover20 desktop interior pages,21 mobile pages,51 assets verified by SHA256 and menu/search/detail/enquiry/video flows. See reports/production-browser-audit.json and production-assets-audit.json. Populated optional production variants and complete interaction/visual coverage still need the final pass.
3. Portable archives are versioned source exports under ../deliverables. The current packaging pass targets lsk-tools-template-v5-candidate.zip, with the commit, archive hash and independent checks recorded externally in package-verification-v5.json. Source archives require npm ci and npm run build before preview. Prior v3/v4 archives remain historical snapshots. Packaging checks do not constitute visual-fidelity sign-off.

Real company statistics, certificates, partner logos, news/history and contact details are content inputs, not grounds to fabricate data. The frontend can retain empty states until they are supplied. A live enquiry endpoint is optional integration work beyond the current frontend download workflow.

## Latest motion updates

Partners now use the source multirow carousel: three columns/two rows on desktop, two columns/one row below1000px, following the last duplicate Slick breakpoint. Hero and shared rails suspend autoplay while keyboard focus remains inside; leaving resumes unless explicitly paused. Home fallback product facts now use the same50-step/60ms entry counter as configured company statistics. Evidence: reports/partner-carousel-breakpoint-check.json, carousel-focus-check.json and home-product-counter-check.json. These named checks do not replace the consolidated visual audit.
