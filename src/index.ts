import app from './app';
import { connectDatabase } from './config/database';
import { UserService } from './services/UserService';

const port = 3000;

async function startServer() {
  try {
    await connectDatabase();

    const userService = new UserService();
    const hasAdmin = await userService.hasAdmin();

    if (!hasAdmin) {
      await userService.createDefaultAdmin();
      console.log('Admin padrão criado: admin@default.com');
    }

    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados ou iniciar o servidor:', err);
  }
}

startServer();
