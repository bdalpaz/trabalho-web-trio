// server.js - ponto de entrada da aplicação
const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');

const db = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const appRoutes = require('./routes/appRoutes');
const { injetarLocals } = require('./middlewares/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares globais
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Sessão
app.use(session({
  secret: 'academia-secret-key-trocar-em-producao',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 4 } // 4h
}));

app.use(injetarLocals);

// Rotas
app.use('/', authRoutes);
app.use('/', appRoutes);

// Raiz redireciona conforme login
app.get('/', (req, res) => {
  if (req.session.usuario) return res.redirect('/dashboard');
  res.redirect('/login');
});

// 404
app.use((req, res) => res.status(404).render('auth/notFound'));

// Inicializa banco e depois sobe o servidor
db.inicializar().then(() => {
  app.listen(PORT, () => {
    console.log(`\n✓ Servidor da Academia rodando em http://localhost:${PORT}\n`);
    console.log(`  Login ADMIN:    admin@academia.com    / admin123`);
    console.log(`  Login RECEPÇÃO: recepcao@academia.com / recepcao123\n`);
  });
}).catch(err => {
  console.error('Erro ao inicializar banco:', err);
  process.exit(1);
});