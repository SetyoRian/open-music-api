require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');
const config = require('./utils/config');

// Music
const openMusic = require('./api/music');
const MusicService = require('./service/MusicService');
const MusicValidator = require('./validator/music');

// Playlist
const playlists = require('./api/playlists');
const PlaylistService = require('./service/PlaylistsService');
const PlaylistValidator = require('./validator/playlists');

// User
const users = require('./api/users');
const UsersService = require('./service/UsersService');
const UsersValidator = require('./validator/user');

// Authentications
const authentications = require('./api/authentication');
const AuthenticationsService = require('./service/AuthenticationService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// Collaborations
const collaborations = require('./api/collaboration');
const CollaborationService = require('./service/CollaborationsService');
const collaborationValidator = require('./validator/collaborations');

// Exports
const _exports = require('./api/exports');
const ProducerService = require('./service/ProducerService');
const ExportsValidator = require('./validator/exports');

// uploads
const uploads = require('./api/uploads');
const StorageService = require('./service/StorageService');
const UploadsValidator = require('./validator/uploads');

// cache
const CacheService = require('./service/CacheService');

const init = async () => {
  const cacheService = new CacheService();
  const musicService = new MusicService(cacheService);
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationService = new CollaborationService();
  const playlistService = new PlaylistService(collaborationService);
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));

  const server = Hapi.server({
    port: config.app.port,
    host: config.app.host,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: openMusic,
      options: {
        service: musicService,
        validator: MusicValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistService,
        validator: PlaylistValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        service: collaborationService,
        playlistService,
        validator: collaborationValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        playlistService,
        validator: ExportsValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        validator: UploadsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
