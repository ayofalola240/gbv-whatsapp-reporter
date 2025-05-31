// src/app.ts
import express, { Express, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
// import { config } from './config'; // Already imported
// import { logger } from './utils/logger'; // Already imported
import mainApiRouter from './routes/whatsapp.routes'; // Corrected import for the main router
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
app.use('/api', mainApiRouter);

// Global Error Handler (Basic)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
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
