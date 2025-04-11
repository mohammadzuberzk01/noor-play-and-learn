
import Game from '../models/Game.model';
import User from '../models/User.model';
import { TrueFalseQuestion } from '../models/Question.model';
import { logger } from './logger';
import bcrypt from 'bcryptjs';

export const seedDatabase = async () => {
  try {
    // Check if we already have games
    const gamesCount = await Game.countDocuments();
    
    if (gamesCount === 0) {
      logger.info('Seeding games...');
      
      // Add sample games
      const games = [
        {
          title: 'Word Search',
          description: 'Find Islamic terms hidden in a grid of letters.',
          difficulty: 'easy',
          category: 'Knowledge',
          gameType: 'word-search',
          slug: 'word-search',
          iconName: 'Search',
          isActive: true,
          comingSoon: false,
        },
        {
          title: 'Crossword',
          description: 'Test your knowledge of Islamic terms with our crossword puzzles.',
          difficulty: 'medium',
          category: 'Knowledge',
          gameType: 'other',
          slug: 'crossword',
          iconName: 'Grid3X3',
          isActive: true,
          comingSoon: false,
        },
        {
          title: 'Matching',
          description: 'Match Islamic terms with their correct meanings.',
          difficulty: 'easy',
          category: 'Knowledge',
          gameType: 'matching',
          slug: 'matching',
          iconName: 'Puzzle',
          isActive: true,
          comingSoon: false,
        },
        {
          title: 'Trivia',
          description: 'Answer questions about Islam and Islamic history.',
          difficulty: 'medium',
          category: 'Knowledge',
          gameType: 'multiple-choice',
          slug: 'trivia',
          iconName: 'HelpCircle',
          isActive: true,
          comingSoon: false,
        },
        {
          title: 'True or False',
          description: 'Test your knowledge of Islamic facts with true or false questions.',
          difficulty: 'easy',
          category: 'Knowledge',
          gameType: 'true-false',
          slug: 'true-or-false',
          iconName: 'Check',
          isActive: true,
          comingSoon: false,
        }
      ];
      
      await Game.insertMany(games);
      logger.info('Games seeded successfully');
      
      // Add sample true/false questions
      const trueFalseQuestionsCount = await TrueFalseQuestion.countDocuments();
      if (trueFalseQuestionsCount === 0) {
        logger.info('Seeding true/false questions...');
        
        const trueFalseQuestions = [
          {
            gameSlug: 'true-or-false',
            text: "Friday prayer (Jumu'ah) is obligatory for all Muslims, including women and children.",
            isTrue: false,
            explanation: "Friday prayer is obligatory for adult male Muslims who are not sick, traveling, or have valid excuses. It is not obligatory for women, children, travelers, or the sick, though they may attend.",
            difficulty: 'medium',
            isActive: true
          },
          {
            gameSlug: 'true-or-false',
            text: "The Quran has 114 surahs (chapters).",
            isTrue: true,
            explanation: "The Quran consists of 114 surahs (chapters) of varying lengths.",
            difficulty: 'easy',
            isActive: true
          },
          {
            gameSlug: 'true-or-false',
            text: "Zakat (obligatory charity) is always 2.5% of one's wealth regardless of the type of wealth.",
            isTrue: false,
            explanation: "The zakat rate varies based on the type of wealth. While 2.5% applies to money and trade goods, agricultural produce has different rates (5-10%), and livestock has its own calculation system.",
            difficulty: 'medium',
            isActive: true
          },
          {
            gameSlug: 'true-or-false',
            text: "Zamzam water comes from a well located in Madinah.",
            isTrue: false,
            explanation: "Zamzam water comes from a well located in Makkah near the Kaaba, not in Madinah.",
            difficulty: 'easy',
            isActive: true
          },
          {
            gameSlug: 'true-or-false',
            text: "The Islamic calendar is a lunar calendar with 12 months.",
            isTrue: true,
            explanation: "The Islamic (Hijri) calendar is based on lunar months and consists of 12 months in a year.",
            difficulty: 'easy',
            isActive: true
          }
        ];
        
        await TrueFalseQuestion.insertMany(trueFalseQuestions);
        logger.info('True/False questions seeded successfully');
      }
    }
    
    // Check if we have admin user
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      logger.info('Creating admin user...');
      
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true
      });
      
      logger.info('Admin user created successfully');
    }
    
    logger.info('Database seeding completed');
  } catch (error) {
    logger.error('Error seeding database:', error);
  }
};
