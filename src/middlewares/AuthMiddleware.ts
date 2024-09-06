import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number; isAdmin: boolean };
        req.userId = decoded.id;
        req.isAdmin = decoded.isAdmin;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAdmin) {
        return res.status(403).json({ message: 'Acesso negado' });
    }
    next();
};