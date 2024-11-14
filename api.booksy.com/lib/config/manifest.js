const { plugin } = require('@hapi/inert');

const manifest = {
  server: {
    debug: { request: ['error'] }, // TODO: remove in production
    host: 'localhost',
    port: process.env.PORT || 3001,
    routes: {
      cors: false
    }
  },
  register: {
    plugins: [
      { plugin: 'blipp' },
      { plugin: '@hapi/inert' },
      { plugin: '@hapi/vision' },
      { plugin: './api' }
    ]
  }
};

module.exports = manifest;
