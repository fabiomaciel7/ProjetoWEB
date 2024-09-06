import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { UserDto } from '../dtos/UserDto';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async create(request: Request, response: Response) {
        try {
            const userData: UserDto = request.body;
            const user = await this.userService.createUser(userData);
            return response.status(201).json(user);
        } catch (error: any) {
            console.error('Error creating user:', error);
            return response.status(400).json({ message: error.message });
        }
    }

    async getAll(request: Request, response: Response) {
        try {
            const users = await this.userService.getAllUsers();
            return response.json(users);
        } catch (error: any) {
            console.error('Error getting users:', error);
            return response.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async getById(request: Request, response: Response) {
        try {
            const { id } = request.params;
    
            if (parseInt(id) !== request.userId && !request.isAdmin) {
                return response.status(403).json({ message: 'Acesso negado' });
            }
    
            const user = await this.userService.getUserById(parseInt(id));
            if (!user) {
                return response.status(404).json({ message: 'User not found' });
            }
            return response.json(user);
        } catch (error: any) {
            console.error('Error getting user by ID:', error);
            return response.status(500).json({ message: 'Internal Server Error' });
        }
    }
    

    async update(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const userData: Partial<UserDto> = request.body;

            if (parseInt(id) !== request.userId && !request.isAdmin) {
                return response.status(403).json({ message: 'Acesso negado' });
            }

            const user = await this.userService.updateUser(parseInt(id), userData);
            return response.json(user);
        } catch (error: any) {
            console.error('Error updating user:', error);
            return response.status(400).json({ message: error.message });
        }
    }

    async delete(request: Request, response: Response) {
        try {
            const { id } = request.params;

            if (parseInt(id) !== request.userId && !request.isAdmin) {
                return response.status(403).json({ message: 'Acesso negado' });
            }

            await this.userService.deleteUser(parseInt(id));
            return response.status(204).send();
        } catch (error: any) {
            console.error('Error deleting user:', error);
            return response.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async promoteToAdmin(request: Request, response: Response) {
        try {
            const { id } = request.params;
    
            if (!request.isAdmin) {
                return response.status(403).json({ message: 'Access denied' });
            }
    
            const updatedUser = await this.userService.promoteToAdmin(parseInt(id));
            
            if (!updatedUser) {
                return response.status(404).json({ message: 'User not found' });
            }
    
            return response.status(200).json(updatedUser);
        } catch (error) {
            console.error('Error promoting user to admin:', error);
            return response.status(500).json({ message: 'Internal Server Error' });
        }
    }
    

}
