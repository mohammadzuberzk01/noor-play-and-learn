
import { Request, Response } from 'express';
import { TrueFalseQuestion, MultipleChoiceQuestion, MatchingQuestion, WordSearchQuestion } from '../models/Question.model';
import Game from '../models/Game.model';
import { logger } from '../utils/logger';

// Helper function to get the appropriate question model
const getQuestionModel = (gameType: string) => {
  switch (gameType) {
    case 'true-false':
      return TrueFalseQuestion;
    case 'multiple-choice':
      return MultipleChoiceQuestion;
    case 'matching':
      return MatchingQuestion;
    case 'word-search':
      return WordSearchQuestion;
    default:
      return null;
  }
};

// Get questions for a game
export const getQuestions = async (req: Request, res: Response) => {
  try {
    const { gameSlug } = req.params;
    const { difficulty, limit = 10, offset = 0 } = req.query;
    
    // Find the game to determine its type
    const game = await Game.findOne({ slug: gameSlug });
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
      });
    }
    
    // Determine the question model based on game type
    const gameType = game.category.toLowerCase().includes('true-false') 
      ? 'true-false'
      : game.category.toLowerCase().includes('multiple-choice')
      ? 'multiple-choice'
      : game.category.toLowerCase().includes('matching')
      ? 'matching'
      : game.category.toLowerCase().includes('word-search')
      ? 'word-search'
      : null;
    
    const QuestionModel = getQuestionModel(gameType || '');
    
    if (!QuestionModel) {
      return res.status(400).json({
        success: false,
        message: 'Invalid game type',
      });
    }
    
    // Build query
    let query: any = { gameSlug, isActive: true };
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    // Count total questions
    const total = await QuestionModel.countDocuments(query);
    
    // Get questions with pagination
    const questions = await QuestionModel.find(query)
      .sort({ createdAt: -1 })
      .skip(Number(offset))
      .limit(Number(limit));
    
    res.status(200).json({
      success: true,
      count: questions.length,
      total,
      data: questions,
      pagination: {
        current: Number(offset) / Number(limit) + 1,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    logger.error('Get questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching questions',
    });
  }
};

// Get a single question
export const getQuestion = async (req: Request, res: Response) => {
  try {
    const { gameSlug, questionId } = req.params;
    
    // Find the game to determine its type
    const game = await Game.findOne({ slug: gameSlug });
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
      });
    }
    
    // Determine the question model based on game type
    const gameType = game.category.toLowerCase().includes('true-false') 
      ? 'true-false'
      : game.category.toLowerCase().includes('multiple-choice')
      ? 'multiple-choice'
      : game.category.toLowerCase().includes('matching')
      ? 'matching'
      : game.category.toLowerCase().includes('word-search')
      ? 'word-search'
      : null;
    
    const QuestionModel = getQuestionModel(gameType || '');
    
    if (!QuestionModel) {
      return res.status(400).json({
        success: false,
        message: 'Invalid game type',
      });
    }
    
    const question = await QuestionModel.findOne({
      _id: questionId,
      gameSlug,
      isActive: true,
    });
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    logger.error('Get question error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching question',
    });
  }
};

// Create a new question (admin only)
export const createQuestion = async (req: Request, res: Response) => {
  try {
    const { gameSlug } = req.params;
    const { questionType } = req.body;
    
    // Find the game
    const game = await Game.findOne({ slug: gameSlug });
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
      });
    }
    
    // Determine the question model based on question type
    const QuestionModel = getQuestionModel(questionType);
    
    if (!QuestionModel) {
      return res.status(400).json({
        success: false,
        message: 'Invalid question type',
      });
    }
    
    // Create question
    const question = await QuestionModel.create({
      ...req.body,
      gameSlug,
    });
    
    res.status(201).json({
      success: true,
      data: question,
    });
  } catch (error) {
    logger.error('Create question error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating question',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Update a question (admin only)
export const updateQuestion = async (req: Request, res: Response) => {
  try {
    const { gameSlug, questionId } = req.params;
    const { questionType } = req.body;
    
    // Find the game
    const game = await Game.findOne({ slug: gameSlug });
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
      });
    }
    
    // Determine the question model based on question type
    const QuestionModel = getQuestionModel(questionType);
    
    if (!QuestionModel) {
      return res.status(400).json({
        success: false,
        message: 'Invalid question type',
      });
    }
    
    // Update question
    const question = await QuestionModel.findOneAndUpdate(
      { _id: questionId, gameSlug },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    logger.error('Update question error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating question',
    });
  }
};

// Delete a question (admin only)
export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    const { gameSlug, questionId } = req.params;
    const { questionType } = req.body;
    
    // Find the game
    const game = await Game.findOne({ slug: gameSlug });
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
      });
    }
    
    // Determine the question model based on question type
    const QuestionModel = getQuestionModel(questionType);
    
    if (!QuestionModel) {
      return res.status(400).json({
        success: false,
        message: 'Invalid question type',
      });
    }
    
    // Delete question (soft delete by setting isActive to false)
    const question = await QuestionModel.findOneAndUpdate(
      { _id: questionId, gameSlug },
      { isActive: false },
      { new: true }
    );
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: {},
      message: 'Question deleted successfully',
    });
  } catch (error) {
    logger.error('Delete question error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting question',
    });
  }
};

// Get random questions for a game
export const getRandomQuestions = async (req: Request, res: Response) => {
  try {
    const { gameSlug } = req.params;
    const { count = 10, difficulty } = req.query;
    
    // Find the game to determine its type
    const game = await Game.findOne({ slug: gameSlug });
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
      });
    }
    
    // Determine the question model based on game type
    const gameType = game.category.toLowerCase().includes('true-false') 
      ? 'true-false'
      : game.category.toLowerCase().includes('multiple-choice')
      ? 'multiple-choice'
      : game.category.toLowerCase().includes('matching')
      ? 'matching'
      : game.category.toLowerCase().includes('word-search')
      ? 'word-search'
      : null;
    
    const QuestionModel = getQuestionModel(gameType || '');
    
    if (!QuestionModel) {
      return res.status(400).json({
        success: false,
        message: 'Invalid game type',
      });
    }
    
    // Build query
    let query: any = { gameSlug, isActive: true };
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    // Get random questions
    const questions = await QuestionModel.aggregate([
      { $match: query },
      { $sample: { size: Number(count) } }
    ]);
    
    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    logger.error('Get random questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching random questions',
    });
  }
};
