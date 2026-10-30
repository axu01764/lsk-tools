# Reusing the LSK Tools template

Home includes the reference's three social share links. Set `site-config.json` → `publicUrl` to the deployed homepage URL; an empty value shares the current page URL. Links open the provider's sharing composer in a new tab and never submit a post automatically. No social-account credentials are needed.

The footer also generates a website QR code locally with qrcode-generator. Set publicUrl to a full HTTPS URL before public deployment; when empty, the QR uses the current origin's homepage (localhost in local previews). No external QR-generation service receives the address.

Malformed publicUrl values fall back to the current page/origin at runtime and are reported by `npm run audit:content`. Only absolute HTTP(S) URLs without embedded credentials are accepted. International domain/path characters are normalized before encoding. A URL beyond QR capacity keeps a website link instead of breaking page rendering.

Shared interior banners use `site-config.json` → `innerBannerBackground`. The default reuses the AI workshop illustration; it is not a photograph of the LSK factory. Supply a local image path to replace it. Banner geometry follows the English reference's 1914:626 ratio, with desktop overlay navigation and mobile 40px navigation above it.

Run `npm install`, then `npm run dev -- --host 127.0.0.1 --port 4173 --strictPort`. `npm run build` produces `dist/client` and the supplied hosting adapter. All content and assets are local; enquiry submission currently downloads JSON and does not send email.

## Site settings

Homepage partner entries use the shared sliding rail: three columns with two rows on desktop, two columns with one row below1000px. More entries than fit rotate automatically using the configured motion timing; Pause/Resume, keyboard navigation and touch swiping remain available. Empty partner data keeps the existing invitation without sample logos. The source's Slick registerBreakpoints implementation overwrites duplicate breakpoint settings, so the second1000px rule (rows:1) is effective. Resizing across that breakpoint regroups the entries and restarts the rail without retaining an invalid slide position.

Edit `src/site-config.json`:

- `brand.logo`: local logo URL; `brand.name`: logo alternative text. Visible editorial copy still uses LSK Tools and should be reviewed when rebranding.
- `hero`: ordered slides with `title`, `description`, and an existing product `productId`.
- `motion.autoplayMs`: hero and product rotation interval. Fewer than two slides does not create a timer.
- Product/news sliding rails expose Pause/Resume controls when their content exceeds the visible count. Inactive loop copies are inert. Mobile shows one card, desktop two. Manual controls remain available while autoplay is paused.
- Hero and shared rails also suspend autoplay while keyboard focus is inside them, matching the source's pauseOnFocus behavior. Leaving the carousel resumes autoplay unless the user has explicitly paused it, a parent has paused it, or reduced motion is enabled. Focus changes do not overwrite the explicit Pause/Resume selection.
- `motion.transitionMs`: hero fade, hero entrance, and scroll reveal duration.
- `motion.stickyAfterPx`: sticky header threshold.
- `motion.revealThreshold`: intersection ratio for section reveal and company counters.
- `motion.productMaskMs`, `productTextDelayMs`, `productImageDelayMs`: product-card background duration and text/image entrance delays.
- `companyStats`: optional entries `{ "value": 25, "label": "EXAMPLE ONLY", "suffix": "+", "decimals": 0 }`. Only add verified company facts. Counters start once on entering view, in 50 steps of 60 ms. Reduced motion displays the final value immediately. The distributed array is empty and the page instead animates the existing product voltage/torque facts (12V,21V,550 N·m) using the same counter. These fallback values describe the supplied sample products; review them if replacing that product range.
- `partners`: optional `{ "name": "Partner name", "logo": "/media/partner.png", "href": "https://example.com" }` entries. Add only authorized partner marks; distributed array is empty.
- `news`: entries with `id`, ISO `date`, `title`, `summary`, and `body` (plain paragraph strings). Home shows up to six entries; `/news/` lists all, and `/news/<id>/` shows an article. No company news is fabricated.
- `video.src`, `video.poster`: factory video and cover image.
- `contact`: reserved settings; endpoint integration is not implemented. Changing the value does not enable sending.

## Products and gallery

Edit `src/products.json`. Keep unique IDs; hero references depend on those IDs. Each product has `name`, `category`, `image` and the appropriate specification fields. Optional `gallery` is an array of image URLs; when present it replaces the single-image view and enables thumbnails and previous/next lightbox controls. Use true transparent PNGs for product silhouettes.

