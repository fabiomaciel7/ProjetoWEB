"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.updateTaskSchema = joi_1.default.object({
    title: joi_1.default.string().min(1).optional().messages({
        'string.base': 'O titulo deve ser um texto.',
        'string.min': 'O titulo deve ter pelo menos 1 caractere.',
        'any.required': 'O titulo é obrigatório.',
    }),
    description: joi_1.default.string().optional().messages({
        'string.base': 'A descrição deve ser um texto.',
    }),
    completed: joi_1.default.boolean().optional().messages({
        'boolean.base': 'O campo deve ser um valor booleano.',
    }),
    dueDate: joi_1.default.date().optional().messages({
        'date.base': 'A data de expiração não está no formato correto'
    }),
    userId: joi_1.default.number().optional().messages({
        'number.base': 'O id do usuário não está no formato correto'
    }),
});
