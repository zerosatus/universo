import express from 'express';
import path from 'path';
import { formulas, categories } from './data/formulas';

const app = express();
const PORT = process.env.PORT || 3000;

// JSON para API de fórmulas
app.get('/api/formulas', (req, res) => {
  const q = (req.query.q as string || '').toLowerCase().trim();
  const cat = (req.query.category as string || '').toLowerCase().trim();

  let resultado = formulas;

  if (cat && cat !== 'todas') {
    resultado = resultado.filter(f => f.category === cat);
  }

  if (q) {
    resultado = resultado.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q) ||
      f.latex.toLowerCase().includes(q) ||
      f.variables.some(v =>
        v.symbol.toLowerCase().includes(q) ||
        v.meaning.toLowerCase().includes(q)
      )
    );
  }

  res.json({ total: resultado.length, formulas: resultado });
});

app.get('/api/categories', (_req, res) => {
  res.json(categories);
});

// Serve arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});