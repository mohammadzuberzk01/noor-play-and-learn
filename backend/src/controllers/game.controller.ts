import { Request, Response } from 'express';
import Game from '../models/Game.model';
import { logger } from '../utils/logger';

// Get all games
export const getAllGames = async (req: Request, res: Response) => {
  try {
    const { category, difficulty } = req.query;
    
    let query: any = { isActive: true };
    
    // Apply filters if provided
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    const games = await Game.find(query).sort({ title: 1 });
    
    res.status(200).json({
      success: true,
      count: games.length,
      data: games,
    });
  } catch (error) {
    logger.error('Get all games error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching games',
    });
  }
};

// Get single game by slug
export const getGameBySlug = async (req: Request, res: Response) => {
  try {
    const game = await Game.findOne({ slug: req.params.slug });
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: game,
    });
  } catch (error) {
    logger.error('Get game by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching game',
    });
  }
};

// Get single game by ID
export const getGameById = async (req: Request, res: Response) => {
  try {
    const game = await Game.findById(req.params.id);
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: game,
    });
  } catch (error) {
    logger.error('Get game by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching game',
    });
  }
};

// Create new game (admin only)
export const createGame = async (req: Request, res: Response) => {
  try {
    // Admin validation should happen in middleware
    const game = await Game.create(req.body);
    
    res.status(201).json({
      success: true,
      data: game,
    });
  } catch (error) {
    logger.error('Create game error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating game',
    });
  }
};

// Update game (admin only)
export const updateGame = async (req: Request, res: Response) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: game,
    });
  } catch (error) {
    logger.error('Update game error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating game',
    });
  }
};

// Delete game (admin only)
export const deleteGame = async (req: Request, res: Response) => {
  try {
    const game = await Game.findById(req.params.id);
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
      });
    }
    
    await game.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    logger.error('Delete game error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting game',
    });
  }
};
