// config/database.js
// Wrapper sobre sql.js que expõe a mesma API do better-sqlite3
// (db.prepare(sql).run/get/all e db.exec) e persiste em arquivo a cada escrita.
// Usamos sql.js porque ele é puro JavaScript (não precisa compilar código nativo).
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '..', 'database', 'academia.db');
if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

let rawDb;
let dirty = false;
let saveTimer = null;

function persistir() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    if (dirty) {
      const data = rawDb.export();
      fs.writeFileSync(dbPath, Buffer.from(data));
      dirty = false;
    }
    saveTimer = null;
  }, 100);
}

// Helper: sql.js não aceita 'undefined' no bind, só 'null'
function sanitize(params) {
  const flat = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
  return flat.map(v => v === undefined ? null : v);
}

// API estilo better-sqlite3
const db = {
  prepare(sql) {
    return {
      run(...params) {
        const stmt = rawDb.prepare(sql);
        try {
          stmt.bind(sanitize(params));
          stmt.step();
        } finally {
          stmt.free();
        }
        dirty = true;
        persistir();
        const res = rawDb.exec("SELECT last_insert_rowid() AS id, changes() AS ch");
        const row = res[0]?.values?.[0] || [0, 0];
        return { lastInsertRowid: row[0], changes: row[1] };
      },
      get(...params) {
        const stmt = rawDb.prepare(sql);
        let result;
        try {
          stmt.bind(sanitize(params));
          if (stmt.step()) result = stmt.getAsObject();
        } finally {
          stmt.free();
        }
        return result;
      },
      all(...params) {
        const stmt = rawDb.prepare(sql);
        const rows = [];
        try {
          stmt.bind(sanitize(params));
          while (stmt.step()) rows.push(stmt.getAsObject());
        } finally {
          stmt.free();
        }
        return rows;
      }
    };
  },
  exec(sql) {
    rawDb.exec(sql);
    dirty = true;
    persistir();
  },
  pragma(p) {
    rawDb.exec(`PRAGMA ${p}`);
  }
};

async function inicializar() {
  const wasmPath = require.resolve('sql.js/dist/sql-wasm.wasm');
  const wasmBinary = fs.readFileSync(wasmPath);
  const SQL = await initSqlJs({ wasmBinary });

  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    rawDb = new SQL.Database(fileBuffer);
  } else {
    rawDb = new SQL.Database();
  }

  rawDb.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL,
      perfil TEXT NOT NULL CHECK (perfil IN ('ADMIN','RECEPCAO')),
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS planos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT,
      valor_mensal REAL NOT NULL,
      duracao_meses INTEGER NOT NULL DEFAULT 1,
      ativo INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS alunos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      cpf TEXT NOT NULL UNIQUE,
      email TEXT,
      telefone TEXT,
      data_nascimento TEXT,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS matriculas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      aluno_id INTEGER NOT NULL,
      plano_id INTEGER NOT NULL,
      data_inicio TEXT NOT NULL,
      data_fim TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'ATIVA' CHECK (status IN ('ATIVA','ENCERRADA','CANCELADA')),
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
      FOREIGN KEY (plano_id) REFERENCES planos(id)
    );

    CREATE TABLE IF NOT EXISTS frequencia (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      aluno_id INTEGER NOT NULL,
      data_entrada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE
    );
  `);

  // Seed inicial (apenas se vazio)
  const totalUsuarios = db.prepare('SELECT COUNT(*) AS qtd FROM usuarios').get().qtd;
  if (totalUsuarios === 0) {
    const hashAdmin = bcrypt.hashSync('admin123', 10);
    const hashRec = bcrypt.hashSync('recepcao123', 10);
    db.prepare(`INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?,?,?,?)`)
      .run('Diva!', 'admin@academia.com', hashAdmin, 'ADMIN');
    db.prepare(`INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?,?,?,?)`)
      .run('Diva!', 'recepcao@academia.com', hashRec, 'RECEPCAO');
  }

  const totalPlanos = db.prepare('SELECT COUNT(*) AS qtd FROM planos').get().qtd;
  if (totalPlanos === 0) {
    const stmt = db.prepare(`INSERT INTO planos (nome, descricao, valor_mensal, duracao_meses, ativo) VALUES (?,?,?,?,1)`);
    stmt.run('Mensal', 'Acesso livre por 1 mês', 99.90, 1);
    stmt.run('Trimestral', 'Acesso livre por 3 meses', 89.90, 3);
    stmt.run('Anual', 'Acesso livre por 12 meses', 69.90, 12);
  }

  // Salva imediatamente após o seed
  const data = rawDb.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
}

module.exports = db;
module.exports.inicializar = inicializar;