Edit `src/factory-gallery.json` for factory images. Entries require `src`, `title`, `category`; `source` records provenance for editors. Categories are derived automatically. Current images come from the user-supplied factory video and retain its original subtitles.

Assets live in `public/media`; URLs start with `/media/`. Keep the yellow paint at `public/media/paint.png` and decorative resources in `public/design`. No API keys belong in the frontend or configuration.

## Validation status

During local development, `/template-preview.html` previews three clearly labeled QA news records, integer/decimal counters and a mixed-tool gallery. It imports the same production components but is not included in the standard Vite build. These values never enter `site-config.json` or the production product records. Use it for future regression checks rather than adding fake company data to the main site. Product lightboxes support left/right arrow keys, Escape, and focus restoration to the zoom trigger.

Read `design-qa.md` and `IMPLEMENTATION.md`. Build success alone is not a fidelity pass. Company-counter and partner populated states need browser verification before release; mobile menu and factory filtering have been exercised. Other interior source matching and comprehensive route checks remain open.

## Certificate gallery

`site-config.json` supports a `certificates` array. Each entry has `id` (unique), `title`, `src` (full image URL), and optional `thumbnail`. Supply genuine documentation images in public/media and reference their /media/ paths. The default array is empty; the public page shows an enquiry link until documents are supplied.

The gallery presents three desktop columns, two tablet columns, one mobile column, 12 items per page, numbered pagination, and a modal image viewer with previous/next buttons, left/right keys, Escape dismissal, and focus restoration to the opening thumbnail. Page selection is local component state. The viewer can cycle across all supplied documents, including those on another grid page. `template-preview.html` contains 14 explicitly labelled product-image fixtures for development testing only; they are not certificates or company claims.

## OEM / ODM page

Edit `src/oem-content.json` to configure the introduction, four alternating capability sections and three quality cards. Each capability section has a stable `id`, `title`, `body`, `href`, `linkLabel`, and either a `productId` referencing products.json (keeps image upgrades synchronized) or `image` plus `imageAlt`. Product images use contain sizing; workshop images use cover sizing. Keep capability statements grounded in verified LSK materials.

`/oem-odm/` and `/capacity/oem-odm/` render the same page. Certificate and partner sections read `site-config.json` arrays, remaining empty until genuine documents and authorized partner logos are supplied. Contact links use the existing enquiry workflow; no external sending service is configured.

## Corporate culture

`src/culture-content.json` configures the corporate culture page and its alias. `services` entries contain title/body/href. `history` entries contain optional id, year, title and body; preserve source chronology when entering verified company milestones. The history display shows two entries on desktop and one below 1000px, changes every configured autoplay interval, supports year selection and pause/resume, and disables autoplay for initial reduced-motion preference. `activities` entries contain stable id, label, description and images [{src,alt,caption?}]. Tabs support left/right, Home/End and roving keyboard focus. Image layouts show four/two/one columns at desktop/tablet/mobile widths. Default history and activity photos remain empty. Development-only fixtures demonstrate populated states without asserting company history.

History rail update: the culture history now uses SlidingRail, with 1000px content breakpoint (two/one entries), linked year navigation showing six/four/three positions at desktop/tablet/mobile sizes, continuous clone wrapping, horizontal swipe and keyboard arrows. Year navigation automatically scrolls to the active selection. Runtime changes to reduced-motion preference stop autoplay and settle transitions. The old history-pair description above is superseded. Fixtures now include eight explicitly labelled milestones.

## Contact page

`site-config.json.contact` supports `address`, `departments` and optional `mapEmbedUrl`. Department entries accept name, phone, officePhone, email, whatsapp (international number), and wechat (display ID). Empty values are omitted. Telephone and email links use tel/mailto; WhatsApp uses wa.me. The map appears only when a real location embed URL is supplied; do not use the reference manufacturer's location.

The contact-page form includes Subject, prefilled from the selected product, alongside name/phone/email/message. It retains the existing frontend-only JSON export and does not send an enquiry. A repeat-download link remains available after generation; the object URL is released when replaced or the component unmounts. The status accurately reports file readiness, not disk-save success. Footer form remains compact.

