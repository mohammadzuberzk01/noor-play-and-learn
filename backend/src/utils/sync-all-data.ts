
import { logger } from './logger';
import Game from '../models/Game.model';
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
import { connectDB } from '../config/database';
import mongoose from 'mongoose';

// Sample games for different categories
const sampleGames = [
  // Knowledge-based games
  {
    title: 'Islamic Trivia',
    description: 'Test your knowledge of Islam with multiple-choice questions.',
    difficulty: 'medium',
    category: 'Knowledge',
    gameType: 'multiple-choice',
    slug: 'islamic-trivia',
    iconName: 'HelpCircle',
    isActive: true,
    comingSoon: false
  },
  {
    title: 'Fiqh Mastermind',
    description: 'Challenge your understanding of Islamic jurisprudence.',
    difficulty: 'hard',
    category: 'Knowledge',
    gameType: 'quiz',
    slug: 'fiqh-mastermind',
    iconName: 'BookOpen',
    isActive: true,
    comingSoon: false
  },
  {
    title: 'True or False',
    description: 'Decide whether statements about Islam are true or false.',
    difficulty: 'easy',
    category: 'Knowledge',
    gameType: 'true-false',
    slug: 'true-or-false',
    iconName: 'Check',
    isActive: true,
    comingSoon: false
  },
  
  // Quranic Arabic games
  {
    title: 'Word of the Day',
    description: 'Learn a new Quranic Arabic word every day.',
    difficulty: 'medium',
    category: 'Quranic Arabic',
    gameType: 'flashcards',
    slug: 'word-of-the-day',
    iconName: 'BookOpen',
    isActive: true,
    comingSoon: false
  },
  {
    title: 'Root Word Builder',
    description: 'Learn the Arabic root system by building words from roots.',
    difficulty: 'hard',
    category: 'Quranic Arabic',
    gameType: 'puzzle',
    slug: 'root-word-builder',
    iconName: 'Layers',
    isActive: true,
    comingSoon: false
  },
  {
    title: 'Word Search',
    description: 'Find hidden Islamic terms in a grid of letters.',
    difficulty: 'medium',
    category: 'Quranic Arabic',
    gameType: 'word-search',
    slug: 'word-search',
    iconName: 'Search',
    isActive: true,
    comingSoon: false
  },
  
  // Quran & Hadith games
  {
    title: 'Verse Match',
    description: 'Match the beginning and ending of Quranic verses.',
    difficulty: 'medium',
    category: 'Quran',
    gameType: 'matching',
    slug: 'verse-match',
    iconName: 'Layers',
    isActive: true,
    comingSoon: false
  },
  {
    title: 'Hadith Hunt',
    description: 'Search for specific words or phrases in ahadith.',
    difficulty: 'hard',
    category: 'Hadith',
    gameType: 'word-hunt',
    slug: 'hadith-hunt',
    iconName: 'Search',
    isActive: true,
    comingSoon: false
  },
  {
    title: 'Quran Puzzle',
    description: 'Arrange words to complete Quranic verses.',
    difficulty: 'medium',
    category: 'Quran',
    gameType: 'puzzle',
    slug: 'quran-puzzle',
    iconName: 'Puzzle',
    isActive: true,
    comingSoon: false
  },
  
  // Memory & brain games
  {
    title: 'Prophet Match',
    description: 'Match prophets with their stories and miracles.',
    difficulty: 'medium',
    category: 'Memory',
    gameType: 'matching',
    slug: 'prophet-match',
    iconName: 'Users',
    isActive: true,
    comingSoon: false
  },
  {
    title: 'Flashcards',
    description: 'Learn Islamic concepts with digital flashcards.',
    difficulty: 'easy',
    category: 'Memory',
    gameType: 'flashcards',
    slug: 'flashcards',
    iconName: 'Layers',
    isActive: true,
    comingSoon: false
  },
  {
    title: 'Memory Game',
    description: 'Find matching pairs of Islamic symbols and terms.',
    difficulty: 'easy',
    category: 'Memory',
    gameType: 'memory',
    slug: 'memory',
    iconName: 'Grid3X3',
    isActive: true,
    comingSoon: false
  }
];

