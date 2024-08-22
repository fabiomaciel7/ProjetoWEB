import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { UserController } from '../controllers/UserController';

const userController = new UserController();
const authController = new AuthController();
const router = Router();

router.post('/user/create', (req, res) => userController.create(req, res));
router.get('/users', (req, res) => userController.getAll(req, res));
router.get('/user/:id', (req, res) => userController.getById(req, res));
router.put('/user/update/:id', (req, res) => userController.update(req, res));
router.delete('/user/delete/:id', (req, res) => userController.delete(req, res));
router.get('/user/:id/tasks', (req, res) => userController.getUserTasks(req, res));

export default router;
