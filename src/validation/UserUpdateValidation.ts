import Joi from 'joi';

export const updateUserSchema = Joi.object({
  name: Joi.string().min(3).optional().messages({
    'string.base': 'O nome deve ser um texto.',
    'string.min': 'O nome deve ter pelo menos 3 caracteres.',
  }),
  email: Joi.string().email().optional().messages({
    'string.email': 'Formato de e-mail inválido.',
  }),
  password: Joi.string().min(6).optional().messages({
    'string.min': 'A senha deve ter pelo menos 6 caracteres.',
 }),
});
