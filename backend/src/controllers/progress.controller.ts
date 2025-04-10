
import { Request, Response } from 'express';
import UserProgress from '../models/UserProgress.model';
import Game from '../models/Game.model';
import { logger } from '../utils/logger';

// Get user progress for all games
export const getUserProgress = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    const progress = await UserProgress.find({ userId })
      .populate('gameId', 'title slug category difficulty');
    
    res.status(200).json({
      success: true,
      count: progress.length,
      data: progress,
    });
  } catch (error) {
    logger.error('Get user progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user progress',
    });
  }
};

// Get user progress for a specific game
export const getGameProgress = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { gameSlug } = req.params;
    
    // Find game by slug
    const game = await Game.findOne({ slug: gameSlug });
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
      });
    }
    
    // Find progress for this game
    const progress = await UserProgress.findOne({
      userId,
      gameId: game._id,
    }).populate('gameId', 'title slug category difficulty');
    
    // If no progress found, return empty default
    if (!progress) {
      return res.status(200).json({
        success: true,
        data: {
          userId,
          gameId: game._id,
          score: 0,
          level: 1,
          completedChallenges: [],
          streak: 0,
          lastPlayed: null,
        },
      });
    }
    
    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    logger.error('Get game progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching game progress',
    });
  }
};

// Update user progress for a game
export const updateGameProgress = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { gameSlug } = req.params;
    const { score, level, completedChallenges, streak } = req.body;
    
    // Find game by slug
    const game = await Game.findOne({ slug: gameSlug });
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
      });
    }
    
    // Find and update progress, or create if not exists
    const progress = await UserProgress.findOneAndUpdate(
      { userId, gameId: game._id },
      {
        score,
        level,
        completedChallenges,
        streak,
        lastPlayed: Date.now(),
      },
      {
        new: true,
        upsert: true, // Create if not exists
        runValidators: true,
      }
    ).populate('gameId', 'title slug category difficulty');
    
    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    logger.error('Update game progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating game progress',
    });
  }
};
