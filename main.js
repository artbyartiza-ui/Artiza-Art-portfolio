// ==========================================================================
// ARTIZA ART — SITE SCRIPT
// Scroll reveal · smooth nav · portfolio rendering/filtering · FAQ accordion
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initScrollReveal();
  initActiveNav();
  initFAQ();
  loadPortfolio();
});

/* ---------------- mobile nav ---------------- */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    toggle.textContent = nav.classList.contains('open') ? '✕' : '☰';
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.textContent = '☰';
  }));
}

/* ---------------- scroll reveal ---------------- */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-stagger, .swash-heading');
  if (!('IntersectionObserver' in window)) {
    targets.forEach(t => t.classList.add('in-view'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(t => observer.observe(t));
}

/* ---------------- active nav highlight on scroll ---------------- */
function initActiveNav() {
  const links = document.querySelectorAll('nav.main-nav a[href^="#"]');
  const sections = Array.from(links).map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
  if (!sections.length) return;

  const setActive = (id) => {
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(s => observer.observe(s));
}

/* ---------------- FAQ accordion ---------------- */
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(open => {
        open.classList.remove('open');
        open.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });
}

/* ---------------- portfolio: load + render + filter ---------------- */
let allProjects = [];

async function loadPortfolio() {
  const grid = document.getElementById('portfolio-grid');
  const tabsWrap = document.getElementById('filter-tabs');
  if (!grid) return;

  try {
    const res = await fetch('data/projects.json');
    const data = await res.json();
    allProjects = data.projects || [];

    // build filter tabs
    const cats = ['All', ...(data.categories || [])];
    tabsWrap.innerHTML = cats.map((c, i) =>
      `<button class="filter-tab${i === 0 ? ' active' : ''}" data-cat="${c}">${c}</button>`
    ).join('');

    tabsWrap.querySelectorAll('.filter-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        tabsWrap.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderPortfolio(btn.dataset.cat);
      });
    });

    renderPortfolio('All');
  } catch (err) {
    grid.innerHTML = '<p style="color:var(--ink-soft)">Portfolio data could not be loaded. Check that data/projects.json exists.</p>';
    console.error('Failed to load projects.json', err);
  }
}

function renderPortfolio(category) {
  const grid = document.getElementById('portfolio-grid');
  const list = category === 'All' ? allProjects : allProjects.filter(p => p.category === category);

  grid.innerHTML = list.map(p => `
    <article class="portfolio-card reveal">
      <div class="thumb">
        ${imageOrPlaceholder(p.coverImage, p.title)}
        <div class="card-overlay">
          <div class="card-overlay-text">
            <div class="cat">${escapeHTML(p.category)}</div>
            <div class="title">${escapeHTML(p.title)}</div>
          </div>
        </div>
      </div>
      <div class="card-meta">
        <div class="title">${escapeHTML(p.title)}</div>
        <div class="cat">${escapeHTML(p.category)}</div>
      </div>
    </article>
  `).join('');

  // re-observe newly injected cards for reveal animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  grid.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Shows the real image if the path resolves to a non-placeholder file,
// otherwise renders a clean placeholder block (no broken image icons).
function imageOrPlaceholder(src, alt) {
  if (!src || src.includes('placeholder.jpg')) {
    return `
      <div class="placeholder-block" style="height:100%;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
        <div class="ph-label">Artwork placeholder</div>
        <div class="ph-sub">Add image path in data/projects.json</div>
      </div>`;
  }
  return `<img src="${src}" alt="${escapeHTML(alt)}" loading="lazy">`;
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}
