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
exports.AuthController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const client_1 = require("@prisma/client");
class AuthController {
    constructor() {
        this.prismaClient = new client_1.PrismaClient();
    }
    login(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = request.body;
            const user = yield this.prismaClient.user.findUnique({
                where: { email },
            });
            if (user && (yield bcrypt_1.default.compare(password, user.password))) {
                const token = (0, uuid_1.v4)();
                yield this.prismaClient.session.create({
                    data: {
                        token,
                        userId: user.id,
                        expiresAt: new Date(Date.now() + 3600 * 1000), // Expira em 1 hora
                    },
                });
                return response.json({ message: 'Login successful', token });
            }
            else {
                return response.status(401).json({ message: 'Invalid credentials' });
            }
        });
    }
    validateToken(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const token = (_a = request.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            if (!token) {
                return response.status(401).json({ message: 'Token is missing' });
            }
            try {
                const session = yield this.prismaClient.session.findUnique({
                    where: { token },
                });
                if (session && session.expiresAt > new Date()) {
                    return response.status(200).json({ message: 'Token is valid' });
                }
                else {
                    return response.status(401).json({ message: 'Invalid or expired token' });
                }
            }
            catch (error) {
                return response.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
}
exports.AuthController = AuthController;
