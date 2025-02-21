require('dotenv').config({ path: '.env.deploy' });

module.exports = {
  apps: [
    {
      name: 'api',
      script: 'backend/dist/index.js', // Путь к собранному файлу бэкенда
      cwd: './backend',                // Рабочая директория для бэкенда
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
    // Фронтенд не требует процесса в PM2, так как обслуживается Nginx
  ],
  deploy: {
    production: {
      user: process.env.USERNAME,
      host: process.env.SERVER_ADDRESS.split('@')[1],
      ref: 'origin/main',
      repo: process.env.REPO_URL,
      path: process.env.DEPLOY_PATH,
      'pre-deploy-local': 'scp backend/.env ${SERVER_ADDRESS}:${DEPLOY_PATH}/source/backend/.env',
      'post-deploy': [
        'cd frontend && npm install && npm run build', // Сборка фронтенда
        'cd backend && npm install && npm run build',  // Сборка бэкенда (если нужна)
        'pm2 reload ecosystem.config.json --env production', // Перезапуск бэкенда
      ].join(' && '),
    },
  },
};
