import Joi from 'joi';

export const createUserSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    'string.base': 'O nome deve ser um texto.',
    'string.min': 'O nome deve ter pelo menos 3 caracteres.',
    'any.required': 'O nome é obrigatório.',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Formato de e-mail inválido.',
    'any.required': 'O e-mail é obrigatório.',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'A senha deve ter pelo menos 6 caracteres.',
    'any.required': 'A senha é obrigatória.',
  }),
  isAdmin: Joi.boolean().optional().messages({
    'boolean.base': 'Formato de dado inválido para isAdmin'
  }),
});
