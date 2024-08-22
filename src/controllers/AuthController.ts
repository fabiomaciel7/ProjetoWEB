import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    async login(request: Request, response: Response) {
        const { email, password } = request.body;

        const result = await this.authService.login(email, password);

        if (result.success) {
            return response.json({ message: 'Login successful', token: result.token });
        } else {
            return response.status(401).json({ message: 'Invalid credentials' });
        }
    }

    async validateToken(request: Request, response: Response) {
        const token = request.headers['authorization']?.split(' ')[1];

        const isValid = await this.authService.validateToken(token || '');

        if (isValid) {
            return response.status(200).json({ message: 'Token is valid' });
        } else {
            return response.status(401).json({ message: 'Invalid or expired token' });
        }
    }

    async logout(request: Request, response: Response) {
        const token = request.headers['authorization']?.split(' ')[1];

        await this.authService.logout(token || '');
        return response.status(200).json({ message: 'Logout successful' });
    }

    async listSessions(request: Request, response: Response) {
        try {
            const sessions = await this.authService.listSessions();
            return response.status(200).json(sessions);
        } catch (error) {
            console.error('Error listing sessions:', error);
            return response.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
