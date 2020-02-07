module.exports = {
  apps : [{
    name: 'Server',
    interpreter: './node_modules/.bin/ts-node',
    cwd: './',
    script: 'src/main.ts',
    instances: 1,
    autorestart: true,
    watch: ['./**/*'],
    ignore_watch: ['[\/\\]\./', 'node_modules'],
    watch_options: {
      "usePolling": true
    },
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
