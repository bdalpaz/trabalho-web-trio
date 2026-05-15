const frequenciaService = require('../services/frequenciaService');

class FrequenciaController {
  index(req, res) {
    const recentes = frequenciaService.listarRecentes();
    const totalHoje = frequenciaService.totalHoje();
    res.render('frequencia/index', {
      recentes, totalHoje, mensagem: null, erro: null, ultimoAluno: null
    });
  }

  registrar(req, res) {
    const recentes = frequenciaService.listarRecentes();
    const totalHoje = frequenciaService.totalHoje();

    try {
      const { aluno } = frequenciaService.registrarPorCpf(req.body.cpf);
      res.render('frequencia/index', {
        recentes: frequenciaService.listarRecentes(),
        totalHoje: frequenciaService.totalHoje(),
        mensagem: `Acesso liberado: ${aluno.nome}`,
        erro: null,
        ultimoAluno: aluno
      });
    } catch (err) {
      res.render('frequencia/index', {
        recentes, totalHoje, mensagem: null, erro: err.message, ultimoAluno: null
      });
    }
  }
}

module.exports = new FrequenciaController();
