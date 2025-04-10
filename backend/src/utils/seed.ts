
import mongoose from 'mongoose';
import Game from '../models/Game.model';
import WordOfTheDay from '../models/WordOfTheDay.model';
import { logger } from './logger';

export const seedDatabase = async () => {
  try {
    logger.info('Checking if database needs seeding...');
    
    // Check if games collection is empty
    const gamesCount = await Game.countDocuments();
    
    if (gamesCount === 0) {
      logger.info('Seeding games collection...');
      
      // Sample games data
      const gamesData = [
        {
          title: 'Word Search',
          description: 'Find Islamic terms hidden in a grid of letters.',
          difficulty: 'easy',
          category: 'Knowledge-Based',
          slug: 'word-search',
          iconName: 'Search',
          isActive: true,
          comingSoon: false
        },
        {
          title: 'Crossword',
          description: 'Test your knowledge of Islamic terms with our crossword puzzles.',
          difficulty: 'medium',
          category: 'Knowledge-Based',
          slug: 'crossword',
          iconName: 'Grid3X3',
          isActive: true,
          comingSoon: false
        },
        {
          title: 'Word of the Day Challenge',
          description: 'Learn one new Qur\'anic word daily with quizzes.',
          difficulty: 'easy',
          category: 'Qur\'anic Arabic Learning',
          slug: 'word-of-the-day',
          iconName: 'Calendar',
          isActive: true,
          comingSoon: false
        }
      ];
      
      await Game.insertMany(gamesData);
      logger.info('Games collection seeded successfully');
    }
    
    // Check if word-of-the-day collection is empty
    const wordsCount = await WordOfTheDay.countDocuments();
    
    if (wordsCount === 0) {
      logger.info('Seeding word-of-the-day collection...');
      
      // Calculate dates for the next 7 days
      const today = new Date();
      const words = [];
      
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);
        
        words.push({
          word: `Example Word ${i + 1}`,
          arabicWord: 'كلمة',
          transliteration: 'kalimah',
          meaning: 'Word',
          example: {
            arabic: 'هذه كلمة جميلة',
            transliteration: 'hadhihi kalimah jamilah',
            english: 'This is a beautiful word'
          },
          dateActive: date,
          difficulty: 'easy'
        });
      }
      
      await WordOfTheDay.insertMany(words);
      logger.info('Word-of-the-day collection seeded successfully');
    }
    
    logger.info('Database seeding check completed');
  } catch (error) {
    logger.error('Error seeding database:', error);
  }
};
