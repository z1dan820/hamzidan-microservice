module.exports = {
  apps : [
    {
      name: "Gateway",
      script: "./services/gateway/index.js",
      watch: false,
      env: { NODE_ENV: "production", PORT: 3000 }
    },
    {
      name: "Public",
      script: "./services/public/index.js",
      watch: true,
      env: { NODE_ENV: "production", PORT: 3001 }
    },
    {
      name: "Admin",
      script: "./services/admin/index.js",
      watch: true,
      env: { NODE_ENV: "production", PORT: 3002 }
    }
  ]
}
