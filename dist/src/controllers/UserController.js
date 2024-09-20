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
exports.UserController = void 0;
const UserService_1 = require("../services/UserService");
const UserCreateValidation_1 = require("../validation/UserCreateValidation");
const UserUpdateValidation_1 = require("../validation/UserUpdateValidation");
class UserController {
    constructor() {
        this.userService = new UserService_1.UserService();
    }
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error, value } = UserCreateValidation_1.createUserSchema.validate(request.body, { abortEarly: false });
                if (error) {
                    return response.status(400).json({
                        message: 'Erro de validação',
                        details: error.details.map(detail => detail.message),
                    });
                }
                const userData = value;
                const user = yield this.userService.createUser(userData);
                return response.status(201).json(user);
            }
            catch (error) {
                console.error('Erro na criação de usuário:', error);
                return response.status(400).json({ message: error.message });
            }
        });
    }
    getAll(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.userService.getAllUsers();
                return response.json(users);
            }
            catch (error) {
                console.error('Erro ao listar usuários:', error);
                return response.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
    getById(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = request.params;
                if (parseInt(id) !== request.userId && !request.isAdmin) {
                    return response.status(403).json({ message: 'Acesso negado' });
                }
                const user = yield this.userService.getUserById(parseInt(id));
                if (!user) {
                    return response.status(404).json({ message: 'Usuário não encontrado' });
                }
                return response.json(user);
            }
            catch (error) {
                console.error('Erro ao visualizar usuário pelo ID:', error);
                return response.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
    update(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error, value } = UserUpdateValidation_1.updateUserSchema.validate(request.body, { abortEarly: false });
                if (error) {
                    return response.status(400).json({
                        message: 'Erro de validação',
                        details: error.details.map(detail => detail.message),
                    });
                }
                const { id } = request.params;
                const userData = request.body;
                if (parseInt(id) !== request.userId && !request.isAdmin) {
                    return response.status(403).json({ message: 'Acesso negado' });
                }
                const user = yield this.userService.updateUser(parseInt(id), userData);
                return response.json(user);
            }
            catch (error) {
                console.error('Erro ao atualizar o ID:', error);
                return response.status(400).json({ message: error.message });
            }
        });
    }
    delete(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = request.params;
                if (parseInt(id) !== request.userId && !request.isAdmin) {
                    return response.status(403).json({ message: 'Acesso negado' });
                }
                yield this.userService.deleteUser(parseInt(id));
                return response.status(204).send();
            }
            catch (error) {
                console.error('Erro ao deletar usuário:', error);
                return response.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
    promoteToAdmin(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = request.params;
                if (!request.isAdmin) {
                    return response.status(403).json({ message: 'Access negado' });
                }
                const updatedUser = yield this.userService.promoteToAdmin(parseInt(id));
                if (!updatedUser) {
                    return response.status(404).json({ message: 'Usuário não existe' });
                }
                return response.status(200).json(updatedUser);
            }
            catch (error) {
                console.error('Erro ao promover usuário para Admin:', error);
                return response.status(500).json({ message: 'Erro interno do servidor' });
            }
        });
    }
}
exports.UserController = UserController;
