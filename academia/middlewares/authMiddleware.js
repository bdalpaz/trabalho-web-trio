function requerLogin(req, res, next) {
  if (!req.session || !req.session.usuario) {
    return res.redirect('/login');
  }
  res.locals.usuarioLogado = req.session.usuario;
  next();
}

function requerPerfil(...perfisPermitidos) {
  return (req, res, next) => {
    if (!req.session || !req.session.usuario) {
      return res.redirect('/login');
    }
    const perfil = req.session.usuario.perfil;
    if (!perfisPermitidos.includes(perfil)) {
      return res.status(403).render('auth/acessoNegado', {
        usuarioLogado: req.session.usuario,
        perfisPermitidos
      });
    }
    next();
  };
}

function injetarLocals(req, res, next) {
  res.locals.usuarioLogado = req.session?.usuario || null;
  res.locals.mensagem = req.session?.mensagem || null;
  res.locals.erro = req.session?.erro || null;
  if (req.session) {
    req.session.mensagem = null;
    req.session.erro = null;
  }
  next();
}

module.exports = { requerLogin, requerPerfil, injetarLocals };
