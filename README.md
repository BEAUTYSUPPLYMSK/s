# Beauty Supply — Premium US Beauty Imports

> **Live Demo:** [https://beautysupplymsk.github.io/s/](https://beautysupplymsk.github.io/s/)  
> **Production Domain (planned):** https://beauty-supply.shop

Static e-commerce website for Beauty Supply (Премиальная косметика из США в России).

## Tech Stack
- Vanilla HTML5, CSS3, JavaScript (ES6)
- GitHub Pages static hosting
- Mobile-first, responsive design
- Open Graph, Schema.org JSON-LD structured data

## Project Structure
```
/
├── .nojekyll
├── index.html
├── robots.txt
├── sitemap.xml
├── assets/
│   ├── data/
│   │   ├── products.json
│   │   └── reviews.json
│   ├── images/
│   ├── products/
│   └── icons/
├── styles/
│   ├── tokens.css
│   ├── base.css
│   └── main.css
├── scripts/
│   ├── main.js
│   └── components.js
└── pages/
    ├── catalog.html
    ├── product.html
    ├── about.html
    ├── delivery.html
    ├── reviews.html
    ├── contacts.html
    ├── preorder.html
    ├── 404.html
    └── legal/
        ├── privacy.html
        └── offer.html
```

## Setup & Deployment
This repository is deployed directly to GitHub Pages via GitHub Actions (`.github/workflows/pages.yml`).
