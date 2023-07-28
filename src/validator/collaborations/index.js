const ClientError = require('../../errors/ClientError');
const { CollaborationsPayloadSchema } = require('./schema');

const MusicValidator = {
  validateCollaborationsSchema: (payload) => {
    const validationResult = CollaborationsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new ClientError(validationResult.error.message);
    }
  },
};

module.exports = MusicValidator;
