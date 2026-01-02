const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');
const app = express();

const PORT = process.env.PORT || 3001;

// Setup View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Koneksi Database (Read-Only untuk performa)
// Catatan: File DB ini nanti kita buat di root folder
const dbPath = path.resolve(__dirname, '../../database/content.db');
let db;

try {
    db = new Database(dbPath, { readonly: true, fileMustExist: true });
} catch (err) {
    console.warn("⚠️ Database belum ada atau belum di-init. Mode Darurat.");
    db = null;
}

// Routes
app.get('/', (req, res) => {
    // Ambil subdomain yang dikirim Gateway
    const subdomain = req.headers['x-subdomain'] || 'www';
    
    console.log(`[PUBLIC] Serving for subdomain: ${subdomain}`);

    // LOGIC 1: Homepage Utama
    if (subdomain === 'www' || subdomain === 'hamzidan') {
        return res.render('home', { 
            title: 'Hamzidan | Full-Stack Engineer',
            subdomain: subdomain
        });
    }

    // LOGIC 2: Portfolio Dinamis
    // Jika DB belum ada, tampilkan 404 dulu
    if (!db) return res.status(404).send("Portfolio Not Found (DB Error)");

    const portfolio = db.prepare('SELECT * FROM portfolios WHERE slug = ?').get(subdomain);

    if (portfolio) {
        return res.render('portfolio', { 
            data: portfolio,
            title: portfolio.title 
        });
    }

    return res.status(404).send(`Halaman portfolio '${subdomain}' tidak ditemukan.`);
});

app.listen(PORT, () => {
    console.log(`🚀 Public Service running on port ${PORT}`);
});
