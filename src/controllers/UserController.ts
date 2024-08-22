import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { AuthController } from './AuthController';
import { UserDto } from '../dtos/UserDto';

export class UserController {
    private userService: UserService;
    private authController: AuthController;

    constructor() {
        this.userService = new UserService();
        this.authController = new AuthController();
    }

    async create(request: Request, response: Response) {
        try {
            const userData: UserDto = request.body;
            const user = await this.userService.createUser(userData);
            return response.status(201).json(user);
        } catch (error: any) {
            return response.status(400).json({ message: error.message });
        }
    }

    async getAll(request: Request, response: Response) {
        try {
            const users = await this.userService.getAllUsers();
            return response.json(users);
        } catch (error: any) {
            return response.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async getById(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const user = await this.userService.getUserById(parseInt(id));
            if (!user) {
                return response.status(404).json({ message: 'User not found' });
            }
            return response.json(user);
        } catch (error: any) {
            return response.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async update(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const userData: Partial<UserDto> = request.body;
            const user = await this.userService.updateUser(parseInt(id), userData);
            return response.json(user);
        } catch (error: any) {
            return response.status(400).json({ message: error.message });
        }
    }

    async delete(request: Request, response: Response) {
        try {
            const { id } = request.params;
            await this.userService.deleteUser(parseInt(id));
            return response.status(204).send();
        } catch (error: any) {
            return response.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async getUserTasks(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const user = await this.userService.getUserTasks(parseInt(id));
            if (!user) {
                return response.status(404).json({ message: 'User not found' });
            }
            return response.json(user.tasks);
        } catch (error: any) {
            return response.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