## Capacity detail pages

`src/capacity-content.js` defines production and quality groups, exact public child paths, titles, paragraphs and optional image/imageAlt, video and certificates flags. The route resolver consumes the same path list, so adding a configured article also registers its exact route. Arbitrary child URLs still return not-found. Detail pages provide sidebar topic filtering, active navigation, a contact panel, breadcrumbs and responsive single-column layout. Original source URLs are retained, while LSK text describes confirmed material or requests for confirmation rather than unsupported equipment/certification claims.

## News archive and article data

`site-config.json.news` remains empty until real LSK announcements are supplied. Entries accept `id`, `title`, `date`, `summary`, optional `author`, `image`, `imageAlt`, and `category` (`company-news` or `industry-news`). Categorized entries link to `/news/<category>/<id>.html`; existing `/news/<id>/` links remain valid. Category pages are registered explicitly. Home news links use the same path helper.

`body` accepts a string, an array of paragraph strings, or structured blocks: `{type:'heading',level:2|3,text}`, `{type:'list',items:[...]}`, `{type:'image',src,alt,caption}`, `{type:'table',caption,headers:[...],rows:[[...]]}`, and `{type:'paragraph',text}`. Rendering uses React text nodes, not raw HTML. Article order in the configuration determines Previous/Next order. The archive has 12 items per page, local search and three/two/one-column cards. Pagination and search state are local and reset on navigation; category routes are shareable. No publication backend is implied.

`news-preview.html` is a development-only fixture with 14 clearly labeled mock articles. Vite's production entry excludes that preview and its data.

## About Us profile

`src/about-content.json` controls the full `/about/` page independently from the homepage introduction: intro title and paragraphs, workshop image/alt, badge, video heading/copy, six linked service cards, and development collage/copy. The page also consumes shared `site.video`, `companyStats`, `certificates` and `partners`. Empty companyStats/partners arrays omit their sections; empty certificates show a documentation enquiry instead of claimed certifications. Do not populate unverified company age, capacity or qualifications from the reference company. All three workshop images are from the supplied LSK video; original subtitles remain visible in the frames. The video modal reuses focus restoration and Escape handling.

## Image inspection

Product, factory and certificate lightboxes share `ZoomableImage.jsx`. Its Zoom in / Fit image control and double-click toggle between fitted and 2x views. At2x, use scrollbars, touch scrolling or arrow keys with the image region focused. Gallery navigation resets the image to fit. Image-region arrow keys scroll when enlarged; arrows elsewhere in the dialog switch gallery items. Escape closes and returns focus to the original trigger. This is a CSS image enlargement, not AI resolution generation. The source transparent product PNGs remain unchanged.

## Full product details

`ProductPage` wraps `ProductDetail` with a category-search sidebar, related items, specifications table, adjacent-product links, company introduction, optional configured certificates/news, a product-aware enquiry form and related product cards. Existing product fields supply the specification rows; optional `description` replaces the brief default introduction. Related items exclude the current product and place matching-category items first. Product pages prefill Subject and Enquiry directly from the current product and add Company; contact-page query prefill still works. Enquire now links to the local form. Form output remains a local JSON download, not a sent message. At narrow widths the product content precedes the sidebar and the form uses one column.

Homepage hero: pause/resume sits beside the slide controls. Left/Right keys operate the focused carousel. Swipe requires horizontal travel over40px and greater than vertical travel; cancelled touches are ignored. Autoplay respects runtime prefers-reduced-motion changes and pauses while the document is hidden. The normal5s interval and1.5s fade remain configured through site.motion. Other homepage sections are unchanged by this audit.

Product search indexes only public display fields (name, category, voltage, torque, speed, chuck, impact rate and model). All query terms must match; unit punctuation is ignored, so550Nm matches550N·m. Provenance paths and image metadata are excluded. Search opened from mobile navigation restores focus to Open navigation when closed; desktop search restores its own trigger.

`heroBackground` selects the full-width work-scene backdrop independently of the yellow paint layer. Default hero-workshop-v1.png is AI-generated conceptual marketing artwork, not a factory photograph. Its provenance is documented in reference/lsk/hero-workshop-v1.md. Keep foreground product cutouts and paint separate so content substitutions preserve the composition.

