const ExportNotesPayloadSchema = require('./schema');
const ClientError = require('../../errors/ClientError');

const ExportsValidator = {
  validateExportNotesPayload: (payload) => {
    const validationResult = ExportNotesPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new ClientError(validationResult.error.message);
    }
  },
};

module.exports = ExportsValidator;
