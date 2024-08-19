import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { UserController } from '../controllers/UserController';

const userController = new UserController();
const authController = new AuthController();
const router = Router();

router.post('/user/create', (req, res) => userController.create(req, res));
router.get('/users', (req, res) => userController.getAll(req, res));
router.get('/user/:id', (req, res) => userController.getById(req, res));
router.put('/updateUser/:id', (req, res) => userController.update(req, res));
router.delete('/deleteUser/:id', (req, res) => userController.delete(req, res));
router.post('/user/login', (req, res) => authController.login(req, res));

export default router;