ProductArchive.jsx drives /product/ and the two configured category pages. Its category labels/counts/thumbnails derive from products.json, while classification descriptions currently live in the component. The root groups products into category introduction rows. Category pages and a nonempty search display matching product cards. Category routes and header links now derive from products.json through product-categories.js. The three sample products do not exercise large-catalogue pagination.

Classification thumbnails now reuse SlidingRail with4 desktop slots,3 below1000px,2 below500px. They automatically loop only when products exceed the visible count. Timing comes from site.motion; defaults match reference5000ms/1500ms. Keyboard arrows, horizontal touch, pause and reduced-motion support are shared with other rails. classification-preview.html is a development-only seven-item QA fixture, not additional catalogue content.

Product lists use12 items per page. Category /page/N/ links and?q= searches survive reload/back navigation. Searching resets to page1; out-of-range positive pages are clamped and the URL normalized. product-pagination.js owns URL/page helpers. archive-preview.html is an isolated25-item development fixture and is excluded from the production entry build. New configured categories automatically gain exact archive and pagination routes; unknown categories remain not-found.

Homepage About parallax is controlled by motion.aboutParallaxSpeed (default0.5; set0 for static). It only runs above700px and respects reduced motion. The supplied portrait video frame remains separate from the diagonal texture layer, with bounded vertical travel to avoid exposed image edges. This affects the homepage About section, not the full About page.

FAQ content uses site-config.json.faq entries {question,answer}; absent/empty content displays the pending message. One answer opens at a time with200ms motion. The FAQ enquiry includes required name,email,phone,message and optional subject, preserving the template's local download behavior. faq-preview.html is a development-only interaction fixture and adds no public questions.

Optional product.gallery arrays now drive synchronized main-image/vertical-thumbnail sliders (5s autoplay,1.5s transition from site.motion). Single-image products omit slider controls. Lightbox viewing suspends autoplay and closing restores its selected image plus prior pause state. gallery-preview.html is the isolated7-image QA fixture; its mixed tools are not actual alternate views of a production product.

## Privacy information page

/privacy-policy/ and the footer link render the reference article/sidebar layout using src/privacy-content.json. Supply title,optional updatedAt/introduction and sections with heading,paragraphs:string[],optional items:string[]. Text is rendered as React content, without raw HTML. Empty sections show an unpublished message; the template supplies no company-specific legal commitments. Actual suitable privacy content must reflect the eventual deployed site's behavior.

## Source route inventory

npm run audit:routes reads reference/routes.json in the portable package, or ../reference/jingli/routes.json in the authoring workspace, and writes reports/route-inventory.json. It distinguishes exact local routes,mapped categories,data-driven records and the source-only external VR. Category/product/article template coverage does not mean the reference company's records were imported. The saved URL inventory is included in the portable package; audit:content is independent of source captures.

## Production asset check

After npm run build, run npm run preview -- --host 127.0.0.1 --port 4174 --strictPort, then npm run audit:build. The checker downloads each dist/client file and compares SHA256 with disk. It writes reports/production-assets-audit.json. An alternate preview base URL may be passed as npm run audit:build -- http://127.0.0.1:PORT/. This is a local artifact check, not a deployment test. product-image-review.html now lives at project root as a development-only review page and uses current clear-v3 PNGs.

Homepage partner layout: PartnersSection reads site.partners (name,logo,optional href). At desktop it uses40/60 copy/cards columns and a three-column grid of130px logo cards. Below1000px the columns stack. Cards transition from grayscale to color on hover and keyboard focus, respecting reduced motion. Empty production data keeps only the copy/contact CTA; no placeholder partners are published. partners-preview.html contains six explicitly labelled repeated-LSK-logo QA fixtures and an empty instance; this development entry is excluded from the default build.

Product archive mobile navigation: at1000px and below, desktop sidebar is replaced by a Categories trigger and compact shared product search. ProductCategoryMenu displays a90%-width native modal at10vh, bounded to80vh with200ms fade. Escape, close button or backdrop closes it; body scrolling and trigger focus are restored. Resizing above1000px closes the menu and restores desktop sidebar. Category links derive from the same products.json data. Product detail sidebars are a separate template and are not changed by this archive rule.
