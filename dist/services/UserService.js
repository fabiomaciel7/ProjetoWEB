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
exports.UserService = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserService {
    constructor() {
        this.prismaClient = new client_1.PrismaClient();
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.prismaClient.user.findUnique({
                where: { email: data.email },
            });
            if (existingUser) {
                throw new Error('User already exists');
            }
            const hashedPassword = yield bcrypt_1.default.hash(data.password, 10);
            return this.prismaClient.user.create({
                data: {
                    name: data.name,
                    email: data.email,
                    password: hashedPassword,
                },
            });
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaClient.user.findMany();
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaClient.user.findUnique({
                where: { id },
            });
        });
    }
    updateUser(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaClient.user.update({
                where: { id },
                data,
            });
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaClient.user.delete({
                where: { id },
            });
        });
    }
    getUserTasks(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaClient.user.findUnique({
                where: { id },
                include: { tasks: true },
            });
        });
    }
}
exports.UserService = UserService;
