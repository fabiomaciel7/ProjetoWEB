"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createUserSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Formato de e-mail inválido.',
        'any.required': 'O e-mail é obrigatório.',
    }),
    password: joi_1.default.string().min(6).required().messages({
        'string.min': 'A senha deve ter pelo menos 6 caracteres.',
        'any.required': 'A senha é obrigatória.',
    }),
});
