const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const PORT = process.env.PORT || 3000;

// Config Target Service
const SERVICE_PUBLIC = 'http://127.0.0.1:3001';
const SERVICE_ADMIN  = 'http://127.0.0.1:3002';

console.log(`Gateway starting on port ${PORT}...`);

// Middleware Logika Routing
app.use((req, res, next) => {
    const host = req.hostname; // misal: admin.hamzidan.com
    const subdomain = host.split('.')[0];
    
    // Log request masuk (berguna untuk debug di STB)
    console.log(`[GATEWAY] Incoming: ${host} -> Sub: ${subdomain}`);

    // 1. Arahkan ke ADMIN Service
    if (subdomain === 'admin') {
        return createProxyMiddleware({ 
            target: SERVICE_ADMIN, 
            changeOrigin: true,
            ws: true 
        })(req, res, next);
    }

    // 2. Arahkan sisanya ke PUBLIC Service
    // Kita titip header 'x-subdomain' agar Public Service tahu dia diakses via apa
    req.headers['x-subdomain'] = subdomain;
    
    return createProxyMiddleware({ 
        target: SERVICE_PUBLIC, 
        changeOrigin: true
    })(req, res, next);
});

app.listen(PORT, () => {
    console.log(`🚀 Gateway is running on port ${PORT}`);
});
