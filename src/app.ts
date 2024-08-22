import { createServer } from './config/server';
import userRoutes from './routes/UserRoutes';
import authRoutes from './routes/AuthRoutes';
import taskRoutes from './routes/TaskRoutes';

const app = createServer();

app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', taskRoutes);

export default app;