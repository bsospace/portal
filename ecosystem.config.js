module.exports = {
  apps: [
    {
      name: 'bsospace-portal',
      script: './node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      exec_mode: 'cluster',
      instances: 'max',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
