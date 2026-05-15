const frequenciaRepository = require('../repositories/frequenciaRepository');
const matriculaRepository = require('../repositories/matriculaRepository');
const alunoRepository = require('../repositories/alunoRepository');

class FrequenciaService {
  registrarPorCpf(cpf) {
    const cpfNumeros = (cpf || '').replace(/\D/g, '');
    if (cpfNumeros.length !== 11) {
      throw new Error('CPF inválido.');
    }
    const aluno = alunoRepository.buscarPorCpf(cpfNumeros);
    if (!aluno) {
      throw new Error('Nenhum aluno cadastrado com este CPF.');
    }

    const matricula = matriculaRepository.buscarAtivaPorAluno(aluno.id);
    if (!matricula) {
      throw new Error(`Acesso negado: ${aluno.nome} não possui matrícula ativa vigente.`);
    }

    frequenciaRepository.registrar(aluno.id);
    return { aluno, matricula };
  }

  listarRecentes() {
    return frequenciaRepository.listarRecentes(50);
  }

  totalHoje() {
    return frequenciaRepository.contarHoje();
  }
}

module.exports = new FrequenciaService();
