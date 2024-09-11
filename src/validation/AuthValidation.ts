import Joi from 'joi';

export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Formato de e-mail inválido.',
        'any.required': 'O e-mail é obrigatório.',
      }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'A senha deve ter pelo menos 6 caracteres.',
        'any.required': 'A senha é obrigatória.',
    }),
});