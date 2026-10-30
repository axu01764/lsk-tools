# LSK Tools

Website: https://lsk-tools.vercel.app/

Repository: https://github.com/axu01764/lsk-tools

The Vercel project is connected to this repository. Pushes to `main` trigger production deployments.

English frontend template built with React and Vite. Includes responsive product/category pages, product image zoom, factory video, company pages, configurable news and FAQ, yellow paint styling and transparent AI product images.

## Development

Use Node.js 22.12+ or 24.

```sh
npm ci
npm run dev
```

## Verification and build

```sh
npm test
npm run audit:content
npm run audit:routes
npm run build
```

The static build is `dist/client`. `vercel.json` defines the Vite build and frontend route fallback. Missing media, design, JavaScript assets and API paths retain normal missing-resource behavior.

## Content

See [CONFIGURATION.md](CONFIGURATION.md). Product data is in `src/products.json`; company content, slides and public website URL are configured in `src/site-config.json` and the other content modules. Product specifications were transcribed from the supplied catalogue. AI product illustrations are presentation assets rather than engineering photographs. Factory video and stills are supplied local assets.

Enquiry forms currently download JSON files. They do not send email or submit to a backend. Empty company statistics, certificates, news and contacts are intentional until verified content is supplied.

Original source PDFs, research captures, local QA fixtures and private credentials are not required to run the website and are not included in this repository.
