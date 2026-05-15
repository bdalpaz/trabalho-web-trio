// routes/appRoutes.js
// Rotas autenticadas. Aplica controle de acesso por perfil.
const express = require('express');
const { requerLogin, requerPerfil } = require('../middlewares/authMiddleware');

const dashboardController = require('../controllers/dashboardController');
const alunoController = require('../controllers/alunoController');
const planoController = require('../controllers/planoController');
const matriculaController = require('../controllers/matriculaController');
const frequenciaController = require('../controllers/frequenciaController');

const router = express.Router();

// Todas as rotas abaixo exigem login
router.use(requerLogin);

// --- Dashboard ---
router.get('/dashboard', (req, res) => dashboardController.index(req, res));

// --- Alunos: ADMIN e RECEPCAO podem ver/cadastrar. Apenas ADMIN pode remover ---
router.get('/alunos', (req, res) => alunoController.listar(req, res));
router.get('/alunos/novo', (req, res) => alunoController.novo(req, res));
router.post('/alunos', (req, res) => alunoController.criar(req, res));
router.get('/alunos/:id/editar', (req, res) => alunoController.editar(req, res));
router.put('/alunos/:id', (req, res) => alunoController.atualizar(req, res));
router.delete('/alunos/:id', requerPerfil('ADMIN'), (req, res) => alunoController.remover(req, res));

// --- Planos: APENAS ADMIN pode gerenciar planos ---
router.get('/planos', requerPerfil('ADMIN'), (req, res) => planoController.listar(req, res));
router.get('/planos/novo', requerPerfil('ADMIN'), (req, res) => planoController.novo(req, res));
router.post('/planos', requerPerfil('ADMIN'), (req, res) => planoController.criar(req, res));
router.get('/planos/:id/editar', requerPerfil('ADMIN'), (req, res) => planoController.editar(req, res));
router.put('/planos/:id', requerPerfil('ADMIN'), (req, res) => planoController.atualizar(req, res));
router.delete('/planos/:id', requerPerfil('ADMIN'), (req, res) => planoController.remover(req, res));

// --- Matrículas: ambos podem matricular; apenas ADMIN pode remover registro ---
router.get('/matriculas', (req, res) => matriculaController.listar(req, res));
router.get('/matriculas/nova', (req, res) => matriculaController.nova(req, res));
router.post('/matriculas', (req, res) => matriculaController.criar(req, res));
router.post('/matriculas/:id/cancelar', (req, res) => matriculaController.cancelar(req, res));
router.delete('/matriculas/:id', requerPerfil('ADMIN'), (req, res) => matriculaController.remover(req, res));

// --- Frequência (catraca): qualquer perfil logado pode liberar entrada ---
router.get('/frequencia', (req, res) => frequenciaController.index(req, res));
router.post('/frequencia', (req, res) => frequenciaController.registrar(req, res));

module.exports = router;