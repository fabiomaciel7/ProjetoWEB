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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const AuthController_1 = require("./AuthController");
class UserController {
    constructor() {
        this.prismaClient = new client_1.PrismaClient();
        this.authController = new AuthController_1.AuthController();
    }
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password } = request.body;
            const existingUser = yield this.prismaClient.user.findUnique({
                where: { email },
            });
            if (existingUser) {
                return response.status(400).json({ message: 'User already exists' });
            }
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const user = yield this.prismaClient.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                },
            });
            return response.status(201).json(user);
        });
    }
    getAll(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.prismaClient.user.findMany();
            return response.json(users);
        });
    }
    getById(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const user = yield this.prismaClient.user.findUnique({
                where: { id: parseInt(id) },
            });
            if (!user) {
                return response.status(404).json({ message: 'User not found' });
            }
            return response.json(user);
        });
    }
    update(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const { name, email } = request.body;
            const user = yield this.prismaClient.user.findUnique({
                where: { id: parseInt(id) },
            });
            if (!user) {
                return response.status(404).json({ message: 'User not found' });
            }
            const updatedUser = yield this.prismaClient.user.update({
                where: { id: parseInt(id) },
                data: {
                    name,
                    email,
                },
            });
            return response.json(updatedUser);
        });
    }
    delete(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const user = yield this.prismaClient.user.findUnique({
                where: { id: parseInt(id) },
            });
            if (!user) {
                return response.status(404).json({ message: 'User not found' });
            }
            yield this.prismaClient.user.delete({
                where: { id: parseInt(id) },
            });
            return response.status(204).send();
        });
    }
    getUserTasks(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const user = yield this.prismaClient.user.findUnique({
                where: { id: parseInt(id) },
                include: { tasks: true },
            });
            if (!user) {
                return response.status(404).json({ message: 'User not found' });
            }
            return response.json(user.tasks);
        });
    }
}
exports.UserController = UserController;
