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
exports.UserRepository = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserRepository {
    constructor() {
        this.prismaClient = new client_1.PrismaClient();
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaClient.user.findUnique({
                where: { email },
            });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaClient.user.create({
                data,
            });
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaClient.user.findMany();
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaClient.user.findUnique({
                where: { id },
            });
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaClient.user.update({
                where: { id },
                data,
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaClient.user.delete({
                where: { id },
            });
        });
    }
    findUserWithTasks(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaClient.user.findUnique({
                where: { id },
                include: {
                    tasks: {
                        orderBy: {
                            dueDate: 'asc',
                        },
                    },
                },
            });
        });
    }
    hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcrypt_1.default.hash(password, 10);
        });
    }
}
exports.UserRepository = UserRepository;