// Add more games to reach 37 total
for (let i = 1; i <= 25; i++) {
  const gameTypes = ['quiz', 'true-false', 'matching', 'flashcards', 'puzzle', 'memory', 'word-search'];
  const difficulties = ['easy', 'medium', 'hard'];
  const categories = ['Knowledge', 'Quran', 'Hadith', 'Memory', 'Arabic', 'Activities'];
  const icons = ['BookOpen', 'Search', 'Puzzle', 'GamepadIcon', 'HelpCircle', 'Layers', 'Grid3X3'];
  
  sampleGames.push({
    title: `Islamic Game ${i + 12}`,
    description: `Description for Game ${i + 12}.`,
    difficulty: difficulties[i % difficulties.length] as 'easy' | 'medium' | 'hard',
    category: categories[i % categories.length],
    gameType: gameTypes[i % gameTypes.length],
    slug: `game-${i + 12}`,
    iconName: icons[i % icons.length],
    isActive: true,
    comingSoon: i > 20 // Make some games "coming soon"
  });
}

// Sample true/false questions
const trueFalseQuestions = [
  {
    text: 'The Quran has 114 surahs.',
    isTrue: true,
    explanation: 'The Quran indeed consists of 114 surahs or chapters.',
    difficulty: 'easy',
    isActive: true
  },
  {
    text: 'There are 5 pillars of Islam.',
    isTrue: true,
    explanation: 'Islam is built upon 5 pillars: Shahada, Salah, Zakat, Sawm, and Hajj.',
    difficulty: 'easy',
    isActive: true
  },
  {
    text: 'Ramadan is the second month of the Islamic calendar.',
    isTrue: false,
    explanation: 'Ramadan is the ninth month of the Islamic calendar, not the second.',
    difficulty: 'medium',
    isActive: true
  },
  {
    text: 'The first revelation of the Quran was "Read in the name of your Lord".',
    isTrue: true,
    explanation: 'The first revelation began with "Iqra bismi rabbika" (Read in the name of your Lord).',
    difficulty: 'medium',
    isActive: true
  },
  {
    text: 'There are 25 prophets mentioned by name in the Quran.',
    isTrue: true,
    explanation: 'The Quran mentions 25 prophets by name, although Islamic tradition states there were many more prophets.',
    difficulty: 'medium',
    isActive: true
  }
];

// Sample multiple-choice questions
const multipleChoiceQuestions = [
  {
    question: 'How many rukus (bowing positions) are there in a 2-rakah prayer?',
    options: ['1', '2', '3', '4'],
    correctOptionIndex: 1,
    explanation: 'In a 2-rakah prayer, there are 2 rukus, one in each rakah.',
    difficulty: 'easy',
    isActive: true
  },
  {
    question: 'Which of the following is NOT one of the five pillars of Islam?',
    options: ['Salah (Prayer)', 'Ihsan (Excellence)', 'Sawm (Fasting)', 'Zakat (Charity)'],
    correctOptionIndex: 1,
    explanation: 'Ihsan is not one of the five pillars. The five pillars are: Shahada, Salah, Zakat, Sawm, and Hajj.',
    difficulty: 'easy',
    isActive: true
  },
  {
    question: 'What is the first surah in the Quran?',
    options: ['Al-Fatihah', 'Al-Baqarah', 'Al-Ikhlas', 'Al-Nas'],
    correctOptionIndex: 0,
    explanation: 'Al-Fatihah is the first surah in the Quran.',
    difficulty: 'easy',
    isActive: true
  }
];

