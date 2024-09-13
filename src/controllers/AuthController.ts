import { Request, Response} from 'express';
import { AuthService } from '../services/AuthService';
import { loginSchema } from '../validation/AuthValidation';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    async login(request: Request, response: Response) {
        try {

            const { error, value } = loginSchema.validate(request.body, { abortEarly: false });

            if (error) {
                return response.status(400).json({ 
                    message: 'Erro de validação',
                    details: error.details.map(detail => detail.message),
                });
            }

            const { email, password } = request.body;
            const result = await this.authService.login(email, password);

            if (result.success) {
                return response.json({ message: 'Login successful', token: result.token });
            } else {
                return response.status(401).json({ message: 'Invalid credentials' });
            }
        } catch (error) {
            console.error('Error during login:', error);
            return response.status(500).json({ message: 'Internal Server Error' });
        }
    }  

    async logout(request: Request, response: Response) {
        try {
            const authorizationHeader = request.headers['authorization'];
            if (!authorizationHeader) {
                return response.status(400).json({ message: 'Token não fornecido' });
            }
    
            const token = authorizationHeader.split(' ')[1] as string;
            
            const session = await this.authService.logout(token);
    
            if (!session) {
                return response.status(404).json({ message: 'Sessão não encontrada' });
            }
    
            return response.status(200).json({ message: 'Logout successful'  });
        } catch (error) {
            console.error('Erro ao realizar logout:', error);
            return response.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async listSessions(request: Request, response: Response) {
        try {
            if (request.isAdmin) {
                const sessions = await this.authService.listSessions();
                return response.status(200).json(sessions);
            } else {

                const userId = request.userId;
                
                if (typeof userId !== 'number') {
                    return response.status(400).json({ message: 'User ID is required' });
                }
    
                const sessions = await this.authService.listUserSessions(userId);
                return response.status(200).json(sessions);
            }
        } catch (error) {
            console.error('Error listing sessions:', error);
            return response.status(500).json({ message: 'Internal Server Error' });
        }
    }
    
    
}
