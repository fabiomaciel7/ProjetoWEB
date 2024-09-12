import { UserDto } from '../dtos/UserDto';
import { UserRepository } from '../repositories/UserRepository';
import { isAdmin } from '../middlewares/AuthMiddleware';

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async createUser(data: UserDto & { password: string }) {
        const existingUser = await this.userRepository.findByEmail(data.email);

        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await this.userRepository.hashPassword(data.password);
        
        return this.userRepository.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
            isAdmin: data.isAdmin,
        });
    }

    async getAllUsers() {
        return this.userRepository.findAll();
    }

    async getUserById(id: number) {
        return this.userRepository.findById(id);
    }

    async updateUser(id: number, data: Partial<UserDto>) {
        return this.userRepository.update(id, data);
    }

    async deleteUser(id: number) {
        return this.userRepository.delete(id);
    }

    async getUserTasks(id: number) {
        return this.userRepository.findUserWithTasks(id);
    }

    async promoteToAdmin(userId: number) {
        const user = await this.userRepository.findById(userId);
        
        if (!user) {
            return null;
        }
    
        user.isAdmin = true;
        return await this.userRepository.update(userId, user);
    }

    async hasAdmin(): Promise<boolean> {
        const admin = await this.userRepository.findAdmin();
        return !!admin;
    }

    async createDefaultAdmin() {
        const defaultAdminData: Omit<UserDto, 'id' | 'createdAt'> & { password: string } = {
            name: 'Admin',
            email: 'admin@default.com',
            password: 'admin123',
            isAdmin: true,
        };

        const hashedPassword = await this.userRepository.hashPassword(defaultAdminData.password);

        return this.userRepository.createAdmin({
            name: defaultAdminData.name,
            email: defaultAdminData.email,
            password: hashedPassword,
            isAdmin: defaultAdminData.isAdmin,
        });
    }

}
