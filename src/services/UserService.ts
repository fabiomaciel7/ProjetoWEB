import { UserDto } from '../dtos/UserDto';
import { UserRepository } from '../repositories/UserRepository';

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
}
