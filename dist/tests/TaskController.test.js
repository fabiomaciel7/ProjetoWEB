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
(0, vitest_1.describe)('Task Controller', () => {
    let userToken;
    let adminToken;
    let taskId;
    (0, vitest_1.beforeAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        const hashedPassword = yield bcrypt_1.default.hash("augusto123", 10);
        const adminPassword = yield bcrypt_1.default.hash("admin123", 10);
        yield prisma.user.createMany({
            data: [
                { id: 99999, name: "Augusto", email: "augusto3@teste.com", password: hashedPassword, isAdmin: false },
                { id: 88888, name: "Admin", email: "admin3@teste.com", password: adminPassword, isAdmin: true }
            ]
        });
        const userLoginResponse = yield (0, supertest_1.default)(app_1.default)
            .post('/api/login')
            .send({ email: "augusto3@teste.com", password: "augusto123" });
        userToken = userLoginResponse.body.token;
        const adminLoginResponse = yield (0, supertest_1.default)(app_1.default)
            .post('/api/login')
            .send({ email: "admin3@teste.com", password: "admin123" });
        adminToken = adminLoginResponse.body.token;
    }));
    (0, vitest_1.afterAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.user.deleteMany({
            where: {
                email: { in: ["augusto3@teste.com", "admin3@teste.com"] }
            }
        });
    }));
    (0, vitest_1.describe)('POST /task/create', () => {
        (0, vitest_1.afterEach)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.task.deleteMany();
        }));
        (0, vitest_1.it)('deve criar uma task com status 201', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/api/task/create')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                title: "Minha Task",
                description: "Descrição da minha task",
            });
            (0, vitest_1.expect)(response.status).toBe(201);
            (0, vitest_1.expect)(response.body).toHaveProperty('id');
            taskId = response.body.id;
        }));
        (0, vitest_1.it)('deve retornar 400 ao criar task sem título', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/api/task/create')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                description: "Descrição sem título",
            });
            (0, vitest_1.expect)(response.status).toBe(400);
            (0, vitest_1.expect)(response.body).toEqual(vitest_1.expect.objectContaining({
                message: 'Erro de validação',
                details: vitest_1.expect.arrayContaining(['O titulo é obrigatório.'])
            }));
        }));
        (0, vitest_1.it)('deve criar task sem descrição com status 201', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/api/task/create')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                title: "Task sem descrição",
            });
            (0, vitest_1.expect)(response.status).toBe(201);
            (0, vitest_1.expect)(response.body).toHaveProperty('id');
        }));
    });
    (0, vitest_1.describe)('GET /tasks', () => {
        (0, vitest_1.beforeEach)(() => __awaiter(void 0, void 0, void 0, function* () {
            const newTask = yield prisma.task.create({
                data: {
                    title: 'Test Task',
                    description: 'Task for testing',
                    userId: 99999,
                }
            });
            taskId = newTask.id;
        }));
        (0, vitest_1.afterEach)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.task.deleteMany();
        }));
        (0, vitest_1.it)('deve permitir ao admin ver todas as tasks', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get('/api/tasks')
                .set('Authorization', `Bearer ${adminToken}`);
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body).toBeInstanceOf(Array);
            (0, vitest_1.expect)(response.body.length).toBeGreaterThan(0);
        }));
        (0, vitest_1.it)('deve permitir ao usuário ver apenas suas próprias tasks', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get('/api/tasks')
                .set('Authorization', `Bearer ${userToken}`);
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body).toBeInstanceOf(Array);
            response.body.forEach((task) => {
                (0, vitest_1.expect)(task.userId).toBe(99999);
            });
        }));
    });
    (0, vitest_1.describe)('GET /task/:id', () => {
        (0, vitest_1.beforeEach)(() => __awaiter(void 0, void 0, void 0, function* () {
            const newTask = yield prisma.task.create({
                data: {
                    title: 'Test Task',
                    description: 'Task for testing',
                    userId: 99999,
                }
            });
            taskId = newTask.id;
        }));
        (0, vitest_1.afterEach)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.task.deleteMany();
        }));
        (0, vitest_1.it)('deve permitir ao usuário ver sua própria task', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get(`/api/task/${taskId}`)
                .set('Authorization', `Bearer ${userToken}`);
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body.id).toBe(taskId);
        }));
    });
    (0, vitest_1.describe)('PUT /task/update/:id', () => {
        (0, vitest_1.beforeEach)(() => __awaiter(void 0, void 0, void 0, function* () {
            const newTask = yield prisma.task.create({
                data: {
                    title: 'Task to update',
                    description: 'Task to be updated',
                    userId: 99999,
                }
            });
            taskId = newTask.id;
        }));
        (0, vitest_1.afterEach)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.task.deleteMany();
        }));
        (0, vitest_1.it)('deve permitir ao usuário editar sua própria task', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .put(`/api/task/update/${taskId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                title: "Task editada",
                description: "Descrição editada",
            });
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body.title).toBe('Task editada');
        }));
        (0, vitest_1.it)('deve retornar 400 quando o título for numérico', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .put(`/api/task/update/${taskId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                title: 12345,
            });
            (0, vitest_1.expect)(response.status).toBe(400);
            (0, vitest_1.expect)(response.body).toEqual(vitest_1.expect.objectContaining({
                message: 'Erro de validação',
                details: vitest_1.expect.arrayContaining(['O titulo deve ser um texto.'])
            }));
        }));
    });
    (0, vitest_1.describe)('PATCH /task/:id/complete', () => {
        (0, vitest_1.beforeEach)(() => __awaiter(void 0, void 0, void 0, function* () {
            const newTask = yield prisma.task.create({
                data: {
                    title: 'Task to complete',
                    description: 'Task to be completed',
                    userId: 99999,
                }
            });
            taskId = newTask.id;
        }));
        (0, vitest_1.afterEach)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.task.deleteMany();
        }));
        (0, vitest_1.it)('deve marcar uma task como completa', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .patch(`/api/task/complete/${taskId}`)
                .set('Authorization', `Bearer ${userToken}`);
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body.completed).toBe(true);
        }));
    });
    (0, vitest_1.describe)('GET /tasks/pending', () => {
        (0, vitest_1.it)('deve retornar todas as tasks pendentes do usuário', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get('/api/tasks/pending')
                .set('Authorization', `Bearer ${userToken}`);
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(Array.isArray(response.body)).toBe(true);
        }));
    });
    (0, vitest_1.describe)('GET /tasks/byuser', () => {
        (0, vitest_1.it)('deve retornar todas as tasks agrupadas por usuário (admin)', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get('/api/tasks/byuser')
                .set('Authorization', `Bearer ${adminToken}`);
            (0, vitest_1.expect)(response.status).toBe(200);
        }));
    });
    (0, vitest_1.describe)('DELETE /task/delete/:id', () => {
        (0, vitest_1.beforeEach)(() => __awaiter(void 0, void 0, void 0, function* () {
            const newTask = yield prisma.task.create({
                data: {
                    title: 'Task to delete',
                    description: 'Task to be deleted',
                    userId: 99999,
                }
            });
            taskId = newTask.id;
        }));
        (0, vitest_1.afterEach)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.task.deleteMany();
        }));
        (0, vitest_1.it)('deve deletar a própria task', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .delete(`/api/task/delete/${taskId}`)
                .set('Authorization', `Bearer ${userToken}`);
            (0, vitest_1.expect)(response.status).toBe(204);
            const getResponse = yield (0, supertest_1.default)(app_1.default)
                .get(`/api/task/${taskId}`)
                .set('Authorization', `Bearer ${userToken}`);
            (0, vitest_1.expect)(getResponse.status).toBe(404);
        }));
    });
});
