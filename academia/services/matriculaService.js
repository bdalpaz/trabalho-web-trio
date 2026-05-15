const matriculaRepository = require('../repositories/matriculaRepository');
const alunoRepository = require('../repositories/alunoRepository');
const planoRepository = require('../repositories/planoRepository');

class MatriculaService {
  listar() {
    return matriculaRepository.listar();
  }

  buscar(id) {
    const m = matriculaRepository.buscarPorId(id);
    if (!m) throw new Error('Matrícula não encontrada.');
    return m;
  }

  criar(dados) {
    const alunoId = parseInt(dados.aluno_id);
    const planoId = parseInt(dados.plano_id);

    const aluno = alunoRepository.buscarPorId(alunoId);
    if (!aluno) throw new Error('Aluno não encontrado.');

    const plano = planoRepository.buscarPorId(planoId);
    if (!plano) throw new Error('Plano não encontrado.');
    if (!plano.ativo) throw new Error('Este plano está inativo e não aceita novas matrículas.');

    const matriculaAtiva = matriculaRepository.buscarAtivaPorAluno(alunoId);
    if (matriculaAtiva) {
      throw new Error(
        'Este aluno já possui uma matrícula ativa e vigente. ' +
        'Cancele a atual antes de criar uma nova.'
      );
    }

    const inicio = dados.data_inicio ? new Date(dados.data_inicio) : new Date();
    const fim = new Date(inicio);
    fim.setMonth(fim.getMonth() + plano.duracao_meses);

    const fmt = (d) => d.toISOString().substring(0, 10);

    return matriculaRepository.criar({
      aluno_id: alunoId,
      plano_id: planoId,
      data_inicio: fmt(inicio),
      data_fim: fmt(fim)
    });
  }

  cancelar(id) {
    this.buscar(id);
    matriculaRepository.cancelar(id);
  }

  remover(id) {
    this.buscar(id);
    matriculaRepository.remover(id);
  }
}

module.exports = new MatriculaService();
