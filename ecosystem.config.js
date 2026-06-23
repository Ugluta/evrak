module.exports = {
  apps: [{
    name: '2edokuman',
    script: 'node_modules/.bin/next',
    args: 'start --port 3001',
    cwd: './',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
    },
  }],
}
