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

            return { success: true, token, id: user.id };
        } else {
            return { success: false };
        }
    }

    async logout(token: string) {
        const session = await this.sessionRepository.findSessionByToken(token);
    
        if (!session) {
            return null;
        }
        
        await this.sessionRepository.deleteSession(token);
        return session;
    }

    async listSessions() {
        return await this.sessionRepository.listSessions();
    }

    async listUserSessions(userId: number) {
        return await this.sessionRepository.listUserSessions(userId);
    }
}
