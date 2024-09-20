import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { UserDto } from '../dtos/UserDto';
import { createUserSchema } from '../validation/UserCreateValidation';
import { updateUserSchema } from '../validation/UserUpdateValidation';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async create(request: Request, response: Response) {
        try {
            const { error, value } = createUserSchema.validate(request.body, { abortEarly: false });

            if (error) {
                return response.status(400).json({ 
                    message: 'Erro de validação',
                    details: error.details.map(detail => detail.message),
                });
            }

            const userData: UserDto = value;
            const user = await this.userService.createUser(userData);
            return response.status(201).json(user);
        } catch (error: any) {
            console.error('Erro na criação de usuário:', error);
            return response.status(400).json({ message: error.message });
        }
    }

    async getAll(request: Request, response: Response) {
        try {
            const users = await this.userService.getAllUsers();
            return response.json(users);
        } catch (error: any) {
            console.error('Erro ao listar usuários:', error);
            return response.status(500).json({ message: 'Erro interno do servidor' });
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
                return response.status(404).json({ message: 'Usuário não encontrado' });
            }
            return response.json(user);
        } catch (error: any) {
            console.error('Erro ao visualizar usuário pelo ID:', error);
            return response.status(500).json({ message: 'Erro interno do servidor' });
        }
    }
    

    async update(request: Request, response: Response) {
        try {

            const { error, value } = updateUserSchema.validate(request.body, { abortEarly: false });

            if (error) {
                return response.status(400).json({ 
                    message: 'Erro de validação',
                    details: error.details.map(detail => detail.message),
                });
            }

            const { id } = request.params;
            const userData: Partial<UserDto> = request.body;

            if (parseInt(id) !== request.userId && !request.isAdmin) {
                return response.status(403).json({ message: 'Acesso negado' });
            }

            const user = await this.userService.updateUser(parseInt(id), userData);
            return response.json(user);
        } catch (error: any) {
            console.error('Erro ao atualizar o ID:', error);
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
            console.error('Erro ao deletar usuário:', error);
            return response.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    async promoteToAdmin(request: Request, response: Response) {
        try {
            const { id } = request.params;
    
            if (!request.isAdmin) {
                return response.status(403).json({ message: 'Access negado' });
            }
    
            const updatedUser = await this.userService.promoteToAdmin(parseInt(id));
            
            if (!updatedUser) {
                return response.status(404).json({ message: 'Usuário não existe' });
            }
    
            return response.status(200).json(updatedUser);
        } catch (error) {
            console.error('Erro ao promover usuário para Admin:', error);
            return response.status(500).json({ message: 'Erro interno do servidor' });
        }
    }
    

}
