// services/planoService.js
const planoRepository = require('../repositories/planoRepository');

class PlanoService {
  listar() {
    return planoRepository.listar();
  }

  listarAtivos() {
    return planoRepository.listarAtivos();
  }

  buscar(id) {
    const plano = planoRepository.buscarPorId(id);
    if (!plano) throw new Error('Plano não encontrado.');
    return plano;
  }

  _validar(dados) {
    if (!dados.nome || dados.nome.trim().length < 2) {
      throw new Error('Nome do plano é obrigatório.');
    }
    const valor = parseFloat(dados.valor_mensal);
    if (isNaN(valor) || valor <= 0) {
      throw new Error('Valor mensal deve ser maior que zero.');
    }
    const duracao = parseInt(dados.duracao_meses);
    if (isNaN(duracao) || duracao < 1) {
      throw new Error('Duração deve ser de pelo menos 1 mês.');
    }
    return {
      nome: dados.nome.trim(),
      descricao: dados.descricao || '',
      valor_mensal: valor,
      duracao_meses: duracao,
      ativo: dados.ativo === 'on' || dados.ativo === true || dados.ativo === 1 || dados.ativo === '1'
    };
  }

  criar(dados) {
    return planoRepository.criar(this._validar(dados));
  }

  atualizar(id, dados) {
    this.buscar(id);
    return planoRepository.atualizar(id, this._validar(dados));
  }

  remover(id) {
    this.buscar(id);
    planoRepository.remover(id);
  }
}

module.exports = new PlanoService();