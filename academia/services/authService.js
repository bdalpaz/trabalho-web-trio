const bcrypt = require('bcryptjs');
const usuarioRepository = require('../repositories/usuarioRepository');

class AuthService {
  async autenticar(email, senha) {
    if (!email || !senha) {
      throw new Error('Informe e-mail e senha.');
    }
    const usuario = usuarioRepository.buscarPorEmail(email);
    if (!usuario) {
      throw new Error('E-mail ou senha incorretos.');
    }
    const ok = bcrypt.compareSync(senha, usuario.senha);
    if (!ok) {
      throw new Error('E-mail ou senha incorretos.');
    }
    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil
    };
  }
}

module.exports = new AuthService();
