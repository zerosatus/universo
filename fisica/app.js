// As variáveis `formulas` e `categories` vêm de formulas.js

const grid = document.getElementById('grid');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const clearBtn = document.getElementById('clearBtn');
const totalChip = document.getElementById('totalChip');
const categoriesNav = document.getElementById('categoriesNav');

const allFormulas = formulas;
let activeCategory = 'todas';

const renderMath = () => {
  const mj = window.MathJax;
  if (mj && mj.startup && mj.startup.promise) {
    mj.startup.promise
      .then(() => mj.typesetPromise([grid]))
      .catch(e => console.warn('MathJax:', e));
  }
};

function renderCategories() {
  categoriesNav.innerHTML = '';

  const todasBtn = document.createElement('button');
  todasBtn.className = 'cat-btn active';
  todasBtn.innerHTML = '📚 Todas';
  todasBtn.dataset.category = 'todas';
  todasBtn.onclick = () => setCategory('todas');
  categoriesNav.appendChild(todasBtn);

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'cat-btn';
    btn.innerHTML = `${cat.icon} ${cat.name}`;
    btn.dataset.category = cat.id;
    btn.onclick = () => setCategory(cat.id);
    categoriesNav.appendChild(btn);
  });
}

function setCategory(catId) {
  activeCategory = catId;
  document.querySelectorAll('.cat-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.category === catId);
  });
  applyFilters();
}

function applyFilters() {
  const q = searchInput.value.toLowerCase().trim();
  let filtered = allFormulas;

  if (activeCategory !== 'todas') {
    filtered = filtered.filter(f => f.category === activeCategory);
  }

  if (q) {
    filtered = filtered.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q) ||
      f.latex.toLowerCase().includes(q) ||
      f.variables.some(v =>
        v.symbol.toLowerCase().includes(q) ||
        v.meaning.toLowerCase().includes(q)
      )
    );
  }

  renderGrid(filtered);
  totalChip.textContent = `${filtered.length} fórmula${filtered.length !== 1 ? 's' : ''}`;
  emptyState.style.display = filtered.length === 0 ? 'block' : 'none';
}

function renderGrid(lista) {
  grid.innerHTML = '';
  const catMap = {
    mecanica: 'Mecânica',
    termodinamica: 'Termo',
    eletromagnetismo: 'Eletro',
    optica: 'Óptica',
    ondas: 'Ondas',
    quantica: 'Quântica',
    relatividade: 'Relat.',
    fluidos: 'Fluidos',
    moderna: 'Moderna',
  };

  lista.forEach(f => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-header">
        <div class="card-title">${escapeHtml(f.name)}</div>
        <div class="cat-tag">${catMap[f.category] || f.category}</div>
      </div>
      <div class="latex-box">$$${escapeHtml(f.latex)}$$</div>
      <p class="description">${escapeHtml(f.description)}</p>
      <div class="variables">
        ${f.variables.map(v => `
          <div class="var">
            <strong>${escapeHtml(v.symbol)}</strong>
            <span>· ${escapeHtml(v.meaning)}</span>
            ${v.unit !== '—' ? `<span>(${escapeHtml(v.unit)})</span>` : ''}
          </div>
        `).join('')}
      </div>
    `;
    grid.appendChild(card);
  });

  renderMath();
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

searchInput.addEventListener('input', () => {
  clearBtn.classList.toggle('visible', searchInput.value.length > 0);
  applyFilters();
});

clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  clearBtn.classList.remove('visible');
  applyFilters();
  searchInput.focus();
});

// Init — não há fetch! Os dados já estão carregados via formulas.js
renderCategories();
applyFilters();