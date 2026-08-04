/**
 * Beauty Supply — Reusable UI Components v3.0
 * Premium Light Beauty Aesthetic with Enhanced Accessibility
 */

// Helper: Determine relative base path based on location
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
    <a href="${link.href}" class="nav-link ${currentPage === link.id ? 'active' : ''}" aria-current="${currentPage === link.id ? 'page' : 'false'}">${link.label}</a>
  `).join('');

  navContainer.innerHTML = `
    <div class="container header-inner">
      <a href="${base}index.html" class="brand-logo" aria-label="Beauty Supply — Главная">
        BEAUTY<span class="logo-accent">SUPPLY</span>
      </a>
      
      <nav class="nav-links" id="primary-nav" aria-label="Основная навигация">
        ${linksHtml}
        <a href="https://t.me/BEAUTYSUPPLYMSKBOT" target="_blank" rel="noopener noreferrer" class="btn btn-accent btn-sm header-tg-btn" aria-label="Заказать через Telegram">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.25.38-.51 1.07-.78 4.18-1.82 6.97-3.02 8.37-3.61 3.98-1.66 4.81-1.95 5.35-1.96.12 0 .38.03.55.17.14.12.18.28.2.43-.02.07-.02.19-.04.33z"/>
          </svg>
          Telegram
        </a>
      </nav>

      <button class="mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Открыть меню" aria-expanded="false" aria-controls="primary-nav">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  `;

  // Toggle mobile menu logic with improved accessibility
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('primary-nav');
  
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      toggleBtn.classList.toggle('is-active', isOpen);
      toggleBtn.setAttribute('aria-expanded', isOpen);
      
      // Trap focus in mobile menu when open
      if (isOpen) {
        const firstLink = navLinks.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    });

    // Close menu on escape key
    toggleBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
        toggleBtn.click();
        toggleBtn.focus();
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !toggleBtn.contains(e.target) && navLinks.classList.contains('is-open')) {
        toggleBtn.click();
      }
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
    <div class="trust-bar" role="complementary" aria-label="Преимущества магазина">
      <div class="container trust-grid">
        <div class="trust-item">
          <span class="trust-icon" aria-hidden="true">✨</span>
          <span>С 2011 года</span>
        </div>
        <div class="trust-item">
          <span class="trust-icon" aria-hidden="true">⭐</span>
          <span>Avito 5.0 (33 отзыва)</span>
        </div>
        <div class="trust-item">
          <span class="trust-icon" aria-hidden="true">🛡️</span>
          <span>Гарантия подлинности</span>
        </div>
        <div class="trust-item">
          <span class="trust-icon" aria-hidden="true">📦</span>
          <span>Доставка по всей РФ</span>
        </div>
        <div class="trust-item">
          <span class="trust-icon" aria-hidden="true">🇺🇸</span>
          <span>100% Оригинал из США</span>
        </div>
        <div class="trust-item">
          <span class="trust-icon" aria-hidden="true">💬</span>
          <span>Персональный менеджер</span>
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

  const originBadge = product.origin === 'USA' ? '<span class="badge">🇺🇸 США</span>' : '';
  const bestBadge = product.isBestseller ? '<span class="badge badge-accent">Хит продаж</span>' : '';
  const stockBadge = product.inStock ? '<span class="badge badge-success">✓ В наличии</span>' : '';

  return `
    <article class="product-card" data-category="${product.category}" data-brand="${product.brand}">
      <div class="product-card-image-wrap">
        <div class="product-card-badges">
          ${originBadge}
          ${bestBadge}
          ${stockBadge}
        </div>
        <a href="${detailUrl}" aria-label="Смотреть ${product.brand} ${product.name}">
          <img 
            src="${imageSrc}" 
            alt="${product.brand} — ${product.name}" 
            class="product-card-image"
            loading="lazy"
            decoding="async"
            width="400"
            height="400"
          >
        </a>
      </div>
      <div class="product-card-body">
        <div class="product-card-brand">${product.brand}${product.volume ? ' · ' + product.volume : ''}</div>
        <h3 class="product-card-title">
          <a href="${detailUrl}">${product.name}</a>
        </h3>
        <p class="product-card-desc">${product.shortDescription}</p>
        <div class="product-card-footer">
          <div>
            <div class="product-card-price">${formatPrice(product.price)}</div>
            <div style="font-size: var(--text-xs); color: var(--color-success); font-weight: 500;">Доставка по РФ</div>
          </div>
          <div class="product-card-actions">
            <a href="${product.telegramLink}" target="_blank" rel="noopener noreferrer" class="btn btn-accent btn-sm" title="Заказать через Telegram Bot" aria-label="Заказать ${product.name} через Telegram">
              💬 Заказать
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
  const verifiedBadge = review.verifiedPurchase ? '<span class="badge badge-success" style="margin-left: 0.5rem;">✓ Проверено</span>' : '';
  
  return `
    <article class="review-card" aria-label="Отзыв клиента ${review.author}">
      <div>
        <div class="review-header">
          <strong class="review-author">${review.author}</strong>
          <span class="review-stars" aria-label="${review.rating} из 5 звёзд">${stars}</span>
        </div>
        <div class="review-source">
          Источник: ${review.source}${verifiedBadge}
        </div>
        <blockquote class="review-text">
          «${review.text}»
        </blockquote>
      </div>
      ${review.product ? `<div class="review-product">Товар: ${review.product}</div>` : ''}
    </article>
  `;
}

