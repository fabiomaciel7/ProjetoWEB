// npm run test para rodas as suites de teste

import { describe, it, expect, vi, afterEach, afterAll, beforeEach, beforeAll } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('User Controller', () => {
    let hashedPassword: string;
    let adminPassword: string;
    let userToken: string;
    let adminToken: string;
    let userCreatedId: number;

    beforeAll(async () => {
        hashedPassword = await bcrypt.hash("augusto123", 10);
        adminPassword = await bcrypt.hash("admin123", 10);

        let userData = { id: 999, name: "Augusto", email: "augusto@teste.com", password: hashedPassword, isAdmin: false };
        await prisma.user.create({ data: userData });

        let adminData = { id: 888, name: "Admin", email: "admin@teste.com", password: adminPassword, isAdmin: true };
        await prisma.user.create({ data: adminData });

        const userLoginResponse = await request(app)
            .post('/api/login')
            .send({ email: "augusto@teste.com", password: "augusto123" });

        userToken = userLoginResponse.body.token;

        const userAdminResponse = await request(app)
            .post('/api/login')
            .send({ email: "admin@teste.com", password: "admin123" });

        adminToken = userAdminResponse.body.token;
    });

    afterAll(async () => {
        await prisma.user.delete({ where: { id: 888 } });
    });

    describe('POST /api/user/create', () => {
        it('deve criar um usuário com sucesso (201)', async () => {
            const response = await request(app)
                .post('/api/user/create')
                .send({ name: 'Fabio', email: 'fabio@teste.com', password: 'fabio123' });

            expect(response.status).toBe(201);
            expect(response.body).toEqual(expect.objectContaining({
                name: 'Fabio',
                email: 'fabio@teste.com',
            }));

            userCreatedId = response.body.id;
        });

        it('deve retornar 400 ao criar um usuário já existente', async () => {
            const response = await request(app)
                .post('/api/user/create')
                .send({ name: 'Fabio', email: 'fabio@teste.com', password: 'senha123' });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: 'User already exists' });
        });

        it('deve retornar 400 ao criar usuário sem nome', async () => {
            const response = await request(app)
                .post('/api/user/create')
                .send({ email: 'teste@teste.com', password: 'senha123' });

            expect(response.status).toBe(400);
            expect(response.body).toEqual(expect.objectContaining({
                details: expect.arrayContaining(["O nome é obrigatório."]),
                message: "Erro de validação",
            }));
        });

        it('deve retornar 400 ao criar usuário com senha curta', async () => {
            const response = await request(app)
                .post('/api/user/create')
                .send({ name: "Fabio", email: 'fabio@test.com', password: 'senha' });

            expect(response.status).toBe(400);
            expect(response.body).toEqual(expect.objectContaining({
                details: expect.arrayContaining(["A senha deve ter pelo menos 6 caracteres."]),
                message: "Erro de validação",
            }));
        });
    });

    describe('GET /api/users', () => {
        it('deve retornar a lista de usuários quando solicitado por um admin (200)', async () => {
            const response = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('deve retornar 403 se um usuário não admin solicitar a lista de usuários', async () => {
            const response = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(403);
            expect(response.body).toEqual({ message: 'Acesso negado' });
        });
    });

    describe('GET /api/user/:id', () => {
        it('deve retornar o perfil do próprio usuário (200)', async () => {
            const response = await request(app)
                .get(`/api/user/${999}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.objectContaining({
                id: 999,
                name: 'Augusto',
                email: 'augusto@teste.com',
            }));
        });

        it('deve retornar 403 ao tentar ver o perfil de outro usuário', async () => {
            const response = await request(app)
                .get(`/api/user/${888}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(403);
            expect(response.body).toEqual({ message: 'Acesso negado' });
        });
    });

    describe('PUT /api/user/update/:id', () => {
        it('deve permitir a edição do próprio perfil (200)', async () => {
            const response = await request(app)
                .put(`/api/user/update/${999}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: 'Augusto Atualizado',
                    email: 'augustoatualizado@teste.com',
                    password: 'novaSenha123',
                });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.objectContaining({
                name: 'Augusto Atualizado',
                email: 'augustoatualizado@teste.com',
            }));
        });

        it('deve retornar 403 ao tentar editar o perfil de outro usuário', async () => {
            const response = await request(app)
                .put(`/api/user/update/${888}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: 'Alteração Indevida',
                    email: 'indevido@teste.com',
                    password: 'senha123',
                });

            expect(response.status).toBe(403);
            expect(response.body).toEqual({ message: 'Acesso negado' });
        });

        it('deve retornar 400 ao tentar editar com um email inválido', async () => {
            const response = await request(app)
                .put(`/api/user/update/${999}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: 'Augusto Atualizado',
                    email: 'email_invalido',
                    password: 'novaSenha123',
                });

            expect(response.status).toBe(400);
            expect(response.body).toEqual(expect.objectContaining({
                message: 'Erro de validação',
                details: expect.arrayContaining(['Formato de e-mail inválido.'])
            }));
        });
    });

    describe('POST /api/users/promote/:id', () => {
        it('deve retornar 403 se um usuário comum tentar promover outro usuário', async () => {
            const response = await request(app)
                .post(`/api/users/promote/${userCreatedId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(403);
            expect(response.body).toEqual({ message: 'Acesso negado' });
        });

        it('deve permitir que um admin promova outro usuário (200)', async () => {
            const response = await request(app)
                .post(`/api/users/promote/${userCreatedId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.objectContaining({
                id: userCreatedId,
                isAdmin: true,
            }));
        });
    });

    describe('DELETE /api/user/delete/:id', () => {

        it('deve retornar 403 ao tentar excluir o perfil de outro usuário', async () => {
            const response = await request(app)
                .delete(`/api/user/delete/${888}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(403);
            expect(response.body).toEqual({ message: 'Acesso negado' });
        });

        it('deve permitir que o usuário exclua o próprio perfil (204)', async () => {
            const response = await request(app)
                .delete(`/api/user/delete/${999}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(204);
        });

        it('deve permitir que um admin exclua o perfil de outro usuário (204)', async () => {
            const response = await request(app)
                .delete(`/api/user/delete/${userCreatedId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(204);
        });
    });


});