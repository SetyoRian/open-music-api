const ClientError = require('../../errors/ClientError');

class CollaborationsHandler {
  constructor(service, playlistService, validator) {
    this._service = service;
    this._validator = validator;
    this._playlistService = playlistService;
  }

  async postCollaboration(request, h) {
    try {
      this._validator.validateCollaborationsSchema(request.payload);
      const { playlistId, userId } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
      const collaborationId = await this._service.addCollaborator(playlistId, userId);

      const response = h.response({
        status: 'success',
        data: {
          collaborationId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteCollaboration(request, h) {
    try {
      this._validator.validateCollaborationsSchema(request.payload);
      const { playlistId, userId } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
      await this._service.deleteCollaborator({ playlistId, userId });

      const response = h.response({
        status: 'success',
        message: 'Berhasil menghapus collaborator dari Playlist',
      });
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = CollaborationsHandler;