// Sample matching questions
const matchingQuestions = [
  {
    pairs: [
      { left: 'Ibrahim (AS)', right: 'Father of prophets' },
      { left: 'Musa (AS)', right: 'Received the Torah' },
      { left: 'Isa (AS)', right: 'Performed miracles of healing' },
      { left: 'Nuh (AS)', right: 'Built an ark' }
    ],
    difficulty: 'medium',
    isActive: true
  },
  {
    pairs: [
      { left: 'Salah', right: 'Prayer' },
      { left: 'Sawm', right: 'Fasting' },
      { left: 'Zakat', right: 'Charity' },
      { left: 'Hajj', right: 'Pilgrimage' }
    ],
    difficulty: 'easy',
    isActive: true
  }
];

// Sample word search questions
const wordSearchQuestions = [
  {
    grid: [
      ['S', 'A', 'L', 'A', 'H', 'P', 'R', 'A', 'Y', 'E', 'R'],
      ['Z', 'A', 'K', 'A', 'T', 'Q', 'U', 'R', 'A', 'N', 'A'],
      ['H', 'A', 'J', 'J', 'S', 'A', 'W', 'M', 'D', 'I', 'M'],
      ['I', 'M', 'A', 'N', 'T', 'A', 'Q', 'W', 'A', 'Y', 'A'],
      ['S', 'H', 'A', 'H', 'A', 'D', 'A', 'I', 'H', 'S', 'D'],
      ['L', 'A', 'M', 'M', 'U', 'H', 'A', 'M', 'M', 'A', 'D'],
      ['A', 'M', 'A', 'N', 'A', 'H', 'K', 'A', 'B', 'A', 'H'],
      ['M', 'E', 'S', 'J', 'I', 'D', 'K', 'H', 'A', 'I', 'R']
    ],
    words: [
      {
        word: 'SALAH',
        meaning: 'Islamic prayer performed five times a day',
        direction: 'horizontal',
        startRow: 0,
        startCol: 0
      },
      {
        word: 'ZAKAT',
        meaning: 'Obligatory charity in Islam',
        direction: 'horizontal',
        startRow: 1,
        startCol: 0
      },
      {
        word: 'HAJJ',
        meaning: 'Pilgrimage to Mecca',
        direction: 'horizontal',
        startRow: 2,
        startCol: 0
      },
      {
        word: 'IMAN',
        meaning: 'Faith in Allah',
        direction: 'horizontal',
        startRow: 3,
        startCol: 0
      },
      {
        word: 'SHAHADA',
        meaning: 'Declaration of faith in Islam',
        direction: 'horizontal',
        startRow: 4,
        startCol: 0
      }
    ],
    hint: 'Look for Islamic pillars and concepts',
    difficulty: 'medium',
    isActive: true
  }
];

// Sample flashcards
const flashcards = [
  {
    front: 'What is the first pillar of Islam?',
    back: 'Shahada - The declaration of faith',
    category: 'Pillars of Islam',
    difficulty: 'easy',
    isActive: true
  },
  {
    front: 'What is the meaning of "Bismillah"?',
    back: 'In the name of Allah',
    category: 'Common Phrases',
    difficulty: 'easy',
    isActive: true
  },
  {
    front: 'Who was the first muezzin in Islam?',
    back: 'Bilal ibn Rabah (RA)',
    category: 'Islamic History',
    difficulty: 'medium',
    isActive: true
  }
];

// Sample memory cards
const memoryCards = [
  {
    cards: [
      { id: '1a', content: 'Salah', matchId: '1b' },
      { id: '1b', content: 'Prayer', matchId: '1a' },
      { id: '2a', content: 'Zakat', matchId: '2b' },
      { id: '2b', content: 'Charity', matchId: '2a' },
      { id: '3a', content: 'Sawm', matchId: '3b' },
      { id: '3b', content: 'Fasting', matchId: '3a' },
      { id: '4a', content: 'Hajj', matchId: '4b' },
      { id: '4b', content: 'Pilgrimage', matchId: '4a' }
    ],
    timeLimit: 60,
    difficulty: 'easy',
    isActive: true
  }
];

