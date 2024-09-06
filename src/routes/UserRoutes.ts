import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { verifyToken, isAdmin} from '../middlewares/AuthMiddleware';

const userController = new UserController();
const router = Router();

router.post('/user/create', (req, res) => userController.create(req, res));
router.get('/users',verifyToken,  isAdmin, (req, res) => userController.getAll(req, res));
router.get('/user/:id',verifyToken,  (req, res) => userController.getById(req, res));
router.put('/user/update/:id',verifyToken,  (req, res) => userController.update(req, res));
router.delete('/user/delete/:id',verifyToken,  (req, res) => userController.delete(req, res));
router.post('/users/promote/:id', verifyToken, isAdmin, (req, res) =>  userController.promoteToAdmin(req, res));

export default router;
