/* ============================================================
 * Open Source Contribution Course Series — Shared JS
 * 純原生 JS，無依賴
 * 提供：reading progress / TOC scrollspy / code copy / quiz
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

  /* ─────────── Quiz engine ─────────── */
  function initQuiz() {
    const quizSection = document.querySelector('.quiz-section');
    if (!quizSection) return;
    const dataEl = document.getElementById('quiz-data');
    if (!dataEl) return;

    let questions;
    try {
      questions = JSON.parse(dataEl.textContent);
    } catch (e) {
      console.error('quiz-data 解析失敗', e);
      return;
    }

    const container = quizSection.querySelector('.quiz-list');
    if (!container) return;

    const progressEl = quizSection.querySelector('.quiz-progress span');
    let answeredCount = 0;
    const updateProgress = () => {
      if (progressEl) progressEl.textContent = answeredCount + ' / ' + questions.length;
    };
    updateProgress();

    questions.forEach((q, qi) => {
      const card = document.createElement('div');
      card.className = 'quiz-card';
      const isMulti = Array.isArray(q.answer);

      const correctSet = new Set(isMulti ? q.answer : [q.answer]);

      const opts = q.options.map((opt, oi) => {
        const letter = String.fromCharCode(65 + oi); // A B C D
        return `
          <div class="quiz-option" data-idx="${oi}">
            <div class="opt-marker">${letter}</div>
            <div class="opt-text">${opt}</div>
          </div>
        `;
      }).join('');

      card.innerHTML = `
        <div class="quiz-question">
          <span class="quiz-question-num">Q${qi + 1}</span>${q.question}
        </div>
        <div class="quiz-hint">${isMulti ? '※ 多選題' : '※ 單選題'}</div>
        <div class="quiz-options">${opts}</div>
        <div class="quiz-feedback"><strong>解析</strong><br>${q.explain || ''}</div>
      `;

      const optionEls = card.querySelectorAll('.quiz-option');
      const feedbackEl = card.querySelector('.quiz-feedback');
      const selected = new Set();
      let answered = false;

      const evaluate = () => {
        if (answered) return;
        answered = true;
        answeredCount += 1;
        updateProgress();

        optionEls.forEach((el, idx) => {
          el.classList.add('locked');
          const isCorrect = correctSet.has(idx);
          const isSelected = selected.has(idx);
          if (isCorrect) el.classList.add('correct');
          if (isSelected && !isCorrect) el.classList.add('wrong');
        });

        feedbackEl.classList.add('show');
      };

      optionEls.forEach((el) => {
        el.addEventListener('click', () => {
          if (answered) return;
          const idx = Number(el.dataset.idx);
          if (isMulti) {
            if (selected.has(idx)) {
              selected.delete(idx);
              el.classList.remove('selected-pending');
              el.querySelector('.opt-marker').style.background = '';
              el.querySelector('.opt-marker').style.color = '';
              el.querySelector('.opt-marker').style.borderColor = '';
            } else {
              selected.add(idx);
              el.classList.add('selected-pending');
              el.querySelector('.opt-marker').style.background = 'var(--ecc)';
              el.querySelector('.opt-marker').style.color = 'var(--white)';
              el.querySelector('.opt-marker').style.borderColor = 'var(--ecc)';
            }
          } else {
            selected.clear();
            selected.add(idx);
            evaluate();
          }
        });
      });

      // 多選題加上 「送出」按鈕
      if (isMulti) {
        const submitWrap = document.createElement('div');
        submitWrap.style.marginTop = '0.6rem';
        const submitBtn = document.createElement('button');
        submitBtn.textContent = '送出答案';
        submitBtn.style.cssText = `
          font-family: var(--mono);
          font-size: 12px;
          padding: 6px 14px;
          border-radius: 8px;
          background: var(--ecc);
          color: var(--white);
          border: none;
          cursor: pointer;
          font-weight: 600;
        `;
        submitBtn.addEventListener('click', () => {
          if (selected.size === 0) return;
          submitBtn.disabled = true;
          submitBtn.style.opacity = '0.4';
          evaluate();
        });
        submitWrap.appendChild(submitBtn);
        card.querySelector('.quiz-options').after(submitWrap);
      }

      container.appendChild(card);
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
    initQuiz();
  }
})();
