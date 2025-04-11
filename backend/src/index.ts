
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { logger } from './utils/logger';
import { seedDatabase } from './utils/seed';
import { advancedSeedDatabase } from './utils/advanced-seed';

// Routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import gameRoutes from './routes/game.routes';
import progressRoutes from './routes/progress.routes';
import wordOfTheDayRoutes from './routes/wordOfTheDay.routes';
import questionRoutes from './routes/question.routes';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/word-of-the-day', wordOfTheDayRoutes);
app.use('/api/games', questionRoutes); // Use the game route prefix

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    
    // Seed database if needed (in development environment)
    if (process.env.NODE_ENV === 'development') {
      // Use basic seeding for minimal data
      await seedDatabase();
      
      // Use advanced seeding for more comprehensive data
      await advancedSeedDatabase();
    }
    
    app.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Rejection:', error);
  process.exit(1);
});
