/* 辽宁留学 · 新版官网交互脚本
   纯原生 JS，无依赖、无构建步骤。 */
(function () {
  'use strict';

  /* 版权年份 */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* 顶部导航滚动态 + 回到顶部 */
  var header = document.querySelector('.site-header');
  var toTop = document.querySelector('.back-to-top');
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle('is-scrolled', y > 12);
    if (toTop) toTop.classList.toggle('is-visible', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* 移动端菜单 */
  var toggle = document.querySelector('.nav-toggle');
  var panel = document.querySelector('.mobile-panel');
  if (toggle && panel) {
    function setMenu(open) {
      panel.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
    }
    toggle.addEventListener('click', function () {
      setMenu(!panel.classList.contains('is-open'));
    });
    panel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1080) setMenu(false);
    });
  }

  /* 当前栏目高亮 */
  var page = document.body.getAttribute('data-page');
  if (page) {
    document.querySelectorAll('[data-nav="' + page + '"]').forEach(function (a) {
      a.setAttribute('aria-current', 'page');
    });
  }

  /* 资讯中心分类筛选 */
  var chips = document.querySelectorAll('[data-filter]');
  var posts = document.querySelectorAll('[data-category]');
  if (chips.length && posts.length) {
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var value = chip.getAttribute('data-filter');
        chips.forEach(function (c) {
          var active = c === chip;
          c.classList.toggle('is-active', active);
          c.setAttribute('aria-pressed', String(active));
        });
        posts.forEach(function (post) {
          var cats = (post.getAttribute('data-category') || '').split(' ');
          var show = value === 'all' || cats.indexOf(value) !== -1;
          post.hidden = !show;
        });
        var count = document.querySelector('[data-filter-count]');
        if (count) {
          var shown = Array.prototype.filter.call(posts, function (p) { return !p.hidden; }).length;
          count.textContent = '共 ' + shown + ' 篇';
        }
      });
    });
  }

  /* 深链接：直接展开指定文章，或自动切到冬夏令营分类 */
  if (window.location.hash) {
    var hash = decodeURIComponent(window.location.hash.slice(1));
    var hashTarget = document.getElementById(hash);
    if (hashTarget && hashTarget.classList.contains('post-row')) hashTarget.open = true;
    if (hash === 'camps') {
      var campChip = document.querySelector('[data-filter="camp"]');
      if (campChip) campChip.click();
    }
  }

  /* WebP 不可用时回退到同名 JPEG */
  document.querySelectorAll('img[data-fallback]').forEach(function (img) {
    img.addEventListener('error', function () {
      var fallback = img.getAttribute('data-fallback');
      if (fallback && img.src.indexOf(fallback) === -1) img.src = fallback;
    });
  });

  /* 一键复制联系方式 */
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var value = btn.getAttribute('data-copy');
      if (!value) return;
      var done = function () {
        var old = btn.textContent;
        btn.textContent = '已复制';
        setTimeout(function () { btn.textContent = old; }, 1600);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(value).then(done);
      } else {
        var input = document.createElement('textarea');
        input.value = value;
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        try { document.execCommand('copy'); done(); } catch (e) { /* noop */ }
        document.body.removeChild(input);
      }
    });
  });

  /* 中英对照文章：English / 中文原文 切换 */
  document.querySelectorAll('.bilingual').forEach(function (box) {
    var tabs = box.querySelectorAll('.bilingual__tab');
    var panes = box.querySelectorAll('.prose[data-lang-pane]');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = tab.getAttribute('data-lang-pane');
        tabs.forEach(function (t) {
          var on = (t === tab);
          t.classList.toggle('is-active', on);
          t.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        panes.forEach(function (p) {
          p.hidden = (p.getAttribute('data-lang-pane') !== target);
        });
      });
    });
  });
})();
