/**
 * Beauty Supply — Reusable UI Components
 * Modular JavaScript templates for Navigation, Footer, Trust Bar, Product Cards, and Reviews.
 */

// Helper: Determine relative base path based on location or explicit override
function getBasePath() {
  const path = window.location.pathname;
  if (path.includes('/pages/legal/')) return '../../';
  if (path.includes('/pages/')) return '../';
  return './';
}

// Helper: Format currency in Russian standard
function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
}

/**
 * Render Header & Navigation
 * @param {string} currentPage - Unique identifier for active nav item
 */
function renderNav(currentPage = 'home') {
  const base = getBasePath();
  const navContainer = document.getElementById('site-header');
  if (!navContainer) return;

  const links = [
    { id: 'home', label: 'Главная', href: `${base}index.html` },
    { id: 'catalog', label: 'Каталог', href: `${base}pages/catalog.html` },
    { id: 'about', label: 'О бренде', href: `${base}pages/about.html` },
    { id: 'delivery', label: 'Доставка', href: `${base}pages/delivery.html` },
    { id: 'reviews', label: 'Отзывы', href: `${base}pages/reviews.html` },
    { id: 'preorder', label: 'Предзаказ', href: `${base}pages/preorder.html` },
    { id: 'contacts', label: 'Контакты', href: `${base}pages/contacts.html` }
  ];

  const linksHtml = links.map(link => `
    <a href="${link.href}" class="nav-link ${currentPage === link.id ? 'active' : ''}">${link.label}</a>
  `).join('');

  navContainer.innerHTML = `
    <div class="container header-inner">
      <a href="${base}index.html" class="brand-logo">
        BEAUTY<span class="logo-accent">SUPPLY</span>
      </a>
      
      <nav class="nav-links" id="primary-nav" aria-label="Основная навигация">
        ${linksHtml}
        <a href="https://t.me/BEAUTYSUPPLYMSKBOT" target="_blank" rel="noopener noreferrer" class="btn btn-accent btn-sm header-tg-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.25.38-.51 1.07-.78 4.18-1.82 6.97-3.02 8.37-3.61 3.98-1.66 4.81-1.95 5.35-1.96.12 0 .38.03.55.17.14.12.18.28.2.43-.02.07-.02.19-.04.33z"/>
          </svg>
          Telegram
        </a>
      </nav>

      <button class="mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Открыть меню" aria-expanded="false">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  `;

  // Toggle mobile menu logic
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('primary-nav');
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
    });
  }
}

/**
 * Render Trust Bar Component (6 Proof Badges)
 */
