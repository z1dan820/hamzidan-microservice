const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');
const session = require('express-session');
const app = express();

const PORT = process.env.PORT || 3002;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session Config (Simpan di memory dulu biar simpel)
app.use(session({
    secret: 'rahasia_negara_stb',
    resave: false,
    saveUninitialized: false
}));

// Koneksi Database (Read-Write)
const dbPath = path.resolve(__dirname, '../../database/content.db');
let db;

// Coba konek, kalau gagal berarti belum di-init
try {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL'); // Biar aman diakses bareng Public Service
} catch (err) {
    console.error("Gagal konek DB. Jalankan script database/init.js dulu!");
}

// Routes Sederhana
app.get('/', (req, res) => {
    // Cek status DB
    if (!db) return res.send("ERROR: Database belum dibuat. Cek terminal.");
    
    res.send(`
        <h1>Admin Dashboard</h1>
        <p>Status: Online di Port ${PORT}</p>
        <hr>
        <h3>Tambah Portfolio Cepat</h3>
        <form action="/create" method="POST">
            <input type="text" name="title" placeholder="Judul Project" required><br>
            <input type="text" name="slug" placeholder="slug-project" required><br>
            <textarea name="content" placeholder="Deskripsi..."></textarea><br>
            <button type="submit">Simpan</button>
        </form>
    `);
});

app.post('/create', (req, res) => {
    const { title, slug, content } = req.body;
    try {
        const stmt = db.prepare('INSERT INTO portfolios (title, slug, content) VALUES (?, ?, ?)');
        stmt.run(title, slug, content);
        res.send(`Sukses! Coba buka: <a href="http://${slug}.hamzidan.com" target="_blank">${slug}.hamzidan.com</a>`);
    } catch (e) {
        res.send(`Gagal: ${e.message}`);
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Admin Service running on port ${PORT}`);
});
         
