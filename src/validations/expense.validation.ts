import Joi from 'joi';

export const createExpenseSchema = Joi.object({
  userId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  category: Joi.string().required(),
  description: Joi.string().allow('', null),
  date: Joi.string().required(),
});

export const updateExpenseStatusSchema = Joi.object({
  status: Joi.string().valid('approved', 'rejected').required(),
});