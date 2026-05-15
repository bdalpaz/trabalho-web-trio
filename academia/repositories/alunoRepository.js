// repositories/alunoRepository.js
const db = require('../config/database');

class AlunoRepository {
  listar(filtroNome = '') {
    if (filtroNome) {
      return db.prepare('SELECT * FROM alunos WHERE nome LIKE ? ORDER BY nome')
        .all(`%${filtroNome}%`);
    }
    return db.prepare('SELECT * FROM alunos ORDER BY nome').all();
  }

  buscarPorId(id) {
    return db.prepare('SELECT * FROM alunos WHERE id = ?').get(id);
  }

  buscarPorCpf(cpf) {
    return db.prepare('SELECT * FROM alunos WHERE cpf = ?').get(cpf);
  }

  criar(aluno) {
    const stmt = db.prepare(`
      INSERT INTO alunos (nome, cpf, email, telefone, data_nascimento)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(aluno.nome, aluno.cpf, aluno.email, aluno.telefone, aluno.data_nascimento);
    return this.buscarPorId(info.lastInsertRowid);
  }

  atualizar(id, aluno) {
    db.prepare(`
      UPDATE alunos SET nome = ?, cpf = ?, email = ?, telefone = ?, data_nascimento = ?
      WHERE id = ?
    `).run(aluno.nome, aluno.cpf, aluno.email, aluno.telefone, aluno.data_nascimento, id);
    return this.buscarPorId(id);
  }

  remover(id) {
    return db.prepare('DELETE FROM alunos WHERE id = ?').run(id);
  }
}

module.exports = new AlunoRepository();