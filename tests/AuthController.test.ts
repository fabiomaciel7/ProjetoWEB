// npm run test para executar as suites de teste

import { describe, it, expect, vi, afterEach, afterAll, beforeEach, beforeAll } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

let hashedPassword: string;
let adminPassword: string;
let userToken: string;
let adminId: number| undefined;
let userId: number | undefined;

describe('Auth Controller', () => {

    beforeAll(async () => {
        hashedPassword = await bcrypt.hash("augusto123", 10);
        adminPassword = await bcrypt.hash("admin123", 10);

        let userData = { name: "Augusto", email: "augusto2@teste.com", password: hashedPassword, isAdmin: false };
        await prisma.user.create({ data: userData });

        const user =  await prisma.user.findUnique({
            where: { email: "augusto2@teste.com" },
            select: { id: true },
        });

        userId = user?.id;

        let adminData = { name: "Admin", email: "admin2@teste.com", password: adminPassword, isAdmin: true };
        await prisma.user.create({ data: adminData });
    });

    afterAll(async () => {
        await prisma.user.delete({ where: { email: "augusto2@teste.com" } });
        await prisma.user.delete({ where: { email: "admin2@teste.com" } });
    });

    describe('POST /api/login', () => {
        it('deve retornar 200 para login válido', async () => {
            const response = await request(app)
                .post('/api/login')
                .send({ email: "augusto2@teste.com", password: "augusto123" });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');

            userToken = response.body.token;
        });

        it('deve retornar 401 para credenciais inválidas', async () => {
            const response = await request(app)
                .post('/api/login')
                .send({ email: "augusto2@teste.com", password: "senhaErrada" });

            expect(response.status).toBe(401);
            expect(response.body).toEqual({ message: 'Credenciais Inválidas' });
        });

        it('deve retornar 400 quando o email não é fornecido', async () => {
            const response = await request(app)
                .post('/api/login')
                .send({ password: "augusto123" });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                message: "Erro de validação",
                details: expect.arrayContaining(["O e-mail é obrigatório."]),
            });
        });

        it('deve retornar 400 quando a senha não é fornecida', async () => {
            const response = await request(app)
                .post('/api/login')
                .send({ email: "augusto2@teste.com" });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                message: "Erro de validação",
                details: expect.arrayContaining(["A senha é obrigatória."]),
            });
        });
    });

    describe('POST /api/logout', () => {

        it('deve retornar 200 para logout de um usuário logado', async () => {
            const response = await request(app)
                .post('/api/logout')
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Logout realizado com sucesso' });
        });

        it('deve retornar 400 para logout sem token', async () => {
            const response = await request(app)
                .post('/api/logout');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: 'Token não fornecido' });
        });

        it('deve retornar 404 para logout com token inexistente', async () => {
            const response = await request(app)
                .post('/api/logout')
                .set('Authorization', `Bearer tokenFake`);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Sessão não encontrada' });
        });

    });

    describe('GET /api/sessions', () => {
        let userToken: string;
        let adminToken: string;

        beforeAll(async () => {
            const userLoginResponse = await request(app)
                .post('/api/login')
                .send({ email: "augusto2@teste.com", password: "augusto123" });

            userToken = userLoginResponse.body.token;

            const adminLoginResponse = await request(app)
                .post('/api/login')
                .send({ email: "admin2@teste.com", password: "admin123" });

            adminToken = adminLoginResponse.body.token;
        });

        it('admin deve ver todas as sessões', async () => {
            const response = await request(app)
                .get('/api/sessions')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('usuário deve ver suas próprias sessões', async () => {
            const response = await request(app)
                .get('/api/sessions')
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(1);
            expect(response.body[0].userId).toBe(userId);
        });
    });

});