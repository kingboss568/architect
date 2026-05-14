/* hub 頁:渲染工具卡片網格 + 分類篩選 */
(function () {
  'use strict';
  const escape = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const pad3 = n => String(n).padStart(3, '0');

  function uniqueCats(tools) {
    const seen = new Map();
    tools.forEach(t => seen.set(t.cat, (seen.get(t.cat)||0)+1));
    return Array.from(seen.entries());
  }

  window.renderIndustry = function ({ tools, slug, catMount='cats', toolMount='tools' }) {
    const cm = document.getElementById(catMount);
    const tm = document.getElementById(toolMount);
    if (!tm || !Array.isArray(tools)) return;

    if (cm) {
      const cats = uniqueCats(tools);
      cm.innerHTML = `<button class="cat is-active" data-cat="__all">全部 <span class="cat-count">${tools.length}</span></button>` +
        cats.map(([n, c]) => `<button class="cat" data-cat="${escape(n)}">${escape(n)} <span class="cat-count">${c}</span></button>`).join('');
      cm.addEventListener('click', e => {
        const btn = e.target.closest('.cat'); if (!btn) return;
        cm.querySelectorAll('.cat').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const cat = btn.dataset.cat;
        document.querySelectorAll('.tool').forEach(card => {
          card.hidden = (cat !== '__all' && card.dataset.cat !== cat);
        });
      });
    }

    tm.innerHTML = tools.map((t, i) => {
      const num = pad3(t.n || i+1);
      return `<a class="tool" href="${slug}/${num}.html" data-cat="${escape(t.cat)}">
        <div class="tool-num">№ ${num}</div>
        <div class="tool-name">${escape(t.name)}</div>
        <div class="tool-desc">${escape(t.desc)}</div>
        <div class="tool-foot"><span class="tool-cat">${escape(t.cat)}</span><span class="tool-go">使用</span></div>
      </a>`;
    }).join('');
  };
})();
