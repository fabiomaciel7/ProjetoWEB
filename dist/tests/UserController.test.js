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
(0, vitest_1.describe)('User Controller', () => {
    let hashedPassword;
    let adminPassword;
    let userToken;
    let adminToken;
    let userCreatedId;
    (0, vitest_1.beforeAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        hashedPassword = yield bcrypt_1.default.hash("augusto123", 10);
        adminPassword = yield bcrypt_1.default.hash("admin123", 10);
        let userData = { id: 999, name: "Augusto", email: "augusto@teste.com", password: hashedPassword, isAdmin: false };
        yield prisma.user.create({ data: userData });
        let adminData = { id: 888, name: "Admin", email: "admin@teste.com", password: adminPassword, isAdmin: true };
        yield prisma.user.create({ data: adminData });
        const userLoginResponse = yield (0, supertest_1.default)(app_1.default)
            .post('/api/login')
            .send({ email: "augusto@teste.com", password: "augusto123" });
        userToken = userLoginResponse.body.token;
        const userAdminResponse = yield (0, supertest_1.default)(app_1.default)
            .post('/api/login')
            .send({ email: "admin@teste.com", password: "admin123" });
        adminToken = userAdminResponse.body.token;
    }));
    (0, vitest_1.afterAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.user.delete({ where: { id: 888 } });
    }));
    (0, vitest_1.describe)('POST /api/user/create', () => {
        (0, vitest_1.it)('deve criar um usuário com sucesso (201)', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/api/user/create')
                .send({ name: 'Fabio', email: 'fabio@teste.com', password: 'fabio123' });
            (0, vitest_1.expect)(response.status).toBe(201);
            (0, vitest_1.expect)(response.body).toEqual(vitest_1.expect.objectContaining({
                name: 'Fabio',
                email: 'fabio@teste.com',
            }));
            userCreatedId = response.body.id;
        }));
        (0, vitest_1.it)('deve retornar 400 ao criar um usuário já existente', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/api/user/create')
                .send({ name: 'Fabio', email: 'fabio@teste.com', password: 'senha123' });
            (0, vitest_1.expect)(response.status).toBe(400);
            (0, vitest_1.expect)(response.body).toEqual({ message: 'User already exists' });
        }));
        (0, vitest_1.it)('deve retornar 400 ao criar usuário sem nome', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/api/user/create')
                .send({ email: 'teste@teste.com', password: 'senha123' });
            (0, vitest_1.expect)(response.status).toBe(400);
            (0, vitest_1.expect)(response.body).toEqual(vitest_1.expect.objectContaining({
                details: vitest_1.expect.arrayContaining(["O nome é obrigatório."]),
                message: "Erro de validação",
            }));
        }));
        (0, vitest_1.it)('deve retornar 400 ao criar usuário com senha curta', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/api/user/create')
                .send({ name: "Fabio", email: 'fabio@test.com', password: 'senha' });
            (0, vitest_1.expect)(response.status).toBe(400);
            (0, vitest_1.expect)(response.body).toEqual(vitest_1.expect.objectContaining({
                details: vitest_1.expect.arrayContaining(["A senha deve ter pelo menos 6 caracteres."]),
                message: "Erro de validação",
            }));
        }));
    });
    (0, vitest_1.describe)('GET /api/users', () => {
        (0, vitest_1.it)('deve retornar a lista de usuários quando solicitado por um admin (200)', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get('/api/users')
                .set('Authorization', `Bearer ${adminToken}`);
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body).toBeInstanceOf(Array);
            (0, vitest_1.expect)(response.body.length).toBeGreaterThan(0);
        }));
        (0, vitest_1.it)('deve retornar 403 se um usuário não admin solicitar a lista de usuários', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get('/api/users')
                .set('Authorization', `Bearer ${userToken}`);
            (0, vitest_1.expect)(response.status).toBe(403);
            (0, vitest_1.expect)(response.body).toEqual({ message: 'Acesso negado' });
        }));
    });
    (0, vitest_1.describe)('GET /api/user/:id', () => {
        (0, vitest_1.it)('deve retornar o perfil do próprio usuário (200)', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get(`/api/user/${999}`)
                .set('Authorization', `Bearer ${userToken}`);
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body).toEqual(vitest_1.expect.objectContaining({
                id: 999,
                name: 'Augusto',
                email: 'augusto@teste.com',
            }));
        }));
        (0, vitest_1.it)('deve retornar 403 ao tentar ver o perfil de outro usuário', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get(`/api/user/${888}`)
                .set('Authorization', `Bearer ${userToken}`);
            (0, vitest_1.expect)(response.status).toBe(403);
            (0, vitest_1.expect)(response.body).toEqual({ message: 'Acesso negado' });
        }));
    });
    (0, vitest_1.describe)('PUT /api/user/update/:id', () => {
        (0, vitest_1.it)('deve permitir a edição do próprio perfil (200)', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .put(`/api/user/update/${999}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                name: 'Augusto Atualizado',
                email: 'augustoatualizado@teste.com',
                password: 'novaSenha123',
            });
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body).toEqual(vitest_1.expect.objectContaining({
                name: 'Augusto Atualizado',
                email: 'augustoatualizado@teste.com',
            }));
        }));
        (0, vitest_1.it)('deve retornar 403 ao tentar editar o perfil de outro usuário', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .put(`/api/user/update/${888}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                name: 'Alteração Indevida',
                email: 'indevido@teste.com',
                password: 'senha123',
            });
            (0, vitest_1.expect)(response.status).toBe(403);
            (0, vitest_1.expect)(response.body).toEqual({ message: 'Acesso negado' });
        }));
        (0, vitest_1.it)('deve retornar 400 ao tentar editar com um email inválido', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .put(`/api/user/update/${999}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                name: 'Augusto Atualizado',
                email: 'email_invalido',
                password: 'novaSenha123',
            });
            (0, vitest_1.expect)(response.status).toBe(400);
            (0, vitest_1.expect)(response.body).toEqual(vitest_1.expect.objectContaining({
                message: 'Erro de validação',
                details: vitest_1.expect.arrayContaining(['Formato de e-mail inválido.'])
            }));
        }));
    });
    (0, vitest_1.describe)('POST /api/users/promote/:id', () => {
        (0, vitest_1.it)('deve retornar 403 se um usuário comum tentar promover outro usuário', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post(`/api/users/promote/${userCreatedId}`)
                .set('Authorization', `Bearer ${userToken}`);
            (0, vitest_1.expect)(response.status).toBe(403);
            (0, vitest_1.expect)(response.body).toEqual({ message: 'Acesso negado' });
        }));
        (0, vitest_1.it)('deve permitir que um admin promova outro usuário (200)', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post(`/api/users/promote/${userCreatedId}`)
                .set('Authorization', `Bearer ${adminToken}`);
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body).toEqual(vitest_1.expect.objectContaining({
                id: userCreatedId,
                isAdmin: true,
            }));
        }));
    });
    (0, vitest_1.describe)('DELETE /api/user/delete/:id', () => {
        (0, vitest_1.it)('deve retornar 403 ao tentar excluir o perfil de outro usuário', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .delete(`/api/user/delete/${888}`)
                .set('Authorization', `Bearer ${userToken}`);
            (0, vitest_1.expect)(response.status).toBe(403);
            (0, vitest_1.expect)(response.body).toEqual({ message: 'Acesso negado' });
        }));
        (0, vitest_1.it)('deve permitir que o usuário exclua o próprio perfil (204)', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .delete(`/api/user/delete/${999}`)
                .set('Authorization', `Bearer ${userToken}`);
            (0, vitest_1.expect)(response.status).toBe(204);
        }));
        (0, vitest_1.it)('deve permitir que um admin exclua o perfil de outro usuário (204)', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .delete(`/api/user/delete/${userCreatedId}`)
                .set('Authorization', `Bearer ${adminToken}`);
            (0, vitest_1.expect)(response.status).toBe(204);
        }));
    });
});
