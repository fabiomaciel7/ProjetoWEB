"use strict";
// npm run test para executar as suites de teste
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
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const app_1 = __importDefault(require("../src/app"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let hashedPassword;
let adminPassword;
let userToken;
(0, vitest_1.describe)('Auth Controller', () => {
    (0, vitest_1.beforeAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        hashedPassword = yield bcrypt_1.default.hash("augusto123", 10);
        adminPassword = yield bcrypt_1.default.hash("admin123", 10);
        let userData = { id: 777, name: "Augusto", email: "augusto2@teste.com", password: hashedPassword, isAdmin: false };
        yield prisma.user.create({ data: userData });
        let adminData = { id: 666, name: "Admin", email: "admin2@teste.com", password: adminPassword, isAdmin: true };
        yield prisma.user.create({ data: adminData });
    }));
    (0, vitest_1.afterAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.user.delete({ where: { id: 777 } });
        yield prisma.user.delete({ where: { id: 666 } });
    }));
    (0, vitest_1.describe)('POST /api/login', () => {
        (0, vitest_1.it)('deve retornar 200 para login válido', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/api/login')
                .send({ email: "augusto2@teste.com", password: "augusto123" });
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body).toHaveProperty('token');
            userToken = response.body.token;
        }));
        (0, vitest_1.it)('deve retornar 401 para credenciais inválidas', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/api/login')
                .send({ email: "augusto2@teste.com", password: "senhaErrada" });
            (0, vitest_1.expect)(response.status).toBe(401);
            (0, vitest_1.expect)(response.body).toEqual({ message: 'Invalid credentials' });
        }));
        (0, vitest_1.it)('deve retornar 400 quando o email não é fornecido', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/api/login')
                .send({ password: "augusto123" });
            (0, vitest_1.expect)(response.status).toBe(400);
            (0, vitest_1.expect)(response.body).toEqual({
                message: "Erro de validação",
                details: vitest_1.expect.arrayContaining(["O e-mail é obrigatório."]),
            });
        }));
        (0, vitest_1.it)('deve retornar 400 quando a senha não é fornecida', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/api/login')
                .send({ email: "augusto2@teste.com" });
            (0, vitest_1.expect)(response.status).toBe(400);
            (0, vitest_1.expect)(response.body).toEqual({
                message: "Erro de validação",
                details: vitest_1.expect.arrayContaining(["A senha é obrigatória."]),
            });
        }));
    });
    (0, vitest_1.describe)('POST /api/logout', () => {
        (0, vitest_1.it)('deve retornar 200 para logout de um usuário logado', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/api/logout')
                .set('Authorization', `Bearer ${userToken}`);
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body).toEqual({ message: 'Logout successful' });
        }));
        (0, vitest_1.it)('deve retornar 500 para logout de um usuário não logado', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/api/logout');
            (0, vitest_1.expect)(response.status).toBe(500);
            (0, vitest_1.expect)(response.body).toEqual({ message: 'Internal Server Error' });
        }));
    });
    (0, vitest_1.describe)('GET /api/sessions', () => {
        let userToken;
        let adminToken;
        (0, vitest_1.beforeAll)(() => __awaiter(void 0, void 0, void 0, function* () {
            const userLoginResponse = yield (0, supertest_1.default)(app_1.default)
                .post('/api/login')
                .send({ email: "augusto2@teste.com", password: "augusto123" });
            userToken = userLoginResponse.body.token;
            const adminLoginResponse = yield (0, supertest_1.default)(app_1.default)
                .post('/api/login')
                .send({ email: "admin2@teste.com", password: "admin123" });
            adminToken = adminLoginResponse.body.token;
        }));
        (0, vitest_1.it)('admin deve ver todas as sessões', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get('/api/sessions')
                .set('Authorization', `Bearer ${adminToken}`);
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body).toBeInstanceOf(Array);
            (0, vitest_1.expect)(response.body.length).toBeGreaterThan(0);
        }));
        (0, vitest_1.it)('usuário deve ver suas próprias sessões', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get('/api/sessions')
                .set('Authorization', `Bearer ${userToken}`);
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body).toBeInstanceOf(Array);
            (0, vitest_1.expect)(response.body.length).toBe(1);
            (0, vitest_1.expect)(response.body[0].userId).toBe(777);
        }));
    });
});
