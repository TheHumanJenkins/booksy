const Routes = require('./routes');

const GustoClient = require('../../client');

const register = async (server, options) => {
  const gusto = new GustoClient();
  await gusto.authorize();

  server.route(Routes(server, gusto));
};

const plugin = {
  register,
  pkg: require('./package.json')
};

module.exports = plugin;
