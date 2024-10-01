// npm run test para executar as suites de teste

import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Task Controller', () => {
    let userToken: string;
    let adminToken: string;
    let taskId: number;

    beforeAll(async () => {
        const hashedPassword = await bcrypt.hash("augusto123", 10);
        const adminPassword = await bcrypt.hash("admin123", 10);

        await prisma.user.createMany({
            data: [
                { id: 99999, name: "Augusto", email: "augusto3@teste.com", password: hashedPassword, isAdmin: false },
                { id: 88888, name: "Admin", email: "admin3@teste.com", password: adminPassword, isAdmin: true }
            ]
        });

        const userLoginResponse = await request(app)
            .post('/api/login')
            .send({ email: "augusto3@teste.com", password: "augusto123" });
        userToken = userLoginResponse.body.token;

        const adminLoginResponse = await request(app)
            .post('/api/login')
            .send({ email: "admin3@teste.com", password: "admin123" });
        adminToken = adminLoginResponse.body.token;
    });

    afterAll(async () => {
        await prisma.user.deleteMany({
            where: {
                email: { in: ["augusto3@teste.com", "admin3@teste.com"] }
            }
        });
    });

    describe('POST /task/create', () => {
        afterEach(async () => {
            await prisma.task.deleteMany({
                where: {
                    title: { in: ["Task Teste"] }
                }
            });
        });
        it('deve criar uma task com status 201', async () => {
            const response = await request(app)
                .post('/api/task/create')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    title: "Task Teste",
                    description: "Descrição da minha task",
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            taskId = response.body.id;
        });

        it('deve retornar 400 ao criar task sem título', async () => {
            const response = await request(app)
                .post('/api/task/create')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    description: "Descrição sem título",
                });

            expect(response.status).toBe(400);
            expect(response.body).toEqual(expect.objectContaining({
                message: 'Erro de validação',
                details: expect.arrayContaining(['O titulo é obrigatório.'])
            }));
        });

        it('deve criar task sem descrição com status 201', async () => {
            const response = await request(app)
                .post('/api/task/create')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    title: "Task Teste",
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
        });
    });

    describe('GET /tasks', () => {
        beforeEach(async () => {
            const newTask = await prisma.task.create({
                data: {
                    title: 'Task Teste',
                    description: 'Task for testing',
                    userId: 99999,
                }
            });
            taskId = newTask.id;
        });

        afterEach(async () => {
            await prisma.task.deleteMany({
                where: {
                    title: { in: ["Task Teste"] }
                }
            });
        });

        it('deve permitir ao admin ver todas as tasks', async () => {
            const response = await request(app)
                .get('/api/tasks')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('deve permitir ao usuário ver apenas suas próprias tasks', async () => {
            const response = await request(app)
                .get('/api/tasks')
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            response.body.forEach((task: any) => {
                expect(task.userId).toBe(99999);
            });
        });
    });

    describe('GET /task/:id', () => {
        beforeEach(async () => {
            const newTask = await prisma.task.create({
                data: {
                    title: 'Task Teste',
                    description: 'Task for testing',
                    userId: 99999,
                }
            });
            taskId = newTask.id;
        });

        afterEach(async () => {
            await prisma.task.deleteMany({
                where: {
                    title: { in: ["Task Teste"] }
                }
            });
        });

        it('deve permitir ao usuário ver sua própria task', async () => {
            const response = await request(app)
                .get(`/api/task/${taskId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(taskId);
        });
    });

    describe('PUT /task/update/:id', () => {
        beforeEach(async () => {
            const newTask = await prisma.task.create({
                data: {
                    title: 'Task to update',
                    description: 'Task to be updated',
                    userId: 99999,
                }
            });
            taskId = newTask.id;
        });

        afterEach(async () => {
            await prisma.task.deleteMany({
                where: {
                    title: { in: ["Task to update", 'Task editada'] }
                }
            });
        });

        it('deve permitir ao usuário editar sua própria task', async () => {
            const response = await request(app)
                .put(`/api/task/update/${taskId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    title: "Task editada",
                    description: "Descrição editada",
                });

            expect(response.status).toBe(200);
            expect(response.body.title).toBe('Task editada');
        });

        it('deve retornar 400 quando o título for numérico', async () => {
            const response = await request(app)
                .put(`/api/task/update/${taskId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    title: 12345,
                });

            expect(response.status).toBe(400);
            expect(response.body).toEqual(expect.objectContaining({
                message: 'Erro de validação',
                details: expect.arrayContaining(['O titulo deve ser um texto.'])
            }));
        });
    });

    describe('PATCH /task/:id/complete', () => {
        beforeEach(async () => {
            const newTask = await prisma.task.create({
                data: {
                    title: 'Task to complete',
                    description: 'Task to be completed',
                    userId: 99999,
                }
            });
            taskId = newTask.id;
        });

        afterEach(async () => {
            await prisma.task.deleteMany({
                where: {
                    title: { in: ["Task to be completed"] }
                }
            });
        });

        it('deve marcar uma task como completa', async () => {
            const response = await request(app)
                .patch(`/api/task/complete/${taskId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(200);
        });
    });

    describe('GET /tasks/pending', () => {
        it('deve retornar todas as tasks pendentes do usuário', async () => {
          const response = await request(app)
            .get('/api/tasks/pending')
            .set('Authorization', `Bearer ${userToken}`);
    
          expect(response.status).toBe(200);
          expect(Array.isArray(response.body)).toBe(true);
        });
    });
    
    describe('GET /tasks/byuser', () => {
        it('deve retornar todas as tasks agrupadas por usuário (admin)', async () => {
          const response = await request(app)
            .get('/api/tasks/byuser')
            .set('Authorization', `Bearer ${adminToken}`);
    
          expect(response.status).toBe(200);
        });

        it('deve retornar todas as tasks agrupadas por usuário (usuario comum)', async () => {
            const response = await request(app)
              .get('/api/tasks/byuser')
              .set('Authorization', `Bearer ${userToken}`);
      
            expect(response.status).toBe(403);
            expect(response.body).toEqual({ message: 'Acesso negado' });
          });

    });

    describe('DELETE /task/delete/:id', () => {
        beforeEach(async () => {
            const newTask = await prisma.task.create({
                data: {
                    title: 'Task to delete',
                    description: 'Task to be deleted',
                    userId: 99999,
                }
            });
            taskId = newTask.id;
        });



        it('deve deletar a própria task', async () => {
            const response = await request(app)
                .delete(`/api/task/delete/${taskId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(204);

            const getResponse = await request(app)
                .get(`/api/task/${taskId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(getResponse.status).toBe(404);
        });
    });

    
});