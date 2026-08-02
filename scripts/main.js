/**
 * Beauty Supply — Main JavaScript
 * Logic for Catalog filtering, Product Detail hydrating, and URL query handling.
 */

// Utility: Extract URL Query Parameters
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Category Mapping Helper (RU translation)
const CATEGORY_NAMES = {
  'face-care': 'Уход за лицом',
  'body-care': 'Уход за телом',
  'spf': 'Солнцезащита SPF',
  'makeup': 'Декоративная косметика'
};

const GOAL_NAMES = {
  'anti-age': 'Омоложение & Anti-age',
  'lifting': 'Лифтинг & Плотность',
  'spf': 'Защита от солнца (SPF)',
  'glow': 'Сияние & Тон',
  'hydration': 'Увлажнение',
  'body': 'Тонус тела',
  'renewal': 'Обновление кожи'
};

/**
 * Initialize Catalog Page Filter & Render
 */
function initCatalogPage() {
  const container = document.getElementById('catalog-products-grid');
  const countElement = document.getElementById('catalog-count');
  if (!container) return;

  const filterBrand = document.getElementById('filter-brand');
  const filterCategory = document.getElementById('filter-category');
  const filterGoal = document.getElementById('filter-goal');
  const searchInput = document.getElementById('filter-search');

  // Pre-fill filters from URL params if present
  const initialCategory = getQueryParam('category');
  const initialBrand = getQueryParam('brand');

  if (initialCategory && filterCategory) filterCategory.value = initialCategory;
  if (initialBrand && filterBrand) filterBrand.value = initialBrand;

  let allProducts = [];

  const base = getBasePath();
  fetch(`${base}assets/data/products.json`)
    .then(res => res.json())
    .then(products => {
      allProducts = products;
      applyFilters();
    })
    .catch(err => {
      console.error('Error fetching products:', err);
      container.innerHTML = '<p class="text-center" style="grid-column: 1/-1;">Ошибка загрузки каталога. Пожалуйста, обновите страницу.</p>';
    });

  function applyFilters() {
    const brandVal = filterBrand ? filterBrand.value : '';
    const catVal = filterCategory ? filterCategory.value : '';
    const goalVal = filterGoal ? filterGoal.value : '';
    const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const filtered = allProducts.filter(p => {
      const matchBrand = !brandVal || p.brand === brandVal;
      const matchCategory = !catVal || p.category === catVal;
      const matchGoal = !goalVal || (p.goals && p.goals.includes(goalVal));
      const matchSearch = !searchVal || 
        p.name.toLowerCase().includes(searchVal) || 
        p.brand.toLowerCase().includes(searchVal) || 
        p.shortDescription.toLowerCase().includes(searchVal);

      return matchBrand && matchCategory && matchGoal && matchSearch;
    });

    if (countElement) {
      countElement.textContent = `Найдено товаров: ${filtered.length}`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: var(--space-12) 0;">
          <div style="font-size: 3rem; margin-bottom: var(--space-4);">🔍</div>
          <h3>Товары не найдены</h3>
          <p style="color: var(--color-muted);">Попробуйте изменить параметры фильтра или поисковый запрос.</p>
          <button id="reset-filters-btn" class="btn btn-outline btn-sm" style="margin-top: var(--space-4);">Сбросить фильтры</button>
        </div>
      `;
      const resetBtn = document.getElementById('reset-filters-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (filterBrand) filterBrand.value = '';
          if (filterCategory) filterCategory.value = '';
          if (filterGoal) filterGoal.value = '';
          if (searchInput) searchInput.value = '';
          applyFilters();
        });
      }
    } else {
      container.innerHTML = filtered.map(p => renderProductCard(p)).join('');
    }
  }

  // Listeners
  if (filterBrand) filterBrand.addEventListener('change', applyFilters);
  if (filterCategory) filterCategory.addEventListener('change', applyFilters);
  if (filterGoal) filterGoal.addEventListener('change', applyFilters);
  if (searchInput) searchInput.addEventListener('input', applyFilters);
}

/**
 * Initialize Product Detail Page
 */
function initProductDetailPage() {
  const slug = getQueryParam('slug');
  const base = getBasePath();
  const detailContainer = document.getElementById('product-detail-container');

  if (!detailContainer) return;

  if (!slug) {
    window.location.href = `${base}pages/catalog.html`;
    return;
  }

  fetch(`${base}assets/data/products.json`)
    .then(res => res.json())
    .then(products => {
      const product = products.find(p => p.slug === slug);
      if (!product) {
        detailContainer.innerHTML = `
          <div class="text-center" style="padding: var(--space-16) 0;">
            <h2>Товар не найден</h2>
            <p>Запрошенный товар не существует или снят с продажи.</p>
            <a href="${base}pages/catalog.html" class="btn btn-primary" style="margin-top: var(--space-4);">Вернуться в каталог</a>
          </div>
        `;
        return;
      }

      // Update Page Title
      document.title = `${product.brand} ${product.name} — Купить в Beauty Supply`;
      
      // Update Canonical URL
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.href = `https://beautysupplymsk.github.io/1/pages/product.html?slug=${product.slug}`;

      // Dynamically inject Product Schema (JSON-LD)
      const schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": `${product.brand} ${product.name}`,
        "image": `https://beautysupplymsk.github.io/1/${product.image.replace('./', '')}`,
        "description": product.shortDescription,
        "brand": {
          "@type": "Brand",
          "name": product.brand
        },
        "offers": {
          "@type": "Offer",
          "priceCurrency": product.currency,
          "price": product.price,
          "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
          "url": `https://beautysupplymsk.github.io/1/pages/product.html?slug=${product.slug}`
        }
      });
      document.head.appendChild(schemaScript);

      // Render Product Detail Content
      const imageSrc = product.image.replace('./', base);
      const catName = CATEGORY_NAMES[product.category] || product.category;

      detailContainer.innerHTML = `
        <!-- Breadcrumbs -->
        <nav aria-label="Хлебные крошки" style="margin-bottom: var(--space-6); font-size: var(--text-xs); color: var(--color-muted);">
          <a href="${base}index.html">Главная</a> &gt; 
          <a href="${base}pages/catalog.html">Каталог</a> &gt; 
          <a href="${base}pages/catalog.html?category=${product.category}">${catName}</a> &gt; 
          <span style="color: var(--color-primary); font-weight: 600;">${product.name}</span>
        </nav>

        <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--space-10); align-items: start;">
          <!-- Product Media Column -->
          <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-6); text-align: center;">
            <img 
              src="${imageSrc}" 
              alt="${product.brand} — ${product.name}" 
              style="width: 100%; max-width: 500px; height: auto; border-radius: var(--radius-sm); margin: 0 auto;"
              width="800"
              height="800"
            >
            <div class="flex flex-center" style="margin-top: var(--space-4); gap: var(--space-2);">
              <span class="badge">🇺🇸 Поставка из США</span>
              <span class="badge badge-dark">100% Оригинал</span>
            </div>
          </div>

          <!-- Product Summary Column -->
          <div>
            <div style="font-size: var(--text-sm); font-weight: 700; color: var(--color-accent-dark); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: var(--space-2);">
              ${product.brand} ${product.line ? '· ' + product.line : ''}
            </div>
            <h1 style="font-size: var(--text-3xl); margin-bottom: var(--space-4); line-height: 1.2;">
              ${product.name}
            </h1>
            
            <div style="font-size: var(--text-2xl); font-weight: 700; color: var(--color-primary); margin-bottom: var(--space-6); display: flex; align-items: center; gap: var(--space-4);">
              <span>${formatPrice(product.price)}</span>
              <span style="font-size: var(--text-xs); background: #E8F5E9; color: var(--color-success); padding: 0.25rem 0.75rem; border-radius: var(--radius-full); font-weight: 600;">
                ✓ В наличии в Москве
              </span>
            </div>

            <p style="font-size: var(--text-base); color: var(--color-secondary); margin-bottom: var(--space-6); line-height: 1.6;">
              ${product.shortDescription}
            </p>

            <div style="background: var(--color-surface-elevated); padding: var(--space-6); border-radius: var(--radius-md); border: 1px solid var(--color-border); margin-bottom: var(--space-8);">
              <h4 style="font-size: var(--text-sm); text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-muted); margin-bottom: var(--space-3);">Характеристики</h4>
              <table style="width: 100%; font-size: var(--text-sm); border-collapse: collapse;">
                <tr style="border-bottom: 1px solid var(--color-border);"><td style="padding: 0.5rem 0; color: var(--color-muted);">Бренд</td><td style="font-weight: 600; text-align: right;">${product.brand}</td></tr>
                <tr style="border-bottom: 1px solid var(--color-border);"><td style="padding: 0.5rem 0; color: var(--color-muted);">Категория</td><td style="font-weight: 600; text-align: right;">${catName}</td></tr>
                <tr style="border-bottom: 1px solid var(--color-border);"><td style="padding: 0.5rem 0; color: var(--color-muted);">Объем / Вес</td><td style="font-weight: 600; text-align: right;">${product.volume || 'Стандарт'}</td></tr>
                <tr><td style="padding: 0.5rem 0; color: var(--color-muted);">Страна производства</td><td style="font-weight: 600; text-align: right;">США (USA) 🇺🇸</td></tr>
              </table>
            </div>

            <!-- Action CTAs -->
            <div style="display: flex; flex-direction: column; gap: var(--space-3);">
              <a href="${product.telegramLink}" target="_blank" rel="noopener noreferrer" class="btn btn-accent btn-lg" style="width: 100%;">
                💬 Заказать через Telegram Bot
              </a>
              <a href="${base}pages/preorder.html?product=${encodeURIComponent(product.name)}" class="btn btn-outline" style="width: 100%;">
                Запросить спец-заказ / индивидуальный объем
              </a>
            </div>

            <div style="margin-top: var(--space-6); font-size: var(--text-xs); color: var(--color-muted); display: flex; gap: var(--space-4); align-items: center;">
              <span>🛡️ Гарантия подлинности</span>
              <span>📦 Доставка по всей РФ</span>
              <span>⭐ Avito 5.0</span>
            </div>
          </div>
        </div>

        <!-- Full Description Tab Section -->
        <section style="margin-top: var(--space-16); background: var(--color-surface); padding: var(--space-8); border-radius: var(--radius-md); border: 1px solid var(--color-border);">
          <h2 style="font-size: var(--text-2xl); margin-bottom: var(--space-4);">Подробное описание и применение</h2>
          <p style="font-size: var(--text-base); color: var(--color-secondary); line-height: 1.8;">
            ${product.fullDescription}
          </p>
          <div style="margin-top: var(--space-6); padding: var(--space-4); background: var(--color-accent-subtle); border-left: 3px solid var(--color-accent); font-size: var(--text-xs); color: var(--color-secondary);">
            <strong>Обратите внимание:</strong> Все поставляемые продукты закупаются исключительно в официальных бутиках и у авторизованных дистрибьюторов в США. По запросу предоставляются дополнительные фото батч-кодов и упаковки.
          </div>
        </section>

        <!-- Related Products Section -->
        <section style="margin-top: var(--space-16);">
          <h2 style="font-size: var(--text-2xl); margin-bottom: var(--space-6);">Рекомендуемые товары</h2>
          <div id="related-products-grid" class="grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));">
            <!-- Populated via JS -->
          </div>
        </section>
      `;

      // Render Related Products (same brand or category excluding current)
      const related = products
        .filter(p => p.slug !== product.slug && (p.brand === product.brand || p.category === product.category))
        .slice(0, 3);
      
      const relatedGrid = document.getElementById('related-products-grid');
      if (relatedGrid) {
        relatedGrid.innerHTML = related.map(p => renderProductCard(p)).join('');
      }
    })
    .catch(err => {
      console.error('Error loading product details:', err);
      detailContainer.innerHTML = '<p>Произошла ошибка при загрузке товара.</p>';
    });
}
