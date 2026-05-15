// repositories/usuarioRepository.js
// Camada de acesso a dados. Só conversa com o banco. Não tem regra de negócio.
const db = require('../config/database');

class UsuarioRepository {
  buscarPorEmail(email) {
    return db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
  }

  buscarPorId(id) {
    return db.prepare('SELECT id, nome, email, perfil, criado_em FROM usuarios WHERE id = ?').get(id);
  }

  listar() {
    return db.prepare('SELECT id, nome, email, perfil, criado_em FROM usuarios ORDER BY nome').all();
  }
}

module.exports = new UsuarioRepository();   