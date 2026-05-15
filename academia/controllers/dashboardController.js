// controllers/dashboardController.js
const alunoService = require('../services/alunoService');
const planoService = require('../services/planoService');
const matriculaService = require('../services/matriculaService');
const frequenciaService = require('../services/frequenciaService');

class DashboardController {
  index(req, res) {
    const alunos = alunoService.listar();
    const planos = planoService.listar();
    const matriculas = matriculaService.listar();
    const matriculasAtivas = matriculas.filter(m => m.status === 'ATIVA');
    const frequenciaHoje = frequenciaService.totalHoje();

    res.render('dashboard/index', {
      stats: {
        totalAlunos: alunos.length,
        totalPlanos: planos.length,
        matriculasAtivas: matriculasAtivas.length,
        frequenciaHoje
      },
      ultimasMatriculas: matriculas.slice(0, 5)
    });
  }
}

module.exports = new DashboardController();