module.exports = (server, gusto) => {
  const handlers = require('./handlers')(server, gusto);
  return [
    {
      method: 'POST',
      path: '/organizations/payroll',
      options: {
        auth: false,
        description: 'Creates an Organization Embedded Payroll',
        tags: ['api', 'organizations']
      },
      handler: handlers.createEmbeddedPayroll
    }
  ];
};
