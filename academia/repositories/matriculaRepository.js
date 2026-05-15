// repositories/matriculaRepository.js
const db = require('../config/database');

class MatriculaRepository {
  listar() {
    return db.prepare(`
      SELECT m.*, a.nome AS aluno_nome, a.cpf AS aluno_cpf,
             p.nome AS plano_nome, p.valor_mensal
      FROM matriculas m
      JOIN alunos a ON a.id = m.aluno_id
      JOIN planos p ON p.id = m.plano_id
      ORDER BY m.criado_em DESC
    `).all();
  }

  buscarPorId(id) {
    return db.prepare(`
      SELECT m.*, a.nome AS aluno_nome, p.nome AS plano_nome, p.valor_mensal
      FROM matriculas m
      JOIN alunos a ON a.id = m.aluno_id
      JOIN planos p ON p.id = m.plano_id
      WHERE m.id = ?
    `).get(id);
  }

  buscarAtivaPorAluno(alunoId) {
    return db.prepare(`
      SELECT * FROM matriculas
      WHERE aluno_id = ? AND status = 'ATIVA'
      AND date(data_fim) >= date('now')
    `).get(alunoId);
  }

  criar(matricula) {
    const info = db.prepare(`
      INSERT INTO matriculas (aluno_id, plano_id, data_inicio, data_fim, status)
      VALUES (?, ?, ?, ?, 'ATIVA')
    `).run(matricula.aluno_id, matricula.plano_id, matricula.data_inicio, matricula.data_fim);
    return this.buscarPorId(info.lastInsertRowid);
  }

  cancelar(id) {
    return db.prepare("UPDATE matriculas SET status = 'CANCELADA' WHERE id = ?").run(id);
  }

  remover(id) {
    return db.prepare('DELETE FROM matriculas WHERE id = ?').run(id);
  }
}

module.exports = new MatriculaRepository();