function renderTrustBar(targetId = 'trust-bar-container') {
  const container = document.getElementById(targetId);
  if (!container) return;

  container.innerHTML = `
    <div class="trust-bar">
      <div class="container trust-grid">
        <div class="trust-item">
          <span class="trust-icon">✨</span>
          <span>С 2011 года на рынке</span>
        </div>
        <div class="trust-item">
          <span class="trust-icon">⭐</span>
          <span>Avito 5.0 (33 отзыва)</span>
        </div>
        <div class="trust-item">
          <span class="trust-icon">🛡️</span>
          <span>Надёжный продавец</span>
        </div>
        <div class="trust-item">
          <span class="trust-icon">📦</span>
          <span>Доставка по всей РФ</span>
        </div>
        <div class="trust-item">
          <span class="trust-icon">🇺🇸</span>
          <span>100% Оригинал из США</span>
        </div>
        <div class="trust-item">
          <span class="trust-icon">💬</span>
          <span>120+ отзывов в сетях</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render Product Card
 * @param {Object} product
 * @returns {string} HTML string
 */
function renderProductCard(product) {
  const base = getBasePath();
  const imageSrc = product.image.replace('./', base);
  const detailUrl = `${base}pages/product.html?slug=${product.slug}`;

  return `
    <article class="product-card" data-category="${product.category}" data-brand="${product.brand}">
      <div class="product-card-image-wrap">
        <span class="badge product-card-badge">${product.origin}</span>
        <a href="${detailUrl}">
          <img 
            src="${imageSrc}" 
            alt="${product.brand} — ${product.name}" 
            class="product-card-image"
            loading="lazy"
            width="400"
            height="400"
          >
        </a>
      </div>
      <div class="product-card-body">
        <div class="product-card-brand">${product.brand} · ${product.volume || ''}</div>
        <h3 class="product-card-title">
          <a href="${detailUrl}">${product.name}</a>
        </h3>
        <p class="product-card-desc">${product.shortDescription}</p>
        <div class="product-card-footer">
          <div class="product-card-price">${formatPrice(product.price)}</div>
          <div class="flex" style="gap: 0.5rem;">
            <a href="${product.telegramLink}" target="_blank" rel="noopener noreferrer" class="btn btn-accent btn-sm" title="Заказать через Telegram Bot">
              Заказать
            </a>
            <a href="${detailUrl}" class="btn btn-outline btn-sm">
              Инфо
            </a>
          </div>
        </div>
      </div>
    </article>
  `;
}

/**
 * Render Testimonial / Review Card
 * @param {Object} review
 * @returns {string} HTML string
 */
function renderReviewCard(review) {
  const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
  return `
    <div class="review-card" style="background: var(--color-surface); padding: var(--space-6); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div class="flex" style="justify-content: space-between; align-items: center; margin-bottom: var(--space-3);">
          <strong style="font-size: var(--text-base); color: var(--color-primary);">${review.author}</strong>
          <span style="color: #E6B800; font-size: 1.1rem;">${stars}</span>
        </div>
        <div style="font-size: var(--text-xs); color: var(--color-accent-dark); margin-bottom: var(--space-3); font-weight: 600;">
          Источник: ${review.source} ${review.verifiedPurchase ? '• Подтвержденная покупка' : ''}
        </div>
        <p style="font-size: var(--text-sm); color: var(--color-secondary); line-height: 1.6; font-style: italic;">
          «${review.text}»
        </p>
      </div>
      <div style="margin-top: var(--space-4); font-size: var(--text-xs); color: var(--color-muted); border-top: 1px solid var(--color-border); padding-top: var(--space-2);">
        Товар: ${review.product || 'Премиальная косметика США'}
      </div>
    </div>
  `;
}

/**
 * Render Site Footer
 */
function renderFooter() {
  const base = getBasePath();
  const footerContainer = document.getElementById('site-footer');
  if (!footerContainer) return;

  footerContainer.innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="${base}index.html" class="brand-logo" style="color: #FFFFFF;">
              BEAUTY<span class="logo-accent">SUPPLY</span>
            </a>
            <p>Премиальная косметика из США с доставкой по Москве и всей России. Делаем для вас недоступное — доступным с 2011 года.</p>
            <div style="margin-top: var(--space-4); font-size: var(--text-xs); color: var(--color-accent);">
              ⭐ Avito 5.0 (33 отзыва) · Надёжный продавец
            </div>
          </div>

          <div>
            <h4 class="footer-col-title">Каталог</h4>
            <div class="footer-links">
              <a href="${base}pages/catalog.html?category=face-care">Уход за лицом</a>
              <a href="${base}pages/catalog.html?category=body-care">Уход за телом</a>
              <a href="${base}pages/catalog.html?category=spf">Солнцезащита SPF</a>
              <a href="${base}pages/catalog.html?category=makeup">Декоративная косметика</a>
              <a href="${base}pages/preorder.html">Индивидуальный предзаказ</a>
            </div>
          </div>

          <div>
            <h4 class="footer-col-title">Информация</h4>
            <div class="footer-links">
              <a href="${base}pages/about.html">О компании</a>
              <a href="${base}pages/delivery.html">Оплата и доставка</a>
              <a href="${base}pages/reviews.html">Отзывы клиентов</a>
              <a href="${base}pages/contacts.html">Контакты</a>
              <a href="${base}pages/legal/privacy.html">Политика конфиденциальности</a>
              <a href="${base}pages/legal/offer.html">Публичная оферта</a>
            </div>
          </div>

          <div>
            <h4 class="footer-col-title">Связь с нами</h4>
            <div class="footer-links">
              <a href="https://t.me/BEAUTYSUPPLYMSKBOT" target="_blank" rel="noopener noreferrer">🤖 Telegram Bot</a>
              <a href="https://t.me/beautysupplymsk" target="_blank" rel="noopener noreferrer">📢 Telegram Канал</a>
              <a href="https://www.avito.ru/user/7d5cc17e554a6f4d901ec51bdd907f7b/profile" target="_blank" rel="noopener noreferrer">⭐ Профиль на Авито</a>
              <a href="https://instagram.com/beautysupplymsk" target="_blank" rel="noopener noreferrer">📷 Instagram</a>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <div>© 2011–2026 Beauty Supply. Все права защищены. Не является публичной офертой.</div>
          <div>Разработано для beauty-supply.shop</div>
        </div>
      </div>
    </footer>
  `;
}
