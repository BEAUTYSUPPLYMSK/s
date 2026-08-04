# Beauty Supply — Premium US Cosmetics Catalog

🇺🇸 **100% Original Cosmetics from the USA delivered to Russia**

A premium static e-commerce website for importing and selling authentic US beauty products (Image Skincare, Charlotte Tilbury, Hourglass) in the Russian market.

## 🌟 Features

- **Premium Product Catalog**: 12+ authentic US beauty products
- **Telegram Bot Integration**: Direct ordering via official Telegram bot
- **Avito Integration**: Trusted Russian marketplace presence (5.0 rating, 33+ reviews)
- **Multi-category Filtering**: By brand, category, and skincare goals
- **Mobile-First Responsive Design**: Optimized for all devices
- **Performance Optimized**: Fast loading, lazy loading, optimized images
- **Accessible**: WCAG 2.2 AA compliant

## 🎨 Design System

### Color Palette — Elegant Light Beauty Aesthetic

| Color | Hex | Usage |
|-------|-----|-------|
| Pearl White | `#FDFBF9` | Background |
| Deep Plum | `#2D2438` | Primary Text |
| Rose Gold | `#C4917B` | Accent |
| Warm Ivory | `#F8F4F0` | Elevated Surfaces |
| Blush | `#FBF5F3` | Blush Tint |
| Rose Quartz | `#F9F0ED` | Rose Surface |
| Soft Lavender | `#F5F3FA` | Lavender Surface |

### Typography

- **Headings**: Cormorant Garamond (serif)
- **Body**: Inter (sans-serif)

## 📁 Project Structure

```
beauty-supply/
├── index.html              # Homepage
├── pages/
│   ├── catalog.html        # Product catalog with filters
│   ├── product.html        # Dynamic product detail page
│   ├── about.html          # About the company
│   ├── delivery.html       # Shipping & payment info
│   ├── reviews.html        # Customer reviews
│   ├── contacts.html       # Contact information
│   ├── preorder.html       # Special order request
│   ├── 404.html           # Error page
│   └── legal/
│       ├── privacy.html   # Privacy policy
│       └── offer.html     # Public offer
├── styles/
│   ├── tokens.css         # Design tokens & color palette
│   ├── base.css           # CSS reset & base styles
│   └── main.css           # Component styles
├── scripts/
│   ├── components.js      # Reusable UI components
│   └── main.js            # Page logic & filtering
├── assets/
│   ├── data/
│   │   ├── products.json  # Product catalog data
│   │   └── reviews.json   # Customer reviews
│   ├── images/            # Hero & OG images
│   └── icons/             # Favicon
└── public/
    ├── product-cards/     # Product images (WebP)
    └── sitemap.xml        # XML sitemap
```

## 🚀 Deployment

### GitHub Pages (Automatic)

The site automatically deploys to GitHub Pages when changes are pushed to the `main` branch via the GitHub Actions workflow.

**Live URL**: https://beautysupplymsk.github.io/s/

**Planned Domain**: https://beauty-supply.shop

### Manual Deployment

1. Push changes to `main` branch
2. GitHub Actions will automatically build and deploy
3. Check the Actions tab for deployment status

## 🛠 Development

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/BEAUTYSUPPLYMSK/s.git
   cd s
   ```

2. Open `index.html` in a browser or use a local server:
   ```bash
   npx serve .
   ```

3. View the site at `http://localhost:3000`

### Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Commit and push:
   ```bash
   git commit -m "Your commit message"
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request to `main`

## 📱 Key Pages

| Page | URL | Purpose |
|------|-----|---------|
| Homepage | `/index.html` | Hero, categories, bestsellers, reviews |
| Catalog | `/pages/catalog.html` | Full product catalog with filters |
| Product | `/pages/product.html?slug=...` | Dynamic product detail |
| Preorder | `/pages/preorder.html` | Special order request form |

## 🔗 Integrations

### Telegram Bot
- **Bot**: [@BEAUTYSUPPLYMSKBOT](https://t.me/BEAUTYSUPPLYMSKBOT)
- **Channel**: [@beautysupplymsk](https://t.me/beautysupplymsk)
- Used for order processing and customer communication

### Avito
- **Profile**: [beautysupplymsk](https://www.avito.ru/user/7d5cc17e554a6f4d901ec51bdd907f7b/profile)
- **Rating**: 5.0 (33+ verified reviews)
- Used for secure transactions and delivery

## 📊 Performance Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | 95+ |
| Lighthouse Accessibility | 95+ |
| LCP (Largest Contentful Paint) | <1.8s |
| CLS (Cumulative Layout Shift) | <0.05 |
| INP (Interaction to Next Paint) | <100ms |

## 🔒 Security

- No sensitive data stored in repository
- External links use `rel="noopener noreferrer"`
- Form data handled by Telegram Bot (no server storage)
- GitHub Pages provides SSL/HTTPS

## 📋 License

This project is for commercial use. All product names and trademarks belong to their respective owners (Image Skincare, Charlotte Tilbury, Hourglass).

## 👥 Contact

- **Telegram Bot**: [@BEAUTYSUPPLYMSKBOT](https://t.me/BEAUTYSUPPLYMSKBOT)
- **Email**: support@beauty-supply.shop

---

Made with ❤️ for the Russian beauty community | Since 2011
