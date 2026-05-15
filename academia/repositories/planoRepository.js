const db = require('../config/database');

class PlanoRepository {
  listar() {
    return db.prepare('SELECT * FROM planos ORDER BY valor_mensal').all();
  }

  listarAtivos() {
    return db.prepare('SELECT * FROM planos WHERE ativo = 1 ORDER BY valor_mensal').all();
  }

  buscarPorId(id) {
    return db.prepare('SELECT * FROM planos WHERE id = ?').get(id);
  }

  criar(plano) {
    const info = db.prepare(`
      INSERT INTO planos (nome, descricao, valor_mensal, duracao_meses, ativo)
      VALUES (?, ?, ?, ?, ?)
    `).run(plano.nome, plano.descricao, plano.valor_mensal, plano.duracao_meses, plano.ativo ? 1 : 0);
    return this.buscarPorId(info.lastInsertRowid);
  }

  atualizar(id, plano) {
    db.prepare(`
      UPDATE planos SET nome = ?, descricao = ?, valor_mensal = ?, duracao_meses = ?, ativo = ?
      WHERE id = ?
    `).run(plano.nome, plano.descricao, plano.valor_mensal, plano.duracao_meses, plano.ativo ? 1 : 0, id);
    return this.buscarPorId(id);
  }

  remover(id) {
    return db.prepare('DELETE FROM planos WHERE id = ?').run(id);
  }
}

module.exports = new PlanoRepository();
