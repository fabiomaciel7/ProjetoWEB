"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.updateUserSchema = joi_1.default.object({
    name: joi_1.default.string().min(3).optional().messages({
        'string.base': 'O nome deve ser um texto.',
        'string.min': 'O nome deve ter pelo menos 3 caracteres.',
    }),
    email: joi_1.default.string().email().optional().messages({
        'string.email': 'Formato de e-mail inválido.',
    }),
    password: joi_1.default.string().min(6).optional().messages({
        'string.min': 'A senha deve ter pelo menos 6 caracteres.',
    }),
});
