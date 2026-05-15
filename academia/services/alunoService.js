const alunoRepository = require('../repositories/alunoRepository');

class AlunoService {
  listar(filtro) {
    return alunoRepository.listar(filtro);
  }

  buscar(id) {
    const aluno = alunoRepository.buscarPorId(id);
    if (!aluno) throw new Error('Aluno não encontrado.');
    return aluno;
  }

  _validar(dados) {
    if (!dados.nome || dados.nome.trim().length < 3) {
      throw new Error('Nome deve ter ao menos 3 caracteres.');
    }
    const cpfNumeros = (dados.cpf || '').replace(/\D/g, '');
    if (cpfNumeros.length !== 11) {
      throw new Error('CPF inválido. Use 11 dígitos.');
    }
    dados.cpf = cpfNumeros;
    if (dados.email && !/^\S+@\S+\.\S+$/.test(dados.email)) {
      throw new Error('E-mail inválido.');
    }
    return dados;
  }

  criar(dados) {
    dados = this._validar(dados);
    const existente = alunoRepository.buscarPorCpf(dados.cpf);
    if (existente) {
      throw new Error('Já existe um aluno cadastrado com este CPF.');
    }
    return alunoRepository.criar(dados);
  }

  atualizar(id, dados) {
    this.buscar(id);
    dados = this._validar(dados);
    const existente = alunoRepository.buscarPorCpf(dados.cpf);
    if (existente && existente.id !== Number(id)) {
      throw new Error('Já existe outro aluno com este CPF.');
    }
    return alunoRepository.atualizar(id, dados);
  }

  remover(id) {
    this.buscar(id);
    alunoRepository.remover(id);
  }
}

module.exports = new AlunoService();
