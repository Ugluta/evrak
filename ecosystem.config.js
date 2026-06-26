module.exports = {
  apps: [{
    name: '2eevrak',
    script: 'node_modules/.bin/next',
    args: 'start --port 3030',
    cwd: './',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'production',
      PORT: 3030,
      AUTH_TRUST_HOST: 'true',
    },
  }],
}
