/* ========================================================================
   500 TOOLS · 通用工具引擎 v2
   ======================================================================== */
(function () {
'use strict';

const $ = (sel, ctx=document) => ctx.querySelector(sel);

function escape(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g,
    c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function fmt(v) {
  if (v == null) return '—';
  if (typeof v === 'string') return v;
  if (typeof v === 'boolean') return v ? '是' : '否';
  if (typeof v !== 'number' || isNaN(v)) return '—';
  if (!isFinite(v)) return '∞';
  if (v === 0) return '0';
  if (Math.abs(v) < 0.001) return v.toExponential(3);
  if (Number.isInteger(v) && Math.abs(v) < 1e9) return v.toLocaleString();
  return Number(v.toFixed(4)).toLocaleString();
}

function makeFn(formula, varNames) {
  const builtins = ['Math','PI','sqrt','pow','abs','min','max','log','log10','sin','cos','tan','floor','ceil','round'];
  const argNames = [...varNames, ...builtins];
  const argValues = [Math, Math.PI, Math.sqrt, Math.pow, Math.abs, Math.min, Math.max, Math.log, Math.log10, Math.sin, Math.cos, Math.tan, Math.floor, Math.ceil, Math.round];
  try {
    const fn = new Function(...argNames, `return (${formula});`);
    return (vars) => {
      try {
        const args = varNames.map(n => vars[n]);
        return fn(...args, ...argValues);
      } catch (e) { return NaN; }
    };
  } catch (e) {
    return () => NaN;
  }
}

function renderCalc(tool, mount) {
  const ins = tool.in || tool.inputs || [];
  const outs = tool.out || tool.outputs || [];
  const note = tool.note || tool.formula;
  const varNames = ins.map(i => i.id);
  const compiledOuts = outs.map(o => ({ ...o, fn: makeFn(o.f, varNames) }));

  const inputsHtml = ins.map(i => {
    const labelHtml = `<label class="t-label" for="t-${i.id}">${escape(i.label)}${i.unit ? ` <span class="t-unit-tag">${escape(i.unit)}</span>` : ''}</label>`;
    if (i.type === 'select' && Array.isArray(i.options)) {
      const optsHtml = i.options.map(opt => {
        const [label, value] = Array.isArray(opt) ? opt : [opt, opt];
        const sel = (i.default !== undefined && String(value) === String(i.default)) ? ' selected' : '';
        return `<option value="${escape(value)}"${sel}>${escape(label)}</option>`;
      }).join('');
      return `<div class="t-field">${labelHtml}<select class="t-input t-select" id="t-${i.id}">${optsHtml}</select></div>`;
    }
    if (i.type === 'text') {
      return `<div class="t-field">${labelHtml}<input class="t-input" type="text" id="t-${i.id}" value="${escape(i.default ?? '')}"></div>`;
    }
    if (i.type === 'color') {
      const def = i.default || '#3a86ff';
      return `<div class="t-field">${labelHtml}<input class="t-input t-color" type="color" id="t-${i.id}" value="${escape(def)}"></div>`;
    }
    return `<div class="t-field">${labelHtml}<input class="t-input" type="number" id="t-${i.id}" value="${i.default ?? 0}"
      ${i.min != null ? `min="${i.min}"` : ''} ${i.max != null ? `max="${i.max}"` : ''} step="${i.step || 'any'}"></div>`;
  }).join('');

  const outputsHtml = outs.map((o, idx) => `
    <div class="t-out-row" data-idx="${idx}">
      <div class="t-out-label">${escape(o.label)}</div>
      <div class="t-out-value"><span class="t-num">—</span> <span class="t-unit">${escape(o.unit || '')}</span></div>
    </div>
  `).join('');

  mount.innerHTML = `
    <div class="t-app">
      <div class="t-inputs">${inputsHtml}</div>
      <div class="t-outputs">${outputsHtml}</div>
      ${note ? `<div class="t-note">💡 ${escape(note)}</div>` : ''}
    </div>
  `;

  function readVar(i) {
    const el = $(`#t-${i.id}`, mount);
    if (!el) return 0;
    if (i.type === 'text' || i.type === 'color') return el.value;
    if (i.type === 'select') {
      const v = el.value;
      const num = parseFloat(v);
      return isNaN(num) ? v : num;
    }
    return parseFloat(el.value) || 0;
  }

  function compute() {
    const vars = {};
    ins.forEach(i => vars[i.id] = readVar(i));
    compiledOuts.forEach((o, idx) => {
      const val = o.fn(vars);
      const row = mount.querySelector(`.t-out-row[data-idx="${idx}"] .t-num`);
      if (row) row.textContent = fmt(val);
    });
  }
  ins.forEach(i => {
    const el = $(`#t-${i.id}`, mount);
    if (el) {
      el.addEventListener('input', compute);
      el.addEventListener('change', compute);
    }
  });
  compute();
}

function renderConv(tool, mount) {
  const r = tool.ratio;
  mount.innerHTML = `
    <div class="t-app t-conv">
      <div class="t-conv-pair">
        <div class="t-field">
          <label class="t-label">${escape(tool.left.label)}</label>
          <input class="t-input" type="number" id="t-conv-l" value="${tool.left.default ?? 1}" step="${tool.left.step || 'any'}">
        </div>
        <div class="t-conv-arrow">⇌</div>
        <div class="t-field">
          <label class="t-label">${escape(tool.right.label)}</label>
          <input class="t-input" type="number" id="t-conv-r" value="${(tool.left.default ?? 1) * r}" step="${tool.right.step || 'any'}">
        </div>
      </div>
      ${tool.note ? `<div class="t-note">💡 ${escape(tool.note)}</div>` : ''}
    </div>
  `;
  const L = $('#t-conv-l', mount);
  const R = $('#t-conv-r', mount);
  let lock = false;
  L.addEventListener('input', () => {
    if (lock) return; lock = true;
    R.value = +((parseFloat(L.value) || 0) * r).toFixed(6);
    lock = false;
  });
  R.addEventListener('input', () => {
    if (lock) return; lock = true;
    L.value = +((parseFloat(R.value) || 0) / r).toFixed(6);
    lock = false;
  });
}

function renderLookup(tool, mount) {
  const fields = tool.fields || [];
  const rows = tool.rows || [];
  const headHtml = fields.map(f => `<th>${escape(f)}</th>`).join('');
  const renderRows = (filter='') => {
    const f = filter.trim().toLowerCase();
    return rows
      .filter(r => !f || r.some(c => String(c).toLowerCase().includes(f)))
      .map(r => `<tr>${r.map(c => `<td>${escape(c)}</td>`).join('')}</tr>`).join('');
  };
  mount.innerHTML = `
    <div class="t-app">
      ${tool.search !== false ? `<input class="t-input t-search" type="text" id="t-search" placeholder="🔍 搜尋…">` : ''}
      <div class="t-table-wrap">
        <table class="t-table">
          <thead><tr>${headHtml}</tr></thead>
          <tbody id="t-tbody">${renderRows()}</tbody>
        </table>
      </div>
      ${tool.note ? `<div class="t-note">💡 ${escape(tool.note)}</div>` : ''}
    </div>
  `;
  const search = $('#t-search', mount);
  if (search) search.addEventListener('input', e => { $('#t-tbody', mount).innerHTML = renderRows(e.target.value); });
}

function renderCheck(tool, mount) {
  const items = tool.items || [];
  mount.innerHTML = `
    <div class="t-app">
      <div class="t-progress-row">
        <div class="t-progress-bar"><div class="t-progress-fill" id="t-fill" style="width:0%"></div></div>
        <div class="t-progress-num" id="t-prog-num">0 / ${items.length}</div>
      </div>
      <ul class="t-check-list">
        ${items.map((it, i) => `
          <li class="t-check-item" data-idx="${i}">
            <label class="t-check-label">
              <input type="checkbox" class="t-check-box" data-idx="${i}">
              <span class="t-check-mark"></span>
              <span class="t-check-text">
                <strong>${escape(typeof it === 'string' ? it : it.title)}</strong>
                ${typeof it === 'object' && it.desc ? `<small>${escape(it.desc)}</small>` : ''}
              </span>
            </label>
          </li>
        `).join('')}
      </ul>
      <button class="t-btn-reset" id="t-reset">清除全部</button>
      ${tool.note ? `<div class="t-note">💡 ${escape(tool.note)}</div>` : ''}
    </div>
  `;
  function update() {
    const total = items.length;
    const done = mount.querySelectorAll('.t-check-box:checked').length;
    $('#t-fill', mount).style.width = (done/total*100) + '%';
    $('#t-prog-num', mount).textContent = `${done} / ${total}`;
    mount.querySelectorAll('.t-check-item').forEach(li => {
      const idx = +li.dataset.idx;
      li.classList.toggle('done', mount.querySelector(`.t-check-box[data-idx="${idx}"]`).checked);
    });
  }
  mount.querySelectorAll('.t-check-box').forEach(cb => cb.addEventListener('change', update));
  $('#t-reset', mount).addEventListener('click', () => {
    mount.querySelectorAll('.t-check-box').forEach(cb => cb.checked = false);
    update();
  });
}

function renderRef(tool, mount) {
  const sections = tool.sections || [];
  mount.innerHTML = `
    <div class="t-app t-ref">
      ${sections.map(s => `
        <div class="t-ref-section">
          <h3 class="t-ref-title">${escape(s.title)}</h3>
          <div class="t-ref-body">${s.html ? s.body : escape(s.body).replace(/\n/g,'<br>')}</div>
        </div>
      `).join('')}
      ${tool.note ? `<div class="t-note">💡 ${escape(tool.note)}</div>` : ''}
    </div>
  `;
}

window.initTool = function(tool) {
  const mount = document.getElementById('t-mount');
  if (!mount || !tool) return;
  try {
    const type = tool.type || 'calc';
    switch (type) {
      case 'calc':   renderCalc(tool, mount); break;
      case 'conv':   renderConv(tool, mount); break;
      case 'lookup': renderLookup(tool, mount); break;
      case 'check':  renderCheck(tool, mount); break;
      case 'ref':    renderRef(tool, mount); break;
      default: mount.innerHTML = '<p>未知工具類型</p>';
    }
  } catch (e) {
    console.error('Tool init failed:', e);
    mount.innerHTML = '<p>工具載入失敗,請重新整理。</p>';
  }
};
})();
