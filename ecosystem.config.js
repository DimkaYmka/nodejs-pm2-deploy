require('dotenv').config({ path: '.env.deploy' });

module.exports = {
  apps: [
    {
      name: 'api',
      script: 'backend/dist/index.js',
      cwd: './backend',
      instances: 1,
      autorestart: true,
      watch: false,
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
  deploy: {
    production: {
      user: process.env.USERNAME,
      host: process.env.SERVER_ADDRESS.split('@')[1],
      ref: 'origin/master',
      repo: process.env.REPO_URL,
      path: process.env.DEPLOY_PATH,
      'pre-deploy-local': `ssh ${process.env.SERVER_ADDRESS} "mkdir -p ${process.env.DEPLOY_PATH}/backend ${process.env.DEPLOY_PATH}/frontend" && scp backend/.env ${process.env.SERVER_ADDRESS}:${process.env.DEPLOY_PATH}/backend/.env`,
      'post-deploy': [
        // Переход к директориям с полными путями
        `cd ${process.env.DEPLOY_PATH}/frontend && npm install && npm run build`,
        `cd ${process.env.DEPLOY_PATH}/backend && npm install && npm run build`,
        'pm2 reload ecosystem.config.js --update-env',
      ].join(' && '),
    },
  },
};