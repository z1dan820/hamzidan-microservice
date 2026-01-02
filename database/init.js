const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Pastikan folder database ada
const dbFolder = path.join(__dirname);
if (!fs.existsSync(dbFolder)){
    fs.mkdirSync(dbFolder);
}

const dbPath = path.join(dbFolder, 'content.db');
console.log(`🔨 Membuat database di: ${dbPath}`);

const db = new Database(dbPath);

// 1. Tabel Users
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )
`);

// 2. Tabel Portfolios (Inti Subdomain)
db.exec(`
  CREATE TABLE IF NOT EXISTS portfolios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log("✅ Database berhasil dibuat & Tabel siap!");
console.log("Sekarang jalankan: pm2 start ecosystem.config.js");
