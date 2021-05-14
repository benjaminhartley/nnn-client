import Joi from 'joi';

export * from './UserSchema';

export const validationOptions: Joi.ValidationOptions = {
  abortEarly: false,
  stripUnknown: true,
};
