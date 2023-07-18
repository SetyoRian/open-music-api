require('dotenv').config();

const Hapi = require('@hapi/hapi');
const openMusic = require('./api');
const MusicService = require('./service/MusicService');
const musicValidator = require('./validator');

const init = async () => {
  const musicService = new MusicService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: openMusic,
    options: {
      service: musicService,
      validator: musicValidator,
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
