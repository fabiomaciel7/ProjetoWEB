import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
import { SessionRepository } from '../repositories/SessionRepository';
import jwt from 'jsonwebtoken';

export class AuthService {
    private prismaClient: PrismaClient;
    private sessionRepository: SessionRepository;

    constructor() {
        this.prismaClient = new PrismaClient();
        this.sessionRepository = new SessionRepository();
    }

    async login(email: string, password: string) {
        const user = await this.prismaClient.user.findUnique({
            where: { email },
        });

        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET as string, {
                expiresIn: '1h',
            });

            await this.sessionRepository.createSession({
                token,
                userId: user.id,
                expiresAt: new Date(Date.now() + 3600 * 1000),
            });

            return { success: true, token };
        } else {
            return { success: false };
        }
    }

    async validateToken(token: string) {
        if (!token) {
            return false;
        }

        const session = await this.sessionRepository.findSessionByToken(token);
        return session && session.expiresAt > new Date();
    }

    async logout(token: string) {
        return await this.sessionRepository.deleteSession(token);
    }

    async listSessions() {
        return await this.sessionRepository.listSessions();
    }

    async listUserSessions(userId: number) {
        return await this.sessionRepository.listUserSessions(userId);
    }
}
