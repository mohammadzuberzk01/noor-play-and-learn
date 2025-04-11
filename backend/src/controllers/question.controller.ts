
import { Request, Response } from 'express';
import { 
  TrueFalseQuestion, 
  MultipleChoiceQuestion, 
  MatchingQuestion, 
  WordSearchQuestion,
  QuizQuestion,
  Flashcard,
  MemoryCard,
  CrosswordPuzzle,
  WordHunt
} from '../models/Question.model';
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
    case 'quiz':
      return QuizQuestion;
    case 'flashcards':
      return Flashcard;
    case 'memory':
      return MemoryCard;
    case 'crossword':
      return CrosswordPuzzle;
    case 'word-hunt':
      return WordHunt;
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
    
    // Get the question model based on game type
    const QuestionModel = getQuestionModel(game.gameType);
    
    if (!QuestionModel) {
      return res.status(400).json({
        success: false,
        message: `Unsupported game type: ${game.gameType}`,
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
    
    // Get the question model based on game type
    const QuestionModel = getQuestionModel(game.gameType);
    
    if (!QuestionModel) {
      return res.status(400).json({
        success: false,
        message: `Unsupported game type: ${game.gameType}`,
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
    
    // Find the game to determine its type
    const game = await Game.findOne({ slug: gameSlug });
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
      });
    }
    
    // Get the question model based on game type
    const QuestionModel = getQuestionModel(game.gameType);
    
    if (!QuestionModel) {
      return res.status(400).json({
        success: false,
        message: `Unsupported game type: ${game.gameType}`,
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
    
    // Find the game to determine its type
    const game = await Game.findOne({ slug: gameSlug });
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
      });
    }
    
    // Get the question model based on game type
    const QuestionModel = getQuestionModel(game.gameType);
    
    if (!QuestionModel) {
      return res.status(400).json({
        success: false,
        message: `Unsupported game type: ${game.gameType}`,
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
    
    // Find the game to determine its type
    const game = await Game.findOne({ slug: gameSlug });
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
      });
    }
    
    // Get the question model based on game type
    const QuestionModel = getQuestionModel(game.gameType);
    
    if (!QuestionModel) {
      return res.status(400).json({
        success: false,
        message: `Unsupported game type: ${game.gameType}`,
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
    
    // Get the question model based on game type
    const QuestionModel = getQuestionModel(game.gameType);
    
    if (!QuestionModel) {
      return res.status(400).json({
        success: false,
        message: `Unsupported game type: ${game.gameType}`,
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
