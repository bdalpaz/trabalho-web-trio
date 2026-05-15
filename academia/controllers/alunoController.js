const alunoService = require('../services/alunoService');

class AlunoController {
  listar(req, res) {
    const filtro = req.query.busca || '';
    const alunos = alunoService.listar(filtro);
    res.render('alunos/lista', { alunos, filtro });
  }

  novo(req, res) {
    res.render('alunos/form', { aluno: {}, acao: 'criar', erro: null });
  }

  criar(req, res) {
    try {
      alunoService.criar(req.body);
      req.session.mensagem = 'Aluno cadastrado com sucesso!';
      res.redirect('/alunos');
    } catch (err) {
      res.render('alunos/form', { aluno: req.body, acao: 'criar', erro: err.message });
    }
  }

  editar(req, res) {
    try {
      const aluno = alunoService.buscar(req.params.id);
      res.render('alunos/form', { aluno, acao: 'editar', erro: null });
    } catch (err) {
      req.session.erro = err.message;
      res.redirect('/alunos');
    }
  }

  atualizar(req, res) {
    try {
      alunoService.atualizar(req.params.id, req.body);
      req.session.mensagem = 'Aluno atualizado com sucesso!';
      res.redirect('/alunos');
    } catch (err) {
      const aluno = { ...req.body, id: req.params.id };
      res.render('alunos/form', { aluno, acao: 'editar', erro: err.message });
    }
  }

  remover(req, res) {
    try {
      alunoService.remover(req.params.id);
      req.session.mensagem = 'Aluno removido com sucesso!';
    } catch (err) {
      req.session.erro = err.message;
    }
    res.redirect('/alunos');
  }
}

module.exports = new AlunoController();
