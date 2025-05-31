import { app, connectDB } from './app';
import { config } from './config';
import { logger } from './utils/logger';

const startServer = async () => {
  await connectDB(); // Connect to database first

  app
    .listen(config.port, () => {
      logger.info(`Server listening on http://localhost:${config.port}`);
      logger.info(`WhatsApp Webhook should be configured to: http://<YOUR_PUBLIC_URL>/api/webhook/whatsapp`);
    })
    .on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        logger.error(`Port ${config.port} is already in use.`);
      } else {
        logger.error('Server startup error:', err);
      }
      process.exit(1);
    });
};

startServer();
