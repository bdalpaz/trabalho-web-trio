// controllers/authController.js
const authService = require('../services/authService');

class AuthController {
  mostrarLogin(req, res) {
    if (req.session.usuario) return res.redirect('/dashboard');
    res.render('auth/login', { erro: null });
  }

  async login(req, res) {
    try {
      const { email, senha } = req.body;
      const usuario = await authService.autenticar(email, senha);
      req.session.usuario = usuario;
      req.session.mensagem = `Bem-vindo(a), ${usuario.nome}!`;
      res.redirect('/dashboard');
    } catch (err) {
      res.render('auth/login', { erro: err.message });
    }
  }

  logout(req, res) {
    req.session.destroy(() => res.redirect('/login'));
  }
}

module.exports = new AuthController();