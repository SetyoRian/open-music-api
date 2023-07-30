const ClientError = require('../../errors/ClientError');
const { CoverHeaderSchema } = require('./schema');

const UploadsValidator = {
  validateCoverPayload: (headers) => {
    const validationResult = CoverHeaderSchema.validate(headers);

    if (validationResult.error) {
      throw new ClientError(validationResult.error.message);
    }
  },
};

module.exports = UploadsValidator;
