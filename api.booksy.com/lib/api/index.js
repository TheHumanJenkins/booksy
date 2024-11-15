'user strict';

const register = async (server, options) => {
  const preResponse = (request, h) => {
    let response = request.response;

    if (response.isBoom) {
      const reformated = { errors: {} };
      reformated.errors[response.output.statusCode] = [
        response.output.payload.message
      ];
      return h.response(reformated).code(response.output.statusCode);
    }

    return h.continue;
  };

  const onRequest = (request, h) => {
    return h.continue;
  };

  await server.register(require('./organizations'));

  server.ext('onRequest', onRequest);
  server.ext('onPreResponse', preResponse);

  server.route({
    method: 'GET',
    path: '/status',
    config: {
      description: 'Status endpoint',
      notes: 'Return the current status of the API',
      tags: ['api', 'status']
    },
    handler: (request, h) => {
      return { status: 'UP' };
    }
  });
};

const plugin = {
  register,
  pkg: require('./package.json')
};

module.exports = plugin;
