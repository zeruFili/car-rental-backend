const joi = require('joi');
const envVarSchema = require('../validations/env.validation');

const { value: envVars, error } = envVarSchema.validate(process.env);

if (error) {
  logger.error(error);
  process.exit(1);
}

module.exports = {
  port: envVars.PORT,
  dbConnection: envVars.DB_CONNECTION, 
  env: envVars.NODE_ENV
};