/**
 * Render Site Footer v3.0 - Light Elegant
 */
function renderFooter() {
  const base = getBasePath();
  const footerContainer = document.getElementById('site-footer');
  if (!footerContainer) return;

  footerContainer.innerHTML = `
    <footer class="site-footer" role="contentinfo">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="${base}index.html" class="brand-logo" aria-label="Beauty Supply — Главная">
              BEAUTY<span class="logo-accent">SUPPLY</span>
            </a>
            <p>Премиальная косметика из США с доставкой по Москве и всей России. Делаем для вас недоступное — доступным с 2011 года.</p>
            <div style="margin-top: var(--space-4); font-size: var(--text-xs); color: var(--color-accent-dark);">
              ⭐ Avito 5.0 (33 отзыва) · Надёжный продавец
            </div>
          </div>

          <div>
            <h4 class="footer-col-title">Каталог</h4>
            <nav class="footer-links" aria-label="Каталог">
              <a href="${base}pages/catalog.html?category=face-care">Уход за лицом</a>
              <a href="${base}pages/catalog.html?category=body-care">Уход за телом</a>
              <a href="${base}pages/catalog.html?category=spf">Солнцезащита SPF</a>
              <a href="${base}pages/catalog.html?category=makeup">Декоративная косметика</a>
              <a href="${base}pages/preorder.html">Индивидуальный предзаказ</a>
            </nav>
          </div>

          <div>
            <h4 class="footer-col-title">Информация</h4>
            <nav class="footer-links" aria-label="Информация">
              <a href="${base}pages/about.html">О компании</a>
              <a href="${base}pages/delivery.html">Оплата и доставка</a>
              <a href="${base}pages/reviews.html">Отзывы клиентов</a>
              <a href="${base}pages/contacts.html">Контакты</a>
              <a href="${base}pages/legal/privacy.html">Политика конфифиденциальности</a>
              <a href="${base}pages/legal/offer.html">Публичная оферта</a>
            </nav>
          </div>

          <div>
            <h4 class="footer-col-title">Связь с нами</h4>
            <nav class="footer-links" aria-label="Каналы связи">
              <a href="https://t.me/BEAUTYSUPPLYMSKBOT" target="_blank" rel="noopener noreferrer">🤖 Telegram Бот</a>
              <a href="https://t.me/beautysupplymsk" target="_blank" rel="noopener noreferrer">📢 Telegram Канал</a>
              <a href="https://www.avito.ru/user/7d5cc17e554a6f4d901ec51bdd907f7b/profile" target="_blank" rel="noopener noreferrer">⭐ Профиль на Авито</a>
              <a href="https://instagram.com/beautysupplymsk" target="_blank" rel="noopener noreferrer">📷 Instagram</a>
            </nav>
          </div>
        </div>

        <div class="footer-bottom">
          <div>© 2011–2026 Beauty Supply. Все права защищены. Не является публичной офертой.</div>
          <div>beauty-supply.shop</div>
        </div>
      </div>
    </footer>
  `;
}

// Utility: Extract URL Query Parameters
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}
