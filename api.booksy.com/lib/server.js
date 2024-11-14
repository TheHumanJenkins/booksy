'user strict';

const Glue = require('@hapi/glue');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

const manifest = require('./config/manifest');

var options = {
  relativeTo: process.cwd() + '/lib'
};

exports.deployment = async function () {
  try {
    const server = await Glue.compose(manifest, options);

    await server.initialize();

    await server.start();

    server.events.on('response', function (request) {
      console.log(request.info.remoteAddress + ': ' + request.method.toUpperCase() + ' ' + request.path + ' --> ' + request.response.statusCode);
    });

    console.log(
      ['info'],
      `Server successfully started on port: ${process.env.PORT}.... `
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (module.parent) {
  exports.deployment().catch(console.error);
}
