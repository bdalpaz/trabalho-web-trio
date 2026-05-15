const matriculaService = require('../services/matriculaService');
const alunoService = require('../services/alunoService');
const planoService = require('../services/planoService');

class MatriculaController {
  listar(req, res) {
    const matriculas = matriculaService.listar();
    res.render('matriculas/lista', { matriculas });
  }

  nova(req, res) {
    const alunos = alunoService.listar();
    const planos = planoService.listarAtivos();
    res.render('matriculas/form', { alunos, planos, erro: null, dados: {} });
  }

  criar(req, res) {
    try {
      matriculaService.criar(req.body);
      req.session.mensagem = 'Matrícula realizada com sucesso!';
      res.redirect('/matriculas');
    } catch (err) {
      const alunos = alunoService.listar();
      const planos = planoService.listarAtivos();
      res.render('matriculas/form', { alunos, planos, erro: err.message, dados: req.body });
    }
  }

  cancelar(req, res) {
    try {
      matriculaService.cancelar(req.params.id);
      req.session.mensagem = 'Matrícula cancelada.';
    } catch (err) {
      req.session.erro = err.message;
    }
    res.redirect('/matriculas');
  }

  remover(req, res) {
    try {
      matriculaService.remover(req.params.id);
      req.session.mensagem = 'Matrícula removida.';
    } catch (err) {
      req.session.erro = err.message;
    }
    res.redirect('/matriculas');
  }
}

module.exports = new MatriculaController();
