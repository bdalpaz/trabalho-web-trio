// controllers/planoController.js
const planoService = require('../services/planoService');

class PlanoController {
  listar(req, res) {
    const planos = planoService.listar();
    res.render('planos/lista', { planos });
  }

  novo(req, res) {
    res.render('planos/form', { plano: { ativo: 1 }, acao: 'criar', erro: null });
  }

  criar(req, res) {
    try {
      planoService.criar(req.body);
      req.session.mensagem = 'Plano cadastrado com sucesso!';
      res.redirect('/planos');
    } catch (err) {
      res.render('planos/form', { plano: req.body, acao: 'criar', erro: err.message });
    }
  }

  editar(req, res) {
    try {
      const plano = planoService.buscar(req.params.id);
      res.render('planos/form', { plano, acao: 'editar', erro: null });
    } catch (err) {
      req.session.erro = err.message;
      res.redirect('/planos');
    }
  }

  atualizar(req, res) {
    try {
      planoService.atualizar(req.params.id, req.body);
      req.session.mensagem = 'Plano atualizado!';
      res.redirect('/planos');
    } catch (err) {
      const plano = { ...req.body, id: req.params.id };
      res.render('planos/form', { plano, acao: 'editar', erro: err.message });
    }
  }

  remover(req, res) {
    try {
      planoService.remover(req.params.id);
      req.session.mensagem = 'Plano removido.';
    } catch (err) {
      req.session.erro = err.message;
    }
    res.redirect('/planos');
  }
}

module.exports = new PlanoController();