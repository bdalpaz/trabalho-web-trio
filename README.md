# 🏋️ Sistema de Controle de Academia

Sistema web funcional para gerenciamento de uma academia, desenvolvido como atividade prática de arquitetura de software em camadas.

## 🏗️ Arquitetura

O projeto utiliza **arquitetura em camadas (Controller → Service → Repository)**:

```
ROUTES → CONTROLLERS → SERVICES → REPOSITORIES → DATABASE (SQLite)
```

- **Routes** — definem URLs e aplicam middlewares de autenticação/permissão
- **Controllers** — recebem a requisição HTTP, chamam o service e renderizam a view
- **Services** — onde mora a lógica de negócio (validações, regras)
- **Repositories** — única camada que conversa com o banco

## ✅ Requisitos atendidos

| Requisito | Implementação |
|---|---|
| Arquitetura Controller → Service → Repository | Estrutura completa de pastas |
| Autenticação login/senha | `services/authService.js` + bcryptjs |
| Controle de sessão | express-session em `server.js` |
| Permissionamento por perfil | `middlewares/authMiddleware.js` |
| Banco de dados | SQLite (sql.js) |
| 2 perfis | ADMIN e RECEPCAO |
| CRUD completo | Alunos, Planos e Matrículas |
| Regra de negócio | Matrícula duplicada bloqueada |

## 🔐 Perfis e permissões

| Funcionalidade | ADMIN | RECEPCAO |
|---|:-:|:-:|
| Ver dashboard | ✅ | ✅ |
| CRUD alunos | ✅ | parcial (sem excluir) |
| Gerenciar planos | ✅ | ❌ (403) |
| Criar/cancelar matrículas | ✅ | ✅ |
| Liberar catraca | ✅ | ✅ |

## 📐 Regra de negócio principal

**Um aluno não pode ter mais de uma matrícula ATIVA vigente ao mesmo tempo.**

Implementada em `services/matriculaService.js`:

```javascript
const matriculaAtiva = matriculaRepository.buscarAtivaPorAluno(alunoId);
if (matriculaAtiva) {
  throw new Error('Este aluno já possui uma matrícula ativa e vigente.');
}
```

## 🚀 Como rodar

```bash
cd academia
npm install
npm start
# abre em http://localhost:3000
```

### Contas de demonstração

| Perfil | E-mail | Senha |
|---|---|---|
| ADMIN | admin@academia.com | admin123 |
| RECEPÇÃO | recepcao@academia.com | recepcao123 |

## 🎬 Roteiro de apresentação

1. Mostrar a estrutura de pastas (Controller → Service → Repository)
2. Login como recepção → tentar /planos → tela de acesso negado
3. Logout → login como admin → mostrar menu completo
4. CRUD de alunos — cadastrar, editar, buscar
5. Tentar cadastrar 2 alunos com mesmo CPF → bloqueio
6. Criar matrícula para o aluno
7. **Tentar criar outra matrícula para o mesmo aluno → REGRA DE NEGÓCIO PRINCIPAL bloqueando**
8. Catraca → liberar CPF cadastrado
9. Catraca → tentar CPF sem matrícula → bloqueio
10. Abrir `matriculaService.js` e mostrar a regra no service

## 🛠️ Tecnologias

- Node.js + Express
- EJS
- SQLite via sql.js
- bcryptjs
- express-session
- method-override

## 👥 Integrantes

- [Alice Botton Dal Paz]
- [Anthony Guilherme Cazuni da Silva]
- [Gabriel Henrique Robette Ferri]