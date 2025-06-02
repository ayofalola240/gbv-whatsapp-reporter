// src/app.ts
import express, { Express, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
// import { config } from './config'; // Already imported
// import { logger } from './utils/logger'; // Already imported
import mainApiRouter from './routes/whatsapp.routes'; // Corrected import for the main router
import dashboardRoutes from './routes/dashboard.routes';
import authRoutes from './routes/auth.routes';
import { logger } from './utils/logger';
import { config } from './config';

const app: Express = express();

// Middlewares
app.use(cors()); // Configure CORS appropriately for production
app.use(bodyParser.json({ limit: '10mb' })); // For WhatsApp payloads
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Basic Route for testing
app.get('/', (req: Request, res: Response) => {
  res.send('GBV WhatsApp Reporting System Backend is running!');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/webhook', mainApiRouter);
app.use('/api/dashboard', dashboardRoutes);

// Global Error Handler (Basic)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error: ${err.message}`, {
    // Log the message and stack separately for better readability
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    stack: err.stack
  });

  // If a status code has already been set on the response (e.g., by a controller), use it.
  // Otherwise, default to 500 for unexpected server errors.
  const statusCode = res.statusCode && res.statusCode >= 400 ? res.statusCode : 500;

  res.status(statusCode).json({
    // Send a more generic message for actual 500 errors.
    // For specific errors (like 400, 401, 403, 404) thrown by controllers, err.message is usually more appropriate.
    message: statusCode === 500 ? 'An unexpected error occurred on the server.' : err.message,
    // Optionally, only include the error stack in development environment for security
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    logger.info('MongoDB Connected successfully.');
  } catch (err: any) {
    logger.error('MongoDB Connection Error:', err.message);
    process.exit(1); // Exit process with failure
  }
};

export { app, connectDB };
