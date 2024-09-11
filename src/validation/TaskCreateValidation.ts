import Joi from 'joi';

export const createTaskSchema = Joi.object({
  title: Joi.string().min(1).required().messages({
    'string.base': 'O titulo deve ser um texto.',
    'string.min': 'O titulo deve ter pelo menos 1 caractere.',
    'any.required': 'O titulo é obrigatório.',
  }),
  description: Joi.string().optional().messages({
    'string.base': 'A descrição deve ser um texto.',
  }),
  completed: Joi.boolean().optional().messages({
    'boolean.base': 'O campo deve ser um valor booleano.',
  }),
  dueDate: Joi.date().optional().messages({
    'date.base':'A data de expiração não está no formato correto'
  }),
  userId: Joi.number().optional().messages({
    'number.base':'O id do usuário não está no formato correto'
  }),
});
