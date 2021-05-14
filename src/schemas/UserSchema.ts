import Joi from 'joi';

export const UserSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().optional(),
  rawAmount: Joi.string().required(),
  depositAddress: Joi.string().optional(),
  createdAt: Joi.string().required(),
});
