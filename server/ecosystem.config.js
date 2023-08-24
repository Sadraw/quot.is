module.exports = {
  apps: [
    {
      name: 'quot.is',
      script: 'server.js',
      watch: true,
      ignore_watch: ['node_modules'],
      autorestart: true,
      max_restarts: 10,
      instances: 1,
      exec_mode: 'cluster',
      merge_logs: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
