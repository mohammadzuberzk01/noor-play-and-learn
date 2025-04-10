
import { Request, Response } from 'express';
import WordOfTheDay from '../models/WordOfTheDay.model';
import { logger } from '../utils/logger';

// Get word of the day
export const getWordOfTheDay = async (req: Request, res: Response) => {
  try {
    // Get current date without time
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Find word for today's date
    const word = await WordOfTheDay.findOne({
      dateActive: {
        $lte: today,
      },
    }).sort({ dateActive: -1 }); // Get the most recent one
    
    if (!word) {
      return res.status(404).json({
        success: false,
        message: 'No word found for today',
      });
    }
    
    res.status(200).json({
      success: true,
      data: word,
    });
  } catch (error) {
    logger.error('Get word of the day error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching word of the day',
    });
  }
};

// Get word of the day by date
export const getWordByDate = async (req: Request, res: Response) => {
  try {
    const { date } = req.params;
    const requestedDate = new Date(date);
    
    if (isNaN(requestedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD',
      });
    }
    
    requestedDate.setHours(0, 0, 0, 0);
    
    // Find word for the specified date
    const word = await WordOfTheDay.findOne({
      dateActive: {
        $lte: requestedDate,
      },
    }).sort({ dateActive: -1 }); // Get the most recent one
    
    if (!word) {
      return res.status(404).json({
        success: false,
        message: 'No word found for the specified date',
      });
    }
    
    res.status(200).json({
      success: true,
      data: word,
    });
  } catch (error) {
    logger.error('Get word by date error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching word by date',
    });
  }
};

// Create word of the day (admin only)
export const createWordOfTheDay = async (req: Request, res: Response) => {
  try {
    const word = await WordOfTheDay.create(req.body);
    
    res.status(201).json({
      success: true,
      data: word,
    });
  } catch (error) {
    logger.error('Create word of the day error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating word of the day',
    });
  }
};

// Update word of the day (admin only)
export const updateWordOfTheDay = async (req: Request, res: Response) => {
  try {
    const word = await WordOfTheDay.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    
    if (!word) {
      return res.status(404).json({
        success: false,
        message: 'Word not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: word,
    });
  } catch (error) {
    logger.error('Update word of the day error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating word of the day',
    });
  }
};

// Delete word of the day (admin only)
export const deleteWordOfTheDay = async (req: Request, res: Response) => {
  try {
    const word = await WordOfTheDay.findById(req.params.id);
    
    if (!word) {
      return res.status(404).json({
        success: false,
        message: 'Word not found',
      });
    }
    
    await word.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    logger.error('Delete word of the day error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting word of the day',
    });
  }
};