// Function to add sample games to the database
export const syncAllData = async () => {
  try {
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    logger.info('Starting data synchronization...');
    
    // Insert all games
    logger.info(`Adding ${sampleGames.length} games...`);
    
    for (const game of sampleGames) {
      const existingGame = await Game.findOne({ slug: game.slug });
      
      if (existingGame) {
        // Update existing game
        await Game.findByIdAndUpdate(existingGame._id, game);
        logger.info(`Updated game: ${game.title}`);
      } else {
        // Create new game
        await Game.create(game);
        logger.info(`Created game: ${game.title}`);
      }
    }
    
    // Get all games with slugs
    const games = await Game.find({});
    
    // Add questions for each game
    for (const game of games) {
      logger.info(`Adding questions for ${game.title}...`);
      
      switch (game.gameType) {
        case 'true-false':
          // Add true/false questions
          for (const question of trueFalseQuestions) {
            await TrueFalseQuestion.findOneAndUpdate(
              { 
                text: question.text,
                gameSlug: game.slug
              },
              { 
                ...question,
                gameSlug: game.slug
              },
              { upsert: true, new: true }
            );
          }
          logger.info(`Added ${trueFalseQuestions.length} true/false questions to ${game.title}`);
          break;
          
        case 'multiple-choice':
        case 'quiz':
          // Add multiple-choice questions
          for (const question of multipleChoiceQuestions) {
            await MultipleChoiceQuestion.findOneAndUpdate(
              { 
                question: question.question,
                gameSlug: game.slug
              },
              { 
                ...question,
                gameSlug: game.slug
              },
              { upsert: true, new: true }
            );
          }
          logger.info(`Added ${multipleChoiceQuestions.length} multiple-choice questions to ${game.title}`);
          break;
          
        case 'matching':
          // Add matching questions
          for (const question of matchingQuestions) {
            await MatchingQuestion.findOneAndUpdate(
              { 
                'pairs.0.left': question.pairs[0].left,
                gameSlug: game.slug
              },
              { 
                ...question,
                gameSlug: game.slug
              },
              { upsert: true, new: true }
            );
          }
          logger.info(`Added ${matchingQuestions.length} matching questions to ${game.title}`);
          break;
          
        case 'word-search':
          // Add word search questions
          for (const question of wordSearchQuestions) {
            await WordSearchQuestion.findOneAndUpdate(
              { 
                'words.0.word': question.words[0].word,
                gameSlug: game.slug
              },
              { 
                ...question,
                gameSlug: game.slug
              },
              { upsert: true, new: true }
            );
          }
          logger.info(`Added ${wordSearchQuestions.length} word search questions to ${game.title}`);
          break;
          
        case 'flashcards':
          // Add flashcards
          for (const card of flashcards) {
            await Flashcard.findOneAndUpdate(
              { 
                front: card.front,
                gameSlug: game.slug
              },
              { 
                ...card,
                gameSlug: game.slug
              },
              { upsert: true, new: true }
            );
          }
          logger.info(`Added ${flashcards.length} flashcards to ${game.title}`);
          break;
          
        case 'memory':
          // Add memory cards
          for (const cardSet of memoryCards) {
            await MemoryCard.findOneAndUpdate(
              { 
                'cards.0.id': cardSet.cards[0].id,
                gameSlug: game.slug
              },
              { 
                ...cardSet,
                gameSlug: game.slug
              },
              { upsert: true, new: true }
            );
          }
          logger.info(`Added ${memoryCards.length} memory card sets to ${game.title}`);
          break;
          
        default:
          logger.info(`No sample questions available for game type: ${game.gameType}`);
      }
    }
    
    logger.info('Data synchronization completed successfully!');
    return { success: true, message: 'Data synchronized successfully' };
    
  } catch (error) {
    logger.error('Error synchronizing data:', error);
    return { success: false, message: 'Error synchronizing data', error };
  }
};

// Export function to run on demand
export default syncAllData;
