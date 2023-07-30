const Joi = require('joi');

const CoverHeaderSchema = Joi.object({
  'content-type': Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp', 'image/jpg').required(),
}).unknown();

module.exports = { CoverHeaderSchema };
