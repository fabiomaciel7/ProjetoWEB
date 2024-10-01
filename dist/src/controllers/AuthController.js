"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const AuthService_1 = require("../services/AuthService");
const AuthValidation_1 = require("../validation/AuthValidation");
class AuthController {
    constructor() {
        this.authService = new AuthService_1.AuthService();
    }
    login(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error, value } = AuthValidation_1.loginSchema.validate(request.body, { abortEarly: false });
                if (error) {
                    return response.status(400).json({
                        message: 'Erro de validação',
                        details: error.details.map(detail => detail.message),
                    });
                }
                const { email, password } = request.body;
                const result = yield this.authService.login(email, password);
                if (result.success) {
                    return response.json({ message: 'Login realizado com sucesso!', token: result.token, id: result.id });
                }
                else {
                    return response.status(401).json({ message: 'Credenciais Inválidas' });
                }
            }
            catch (error) {
                console.error('Error during login:', error);
                return response.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
    logout(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authorizationHeader = request.headers['authorization'];
                if (!authorizationHeader) {
                    return response.status(400).json({ message: 'Token não fornecido' });
                }
                const token = authorizationHeader.split(' ')[1];
                const session = yield this.authService.logout(token);
                if (!session) {
                    return response.status(404).json({ message: 'Sessão não encontrada' });
                }
                return response.status(200).json({ message: 'Logout realizado com sucesso' });
            }
            catch (error) {
                console.error('Erro ao realizar logout:', error);
                return response.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
    listSessions(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (request.isAdmin) {
                    const sessions = yield this.authService.listSessions();
                    return response.status(200).json(sessions);
                }
                else {
                    const userId = request.userId;
                    if (typeof userId !== 'number') {
                        return response.status(400).json({ message: 'ID do usuário é obrigatório' });
                    }
                    const sessions = yield this.authService.listUserSessions(userId);
                    return response.status(200).json(sessions);
                }
            }
            catch (error) {
                console.error('Erro ao listar sessões:', error);
                return response.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
}
exports.AuthController = AuthController;
