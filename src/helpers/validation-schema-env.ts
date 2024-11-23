import { Logger } from '@nestjs/common';
import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true, useDefaults: true });

const schema = {
  type: 'object',
  properties: {
    DB_HOST: { type: 'string' },
    DB_PORT: { type: 'string' },
    DB_USER: { type: 'string' },
    DB_PW: { type: 'string' },
    DB_NAME: { type: 'string' },
  },
  required: [
    "DB_HOST",
    "DB_PORT",
    "DB_USER",
    "DB_PW",
    "DB_NAME",
  ],
};

const validate = ajv.compile(schema);

export const validateSchemaEnv = (env: unknown) => {
  const valid = validate(env);
  if (!valid) {
    const errorMessages = validate.errors
      .map((err) => ` Property${err.instancePath} ${err.message}`)
      .join(', ');
    Logger.error(
      `Environment validation error:${errorMessages}`,
      'EnvValidation',
    );
  }
  return env;
};
