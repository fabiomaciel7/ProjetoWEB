"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
class UserService {
    constructor() {
        this.userRepository = new UserRepository_1.UserRepository();
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.userRepository.findByEmail(data.email);
            if (existingUser) {
                throw new Error('User already exists');
            }
            const hashedPassword = yield this.userRepository.hashPassword(data.password);
            return this.userRepository.create({
                name: data.name,
                email: data.email,
                password: hashedPassword,
            });
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.findAll();
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.findById(id);
        });
    }
    updateUser(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.password) {
                const hashedPassword = yield this.userRepository.hashPassword(data.password);
                data.password = hashedPassword;
            }
            return this.userRepository.update(id, data);
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.delete(id);
        });
    }
    getUserTasks(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.findUserWithTasks(id);
        });
    }
    promoteToAdmin(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findById(userId);
            if (!user) {
                return null;
            }
            user.isAdmin = true;
            return yield this.userRepository.update(userId, user);
        });
    }
    hasAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield this.userRepository.findAdmin();
            return !!admin;
        });
    }
    createDefaultAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultAdminData = {
                name: 'Admin',
                email: 'admin@default.com',
                password: 'admin123',
                isAdmin: true,
            };
            const hashedPassword = yield this.userRepository.hashPassword(defaultAdminData.password);
            return this.userRepository.createAdmin({
                name: defaultAdminData.name,
                email: defaultAdminData.email,
                password: hashedPassword,
                isAdmin: defaultAdminData.isAdmin,
            });
        });
    }
}
exports.UserService = UserService;
