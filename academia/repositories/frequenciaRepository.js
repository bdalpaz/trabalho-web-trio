const db = require('../config/database');

class FrequenciaRepository {
  registrar(alunoId) {
    const info = db.prepare('INSERT INTO frequencia (aluno_id) VALUES (?)').run(alunoId);
    return info.lastInsertRowid;
  }

  listarRecentes(limite = 50) {
    return db.prepare(`
      SELECT f.id, f.data_entrada, a.nome AS aluno_nome, a.cpf AS aluno_cpf
      FROM frequencia f
      JOIN alunos a ON a.id = f.aluno_id
      ORDER BY f.data_entrada DESC
      LIMIT ?
    `).all(limite);
  }

  contarHoje() {
    return db.prepare(`
      SELECT COUNT(*) AS qtd FROM frequencia
      WHERE date(data_entrada) = date('now')
    `).get().qtd;
  }

  listarPorAluno(alunoId) {
    return db.prepare(`
      SELECT * FROM frequencia
      WHERE aluno_id = ?
      ORDER BY data_entrada DESC
      LIMIT 100
    `).all(alunoId);
  }
}

module.exports = new FrequenciaRepository();
