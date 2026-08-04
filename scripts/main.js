/**
 * Beauty Supply — Main JavaScript v3.0
 * Enhanced Catalog filtering, Product Detail, and URL query handling
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
  
  // Show loading state
  container.innerHTML = `
    <div class="loading">
      <div class="skeleton" style="height: 380px; margin-bottom: 1rem;"></div>
      <div class="skeleton" style="height: 380px; margin-bottom: 1rem;"></div>
      <div class="skeleton" style="height: 380px;"></div>
    </div>
  `;

  fetch(`${base}assets/data/products.json`)
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then(products => {
      allProducts = products;
      applyFilters();
    })
    .catch(err => {
      console.error('Error fetching products:', err);
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📦</div>
          <h3>Не удалось загрузить каталог</h3>
          <p class="text-muted">Проверьте подключение к интернету или попробуйте позже.</p>
          <a href="https://t.me/BEAUTYSUPPLYMSKBOT" target="_blank" rel="noopener noreferrer" class="btn btn-accent btn-sm" style="margin-top: 1rem;">Связаться с нами в Telegram</a>
        </div>
      `;
      if (countElement) countElement.textContent = '';
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
      countElement.textContent = `Найдено: ${filtered.length} ${getProductWord(filtered.length)}`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <h3>Товары не найдены</h3>
          <p class="text-muted">Попробуйте изменить параметры фильтра или поисковый запрос.</p>
          <button id="reset-filters-btn" class="btn btn-outline btn-sm" style="margin-top: 1rem;">Сбросить фильтры</button>
        </div>
      `;
      const resetBtn = document.getElementById('reset-filters-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (filterBrand) filterBrand.value = '';
          if (filterCategory) filterCategory.value = '';
          if (filterGoal) filterGoal.value = '';
          if (searchInput) searchInput.value = '';
          // Clear URL params
          const url = new URL(window.location);
          url.searchParams.delete('brand');
          url.searchParams.delete('category');
          url.searchParams.delete('goal');
          window.history.replaceState({}, '', url);
          applyFilters();
        });
      }
    } else {
      container.innerHTML = filtered.map(p => renderProductCard(p)).join('');
      
      // Update URL with filter params
      const url = new URL(window.location);
      if (brandVal) url.searchParams.set('brand', brandVal);
      else url.searchParams.delete('brand');
      if (catVal) url.searchParams.set('category', catVal);
      else url.searchParams.delete('category');
      if (goalVal) url.searchParams.set('goal', goalVal);
      else url.searchParams.delete('goal');
      window.history.replaceState({}, '', url);
    }
  }

  // Helper for Russian plural
  function getProductWord(count) {
    const lastTwo = count % 100;
    const lastOne = count % 10;
    if (lastTwo >= 11 && lastTwo <= 14) return 'товаров';
    if (lastOne === 1) return 'товар';
    if (lastOne >= 2 && lastOne <= 4) return 'товара';
    return 'товаров';
  }

  // Debounce search input
  let searchTimeout;
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(applyFilters, 300);
    });
  }

  // Listeners for dropdowns
  if (filterBrand) filterBrand.addEventListener('change', applyFilters);
  if (filterCategory) filterCategory.addEventListener('change', applyFilters);
  if (filterGoal) filterGoal.addEventListener('change', applyFilters);
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
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then(products => {
      const product = products.find(p => p.slug === slug);
      if (!product) {
        detailContainer.innerHTML = `
          <div class="text-center empty-state" style="padding: var(--space-16) 0;">
            <div class="empty-state-icon">📦</div>
            <h2>Товар не найден</h2>
            <p class="text-muted">Запрошенный товар не существует или снят с продажи.</p>
            <a href="${base}pages/catalog.html" class="btn btn-primary" style="margin-top: var(--space-4);">Вернуться в каталог</a>
          </div>
        `;
        return;
      }

      // Update Page Title
      document.title = `${product.brand} ${product.name} — Купить в Beauty Supply`;
      
      // Update Canonical URL
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.href = `https://beautysupplymsk.github.io/s/pages/product.html?slug=${product.slug}`;

      // Update Meta Description & Open Graph tags dynamically
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.content = `${product.brand} ${product.name} (${product.volume || ''}) — 100% оригинал из США. ${product.shortDescription} В наличии в Москве с быстрой доставкой.`;

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.content = `${product.brand} ${product.name} — Beauty Supply`;

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.content = `${product.shortDescription} 100% оригинальная косметика из США.`;

      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.content = `https://beautysupplymsk.github.io/s/pages/product.html?slug=${product.slug}`;

      const ogImg = document.querySelector('meta[property="og:image"]');
      if (ogImg) ogImg.content = `https://beautysupplymsk.github.io/s/${product.image.replace('./', '')}`;

      const twTitle = document.querySelector('meta[name="twitter:title"]');
      if (twTitle) twTitle.content = `${product.brand} ${product.name} — Beauty Supply`;

      const twDesc = document.querySelector('meta[name="twitter:description"]');
      if (twDesc) twDesc.content = `${product.shortDescription}`;

      const twImg = document.querySelector('meta[name="twitter:image"]');
      if (twImg) twImg.content = `https://beautysupplymsk.github.io/s/${product.image.replace('./', '')}`;

      // Dynamically inject Product Schema (JSON-LD)
      const schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": `${product.brand} ${product.name}`,
        "image": `https://beautysupplymsk.github.io/s/${product.image.replace('./', '')}`,
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
          "url": `https://beautysupplymsk.github.io/s/pages/product.html?slug=${product.slug}`
        }
      });
      document.head.appendChild(schemaScript);

      // Render Product Detail Content
      const imageSrc = product.image.replace('./', base);
      const catName = CATEGORY_NAMES[product.category] || product.category;

      detailContainer.innerHTML = `
        <!-- Breadcrumbs -->
        <nav aria-label="Хлебные крошки" style="margin-bottom: var(--space-6); font-size: var(--text-sm); color: var(--color-muted);">
          <a href="${base}index.html" style="color: var(--color-accent-dark);">Главная</a> 
          <span aria-hidden="true"> › </span>
          <a href="${base}pages/catalog.html" style="color: var(--color-accent-dark);">Каталог</a> 
          <span aria-hidden="true"> › </span>
          <a href="${base}pages/catalog.html?category=${product.category}" style="color: var(--color-accent-dark);">${catName}</a> 
          <span aria-hidden="true"> › </span>
          <span style="color: var(--color-primary); font-weight: 600;">${product.name}</span>
        </nav>

        <div class="product-detail-grid">
          <!-- Product Media Column -->
          <div class="product-gallery">
            <img 
              id="main-product-image"
              src="${imageSrc}" 
              alt="${product.brand} — ${product.name} (Оригинал США)" 
              width="600"
              height="600"
              loading="eager"
              decoding="async"
            >
            ${(product.gallery && product.gallery.length > 1) ? `
            <div class="product-gallery-thumbs" style="display: flex; justify-content: center; gap: 0.5rem; margin-top: var(--space-4); flex-wrap: wrap;" role="list" aria-label="Галерея товара">
              ${product.gallery.map((gImg, idx) => {
                const thSrc = gImg.replace('./', base);
                return `<button type="button" class="gallery-thumb-btn" style="border: 2px solid ${idx === 0 ? 'var(--color-accent)' : 'transparent'}; border-radius: var(--radius-sm); padding: 2px; background: none; cursor: pointer; transition: all 0.2s;" onclick="const mImg=document.getElementById('main-product-image'); if(mImg){mImg.src='${thSrc}';} document.querySelectorAll('.gallery-thumb-btn').forEach(b => b.style.borderColor='transparent'); this.style.borderColor='var(--color-accent)';" aria-label="Показать ракурс ${idx + 1}" role="listitem">
                  <img src="${thSrc}" alt="" style="width: 56px; height: 56px; object-fit: cover; border-radius: 4px;" loading="lazy" decoding="async">
                </button>`;
              }).join('')}
            </div>` : ''}
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
            
            <div style="font-size: var(--text-2xl); font-weight: 700; color: var(--color-primary); margin-bottom: var(--space-6); display: flex; align-items: center; gap: var(--space-4); flex-wrap: wrap;">
              <span>${formatPrice(product.price)}</span>
              <span class="badge badge-success" style="font-size: var(--text-xs);">
                ✓ В наличии в Москве
              </span>
            </div>

            <p style="font-size: var(--text-base); color: var(--color-secondary); margin-bottom: var(--space-6); line-height: 1.7;">
              ${product.shortDescription}
            </p>

            <div class="product-specs">
              <h4>Характеристики</h4>
              <table class="table" role="table">
                <tr><td style="color: var(--color-muted);">Бренд</td><td style="font-weight: 600;">${product.brand}</td></tr>
                <tr><td style="color: var(--color-muted);">Категория</td><td style="font-weight: 600;">${catName}</td></tr>
                <tr><td style="color: var(--color-muted);">Объем / Вес</td><td style="font-weight: 600;">${product.volume || 'Стандарт'}</td></tr>
                <tr><td style="color: var(--color-muted);">Страна</td><td style="font-weight: 600;">США 🇺🇸</td></tr>
              </table>
            </div>

            <!-- Action CTAs -->
            <div style="display: flex; flex-direction: column; gap: var(--space-3); margin-top: var(--space-8);">
              <a href="${product.telegramLink}" target="_blank" rel="noopener noreferrer" class="btn btn-accent btn-lg" style="width: 100%;">
                💬 Заказать через Telegram Bot
              </a>
              <a href="${base}pages/preorder.html?product=${encodeURIComponent(product.name)}" class="btn btn-outline" style="width: 100%;">
                Запросить спец-заказ / индивидуальный объем
              </a>
            </div>

            <div style="margin-top: var(--space-6); font-size: var(--text-xs); color: var(--color-muted); display: flex; gap: var(--space-4); flex-wrap: wrap; align-items: center;">
              <span>🛡️ Гарантия подлинности</span>
              <span>📦 Доставка по всей РФ</span>
              <span>⭐ Avito 5.0</span>
            </div>
          </div>
        </div>

        <!-- Full Description -->
        <section style="margin-top: var(--space-16); background: var(--color-surface); padding: var(--space-8); border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
          <h2 style="font-size: var(--text-2xl); margin-bottom: var(--space-4);">Подробное описание и применение</h2>
          <p style="font-size: var(--text-base); color: var(--color-secondary); line-height: 1.8;">
            ${product.fullDescription}
          </p>
          <div style="margin-top: var(--space-6); padding: var(--space-4); background: var(--color-accent-subtle); border-left: 3px solid var(--color-accent); font-size: var(--text-sm); color: var(--color-secondary); border-radius: 0 var(--radius-sm) var(--radius-sm) 0;">
            <strong>Обратите внимание:</strong> Все поставляемые продукты закупаются исключительно в официальных бутиках и у авторизованных дистрибьюторов в США. По запросу предоставляются дополнительные фото батч-кодов и упаковки.
          </div>
        </section>

        <!-- FAQ / Trust Objections -->
        <section style="margin-top: var(--space-12); background: var(--color-surface); padding: var(--space-8); border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
          <h2 style="font-size: var(--text-xl); margin-bottom: var(--space-6);">Часто задаваемые вопросы</h2>
          <div class="faq-item">
            <h3 class="faq-question">🛡️ Как проверить оригинальность косметики?</h3>
            <p class="faq-answer">Мы закупаем продукцию только у официальных дистрибьюторов в США. Вы можете проверить подлинность по батч-коду на упаковке при получении заказа.</p>
          </div>
          <div class="faq-item">
            <h3 class="faq-question">📦 Какие сроки и стоимость доставки?</h3>
            <p class="faq-answer">По Москве доступна курьерская доставка в день заказа или на следующий день. По России отправляем через СДЭК или Авито Доставку (от 2 до 5 дней).</p>
          </div>
          <div class="faq-item" style="margin-bottom: 0; padding-bottom: 0; border-bottom: none;">
            <h3 class="faq-question">💬 Как оформить заказ?</h3>
            <p class="faq-answer">Нажмите кнопку «Заказать через Telegram Bot» — наш официальный бот поможет выбрать способ доставки и подтвердит наличие за 1 минуту.</p>
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
      detailContainer.innerHTML = `
        <div class="text-center empty-state" style="padding: var(--space-16) 0;">
          <div class="empty-state-icon">⚠️</div>
          <h2>Произошла ошибка</h2>
          <p class="text-muted">Не удалось загрузить информацию о товаре. Попробуйте обновить страницу.</p>
        </div>
      `;
    });
}
