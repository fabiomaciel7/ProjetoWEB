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
                    return response.json({ message: 'Login successful', token: result.token });
                }
                else {
                    return response.status(401).json({ message: 'Invalid credentials' });
                }
            }
            catch (error) {
                console.error('Error during login:', error);
                return response.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    logout(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const token = (_a = request.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                yield this.authService.logout(token);
                return response.status(200).json({ message: 'Logout successful' });
            }
            catch (error) {
                console.error('Error logging out:', error);
                return response.status(500).json({ message: 'Internal Server Error' });
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
                        return response.status(400).json({ message: 'User ID is required' });
                    }
                    const sessions = yield this.authService.listUserSessions(userId);
                    return response.status(200).json(sessions);
                }
            }
            catch (error) {
                console.error('Error listing sessions:', error);
                return response.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
}
exports.AuthController = AuthController;
