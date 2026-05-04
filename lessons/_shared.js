/* ============================================================
 * Open Source Contribution Course Series — Shared JS
 * 純原生 JS，無依賴
 * 提供：reading progress / TOC scrollspy / code copy
 * ============================================================ */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─────────── Reading progress bar ─────────── */
  function initReadingProgress() {
    const bar = document.querySelector('.reading-progress');
    if (!bar) return;
    let ticking = false;
    function update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      bar.style.width = pct + '%';
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  /* ─────────── TOC scrollspy ─────────── */
  function initTocScrollspy() {
    const sections = document.querySelectorAll('.lesson-article > section[id]');
    const tocLinks = document.querySelectorAll('.toc-link');
    if (!sections.length || !tocLinks.length) return;

    const linkMap = new Map();
    tocLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) linkMap.set(href.slice(1), link);
    });

    const setActive = (id) => {
      tocLinks.forEach((l) => l.classList.remove('active'));
      const link = linkMap.get(id);
      if (link) {
        link.classList.add('active');
        // 確保 active 連結捲動到 nav 視野內
        const nav = document.querySelector('.sticky-nav-inner');
        if (nav) {
          const linkRect = link.getBoundingClientRect();
          const navRect = nav.getBoundingClientRect();
          if (linkRect.left < navRect.left || linkRect.right > navRect.right) {
            link.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
          }
        }
      }
    };

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top);
      if (visible[0]) setActive(visible[0].target.id);
    }, {
      rootMargin: '-80px 0px -55% 0px',
      threshold: 0,
    });

    sections.forEach((s) => observer.observe(s));
  }

  /* ─────────── Code copy buttons ─────────── */
  function initCodeCopy() {
    const blocks = document.querySelectorAll('.code-block');
    blocks.forEach((block) => {
      const btn = block.querySelector('.code-copy-btn');
      const codeEl = block.querySelector('pre code') || block.querySelector('pre');
      if (!btn || !codeEl) return;
      btn.addEventListener('click', async () => {
        const text = codeEl.innerText;
        try {
          await navigator.clipboard.writeText(text);
        } catch (e) {
          // fallback
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); } catch (_) {}
          document.body.removeChild(ta);
        }
        const original = btn.textContent;
        btn.textContent = '✓ 已複製';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = original;
          btn.classList.remove('copied');
        }, 1500);
      });
    });
  }

  /* ─────────── Boot ─────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  function boot() {
    initReadingProgress();
    initTocScrollspy();
    initCodeCopy();
  }
})();
