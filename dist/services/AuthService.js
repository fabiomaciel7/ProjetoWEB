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
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const client_1 = require("@prisma/client");
const SessionRepository_1 = require("../repositories/SessionRepository");
class AuthService {
    constructor() {
        this.prismaClient = new client_1.PrismaClient();
        this.sessionRepository = new SessionRepository_1.SessionRepository();
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.prismaClient.user.findUnique({
                where: { email },
            });
            if (user && (yield bcrypt_1.default.compare(password, user.password))) {
                const token = (0, uuid_1.v4)();
                yield this.sessionRepository.createSession({
                    token,
                    userId: user.id,
                    expiresAt: new Date(Date.now() + 3600 * 1000),
                });
                return { success: true, token };
            }
            else {
                return { success: false };
            }
        });
    }
    validateToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!token) {
                return false;
            }
            const session = yield this.sessionRepository.findSessionByToken(token);
            return session && session.expiresAt > new Date();
        });
    }
    logout(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sessionRepository.deleteSession(token);
        });
    }
    listSessions() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sessionRepository.listSessions();
        });
    }
}
exports.AuthService = AuthService;
