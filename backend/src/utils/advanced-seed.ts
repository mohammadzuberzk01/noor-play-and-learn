
import Game from '../models/Game.model';
import User from '../models/User.model';
import { 
  TrueFalseQuestion, 
  MultipleChoiceQuestion, 
  MatchingQuestion, 
  WordSearchQuestion 
} from '../models/Question.model';
import { logger } from './logger';
import bcrypt from 'bcryptjs';

// Advanced seeding function for all 37 games
export const advancedSeedDatabase = async () => {
  try {
    logger.info('Starting advanced database seeding...');

    // Create admin user if it doesn't exist
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

    // Check if we already have games
    const gamesCount = await Game.countDocuments();
    
    if (gamesCount === 0) {
      logger.info('Seeding games...');
      
      // Add all 37 games
      const games = [
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
          title: 'Crossword',
          description: 'Test your knowledge with Islamic crossword puzzles.',
          difficulty: 'medium',
          category: 'Knowledge',
          gameType: 'crossword',
          slug: 'crossword',
          iconName: 'Grid3X3',
          isActive: true,
          comingSoon: false,
        },
        {
          title: 'Quiz Duel',
          description: 'Compete with others in Islamic knowledge quizzes.',
          difficulty: 'medium',
          category: 'Knowledge',
          gameType: 'quiz',
          slug: 'quiz-duel',
          iconName: 'Zap',
          isActive: true,
          comingSoon: false,
        },
        {
          title: 'Flashcards',
          description: 'Learn Islamic concepts with interactive flashcards.',
          difficulty: 'easy',
          category: 'Memory',
          gameType: 'flashcards',
          slug: 'flashcards',
          iconName: 'Layers',
          isActive: true,
          comingSoon: false,
        },
        {
          title: 'Fiqh Mastermind',
          description: 'Test your knowledge of Islamic jurisprudence.',
          difficulty: 'hard',
          category: 'Knowledge',
          gameType: 'multiple-choice',
          slug: 'fiqh-mastermind',
          iconName: 'Brain',
          isActive: true,
          comingSoon: false,
        },
        {
          title: 'Prophet Match',
          description: 'Match prophets with their stories and miracles.',
          difficulty: 'medium',
          category: 'Knowledge',
          gameType: 'matching',
          slug: 'prophet-match',
          iconName: 'Users',
          isActive: true,
          comingSoon: false,
        },
        {
          title: 'Word of the Day',
          description: 'Learn a new Islamic term every day.',
          difficulty: 'easy',
          category: 'Knowledge',
          gameType: 'other',
          slug: 'word-of-the-day',
          iconName: 'Calendar',
          isActive: true,
          comingSoon: false,
        },
        {
          title: 'Ninety-Nine Names',
          description: 'Learn the 99 names of Allah.',
          difficulty: 'medium',
          category: 'Knowledge',
          gameType: 'flashcards',
          slug: 'ninety-nine-names',
          iconName: 'Star',
          isActive: true,
          comingSoon: false,
        },
        {
          title: 'Hadith Collector',
          description: 'Collect and learn authentic hadiths.',
          difficulty: 'medium',
          category: 'Knowledge',
          gameType: 'other',
          slug: 'hadith-collector',
          iconName: 'BookOpen',
          isActive: true,
          comingSoon: false,
        },
        {
          title: 'Quranic Word Bingo',
          description: 'Play bingo with Quranic words.',
          difficulty: 'medium',
          category: 'Quran',
          gameType: 'other',
          slug: 'quranic-word-bingo',
          iconName: 'Grid',
          isActive: true,
          comingSoon: false,
        },
        {
          title: 'Word Hunt',
          description: 'Find as many words as you can from given letters.',
          difficulty: 'medium',
          category: 'Knowledge',
          gameType: 'word-hunt',
          slug: 'word-hunt',
          iconName: 'Search',
          isActive: true,
          comingSoon: false,
        },
        {
          title: 'Tajweed Trainer',
          description: 'Learn and practice tajweed rules for Quran recitation.',
          difficulty: 'hard',
          category: 'Quran',
          gameType: 'other',
          slug: 'tajweed-trainer',
          iconName: 'BookOpen',
          isActive: true,
          comingSoon: true,
        },
        {
          title: 'Root Word Builder',
          description: 'Build Arabic words from root letters.',
          difficulty: 'hard',
          category: 'Arabic',
          gameType: 'other',
          slug: 'root-word-builder',
          iconName: 'FileText',
          isActive: true,
          comingSoon: true,
        },
        {
          title: 'Harakat Hero',
          description: 'Practice placing Arabic diacritical marks correctly.',
          difficulty: 'hard',
          category: 'Arabic',
          gameType: 'other',
          slug: 'harakat-hero',
          iconName: 'Edit2',
          isActive: true,
          comingSoon: true,
        },
        {
          title: 'Verse Match',
          description: 'Match Quranic verses with their translations.',
          difficulty: 'medium',
          category: 'Quran',
          gameType: 'matching',
          slug: 'verse-match',
          iconName: 'Link',
          isActive: true,
          comingSoon: false,
        },
        {
          title: 'Ayah Breakdown',
          description: 'Learn the word-by-word meaning of Quranic verses.',
          difficulty: 'hard',
          category: 'Quran',
          gameType: 'other',
          slug: 'ayah-breakdown',
          iconName: 'Layers',
          isActive: true,
          comingSoon: true,
        },
        {
          title: 'Calligraphy',
          description: 'Learn about Islamic calligraphy styles.',
          difficulty: 'medium',
          category: 'Art',
          gameType: 'other',
          slug: 'calligraphy',
          iconName: 'Feather',
          isActive: true,
          comingSoon: true,
        },
        // Additional games to reach 37 total
        {
          title: 'Pillars Puzzle',
          description: 'Learn about the pillars of Islam and Iman through puzzles.',
          difficulty: 'easy',
          category: 'Knowledge',
          gameType: 'puzzle',
          slug: 'pillars-puzzle',
          iconName: 'Columns',
          isActive: true,
          comingSoon: false,
        },
        {
          title: 'Hadith Hunt',
          description: 'Search for authentic hadiths in a scavenger hunt.',
          difficulty: 'medium',
          category: 'Knowledge',
          gameType: 'other',
          slug: 'hadith-hunt',
          iconName: 'Search',
          isActive: true,
          comingSoon: false,
        },
        {
          title: 'Match the Meaning',
          description: 'Match Arabic words with their meanings.',
          difficulty: 'medium',
          category: 'Arabic',
          gameType: 'matching',
          slug: 'match-the-meaning',
          iconName: 'Link',
          isActive: true,
          comingSoon: false,
        },
        {
          title: 'Quran Puzzle',
          description: 'Complete puzzles about Quranic stories and verses.',
          difficulty: 'medium',
          category: 'Quran',
          gameType: 'puzzle',
          slug: 'quran-puzzle',
          iconName: 'Puzzle',
          isActive: true,
          comingSoon: false,
        },
        {
          title: 'Fard or Sunnah',
          description: 'Test your knowledge on the difference between obligatory and recommended acts.',
          difficulty: 'medium',
          category: 'Knowledge',
          gameType: 'true-false',
          slug: 'fard-or-sunnah',
          iconName: 'Check',
          isActive: true,
          comingSoon: false,
        },
        {
          title: 'Hifz Hero',
          description: 'Practice memorizing Quranic verses.',
          difficulty: 'hard',
          category: 'Quran',
          gameType: 'memory',
          slug: 'hifz-hero',
          iconName: 'Brain',
          isActive: true,
          comingSoon: true,
        },
        {
          title: 'Word by Word',
          description: 'Learn Quranic vocabulary word by word.',
          difficulty: 'medium',
          category: 'Quran',
          gameType: 'other',
          slug: 'word-by-word',
          iconName: 'Bookmark',
          isActive: true,
          comingSoon: false,
        },
        {
          title: 'Salah Streak',
          description: 'Track and maintain your daily prayer streak.',
          difficulty: 'easy',
          category: 'Activity',
          gameType: 'other',
          slug: 'salah-streak',
          iconName: 'Calendar',
          isActive: true,
          comingSoon: false,
        },
        {
          title: 'Sound Salah',
          description: 'Learn the proper pronunciation of words used in prayer.',
          difficulty: 'medium',
          category: 'Activity',
          gameType: 'other',
          slug: 'sound-salah',
          iconName: 'Volume2',
          isActive: true,
          comingSoon: true,
        },
        {
          title: 'Dhikr Quest',
          description: 'Learn and practice various forms of remembrance of Allah.',
          difficulty: 'easy',
          category: 'Activity',
          gameType: 'other',
          slug: 'dhikr-quest',
          iconName: 'Heart',
          isActive: true,
          comingSoon: false,
        },
        {
          title: 'Prophet Path',
          description: 'Follow the footsteps of the Prophet Muhammad (PBUH).',
          difficulty: 'medium',
          category: 'Knowledge',
          gameType: 'other',
          slug: 'prophet-path',
          iconName: 'Map',
          isActive: true,
          comingSoon: true,
        },
        {
          title: 'Sahaba Showdown',
          description: 'Learn about the companions of the Prophet (PBUH).',
          difficulty: 'medium',
          category: 'Knowledge',
          gameType: 'quiz',
          slug: 'sahaba-showdown',
          iconName: 'Users',
          isActive: true,
          comingSoon: false,
        },
        {
          title: 'Word Hunt Quranic',
          description: 'Find Quranic words in a letter grid.',
          difficulty: 'hard',
          category: 'Quran',
          gameType: 'word-hunt',
          slug: 'word-hunt-quranic',
          iconName: 'Search',
          isActive: true,
          comingSoon: true,
        },
        {
          title: 'Ayah Audio',
          description: 'Listen to and memorize Quranic verses with audio.',
          difficulty: 'medium',
          category: 'Quran',
          gameType: 'other',
          slug: 'ayah-audio',
          iconName: 'Music',
          isActive: true,
          comingSoon: true,
        },
        {
          title: 'Muslim Tracker',
          description: 'Track your daily Islamic practices.',
          difficulty: 'easy',
          category: 'Activity',
          gameType: 'other',
          slug: 'muslim-tracker',
          iconName: 'CheckSquare',
          isActive: true,
          comingSoon: false,
        },
        {
          title: 'Ramadan Timer',
          description: 'Track iftar and suhoor times during Ramadan.',
          difficulty: 'easy',
          category: 'Activity',
          gameType: 'other',
          slug: 'ramadan-timer',
          iconName: 'Clock',
          isActive: true,
          comingSoon: false,
        },
        {
          title: 'Maze',
          description: 'Navigate through mazes while learning Islamic facts.',
          difficulty: 'easy',
          category: 'Entertainment',
          gameType: 'other',
          slug: 'maze',
          iconName: 'Map',
          isActive: true,
          comingSoon: true,
        }
      ];
      
      await Game.insertMany(games);
      logger.info(`${games.length} games seeded successfully`);
      
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
          },
          {
            gameSlug: 'true-or-false',
            text: "The Night of Power (Laylat al-Qadr) is definitely on the 27th night of Ramadan.",
            isTrue: false,
            explanation: "While the 27th night is commonly associated with Laylat al-Qadr, it is not definitively established. It is believed to be one of the odd-numbered nights in the last ten days of Ramadan.",
            difficulty: 'medium',
            isActive: true
          },
          {
            gameSlug: 'true-or-false',
            text: "All Muslims must perform Hajj at least once in their lifetime.",
            isTrue: false,
            explanation: "Hajj is obligatory only for Muslims who are physically and financially able to perform it. It is not required for those who cannot afford it, are physically unable, or cannot safely make the journey.",
            difficulty: 'easy',
            isActive: true
          },
          {
            gameSlug: 'true-or-false',
            text: "The first revelation of the Quran occurred during the month of Ramadan.",
            isTrue: true,
            explanation: "The first verses of the Quran were revealed to Prophet Muhammad (PBUH) during the month of Ramadan in the Cave of Hira.",
            difficulty: 'medium',
            isActive: true
          },
          {
            gameSlug: 'true-or-false',
            text: "It is permissible to recite the Quran without ablution (wudu).",
            isTrue: true,
            explanation: "While it is preferred to be in a state of ritual purity (wudu) when reciting the Quran, it is permissible to recite it verbally without wudu. However, touching the Quran itself (the mushaf) generally requires wudu according to most scholars.",
            difficulty: 'medium',
            isActive: true
          },
          {
            gameSlug: 'true-or-false',
            text: "The Prophet Muhammad (PBUH) was born in Madinah.",
            isTrue: false,
            explanation: "Prophet Muhammad (PBUH) was born in Makkah. He later migrated to Madinah during the Hijrah.",
            difficulty: 'easy',
            isActive: true
          },
          {
            gameSlug: 'true-or-false',
            text: "There are five pillars of Islam.",
            isTrue: true,
            explanation: "The five pillars of Islam are: Shahada (declaration of faith), Salah (prayer), Zakat (charity), Sawm (fasting during Ramadan), and Hajj (pilgrimage to Makkah).",
            difficulty: 'easy',
            isActive: true
          },
          {
            gameSlug: 'true-or-false',
            text: "Witr prayer is obligatory (fard).",
            isTrue: false,
            explanation: "Witr prayer is not obligatory (fard) but is highly emphasized (wajib according to the Hanafi school, and sunnah according to other schools). It is not one of the five daily obligatory prayers.",
            difficulty: 'medium',
            isActive: true
          },
          {
            gameSlug: 'true-or-false',
            text: "Tayammum (dry ablution) can be performed using any clean dust or stone.",
            isTrue: true,
            explanation: "Tayammum can be performed using clean earth, dust, sand, or stone when water is not available or its use would be harmful.",
            difficulty: 'medium',
            isActive: true
          },
          {
            gameSlug: 'true-or-false',
            text: "Muslims are forbidden from eating any seafood except fish.",
            isTrue: false,
            explanation: "According to most scholars, all seafood is permissible to eat. The Hanafi school has some restrictions, but generally, seafood is considered halal in Islam.",
            difficulty: 'medium',
            isActive: true
          },
          {
            gameSlug: 'true-or-false',
            text: "The Quran was compiled into a single book during the Prophet Muhammad's (PBUH) lifetime.",
            isTrue: false,
            explanation: "The Quran was fully compiled into a single book after the Prophet's death, during the caliphate of Abu Bakr and then standardized during the caliphate of Uthman.",
            difficulty: 'medium',
            isActive: true
          },
          {
            gameSlug: 'fard-or-sunnah',
            text: "Praying the five daily prayers at their prescribed times.",
            isTrue: true,
            explanation: "The five daily prayers (Fajr, Dhuhr, Asr, Maghrib, and Isha) are fard (obligatory) for every adult Muslim.",
            difficulty: 'easy',
            isActive: true
          },
          {
            gameSlug: 'fard-or-sunnah',
            text: "Brushing teeth with a miswak before prayer.",
            isTrue: false,
            explanation: "Using miswak (a natural toothbrush) before prayer is a sunnah (recommended practice) of the Prophet Muhammad (PBUH), not a fard obligation.",
            difficulty: 'easy',
            isActive: true
          },
          {
            gameSlug: 'fard-or-sunnah',
            text: "Fasting during the month of Ramadan.",
            isTrue: true,
            explanation: "Fasting during Ramadan is one of the five pillars of Islam and is fard (obligatory) for adult Muslims who are physically able.",
            difficulty: 'easy',
            isActive: true
          },
          {
            gameSlug: 'fard-or-sunnah',
            text: "Breaking the fast with dates.",
            isTrue: false,
            explanation: "Breaking the fast with dates is a sunnah (recommended practice) of Prophet Muhammad (PBUH), but it's not obligatory. One can break the fast with any permissible food or drink.",
            difficulty: 'easy',
            isActive: true
          },
          {
            gameSlug: 'fard-or-sunnah',
            text: "Praying two rak'ahs after performing wudu.",
            isTrue: false,
            explanation: "Praying two rak'ahs after performing wudu is a sunnah (recommended act), not a fard (obligation).",
            difficulty: 'medium',
            isActive: true
          }
        ];
        
        await TrueFalseQuestion.insertMany(trueFalseQuestions);
        logger.info(`${trueFalseQuestions.length} true/false questions seeded successfully`);
      }

      // Add sample multiple choice questions
      const multipleChoiceQuestionsCount = await MultipleChoiceQuestion.countDocuments();
      if (multipleChoiceQuestionsCount === 0) {
        logger.info('Seeding multiple choice questions...');
        
        const triviaMCQuestions = [
          {
            gameSlug: 'trivia',
            question: "Which is the longest surah in the Quran?",
            options: ["Al-Baqarah", "An-Nisa", "Al-Maidah", "Al-Araf"],
            correctOptionIndex: 0,
            explanation: "Al-Baqarah (The Cow) is the longest surah in the Quran with 286 verses.",
            difficulty: 'easy',
            isActive: true
          },
          {
            gameSlug: 'trivia',
            question: "How many times is the name of Prophet Muhammad (PBUH) mentioned in the Quran?",
            options: ["2 times", "4 times", "25 times", "99 times"],
            correctOptionIndex: 1,
            explanation: "The name 'Muhammad' is mentioned 4 times in the Quran, in Surah Al-Imran (3:144), Surah Al-Ahzab (33:40), Surah Muhammad (47:2), and Surah Al-Fath (48:29).",
            difficulty: 'medium',
            isActive: true
          },
          {
            gameSlug: 'trivia',
            question: "Which was the first mosque built in Islam?",
            options: ["Masjid al-Haram", "Masjid an-Nabawi", "Masjid Quba", "Masjid al-Aqsa"],
            correctOptionIndex: 2,
            explanation: "Masjid Quba was the first mosque built in Islam, constructed by the Prophet Muhammad (PBUH) upon arriving near Madinah after his migration from Makkah.",
            difficulty: 'medium',
            isActive: true
          },
          {
            gameSlug: 'trivia',
            question: "What is the fifth pillar of Islam?",
            options: ["Fasting during Ramadan", "Paying Zakat", "Daily Prayers", "Hajj"],
            correctOptionIndex: 3,
            explanation: "Hajj (pilgrimage to Makkah) is the fifth pillar of Islam, obligatory once in a lifetime for those who are physically and financially able.",
            difficulty: 'easy',
            isActive: true
          },
          {
            gameSlug: 'trivia',
            question: "Which angel delivered the revelations of the Quran to Prophet Muhammad (PBUH)?",
            options: ["Mikail", "Israfil", "Jibreel", "Izrail"],
            correctOptionIndex: 2,
            explanation: "Angel Jibreel (Gabriel) was responsible for delivering the revelations from Allah to Prophet Muhammad (PBUH).",
            difficulty: 'easy',
            isActive: true
          },
          {
            gameSlug: 'trivia',
            question: "In which cave did Prophet Muhammad (PBUH) receive the first revelation?",
            options: ["Cave of Thawr", "Cave of Hira", "Cave of Uhud", "Cave of Badr"],
            correctOptionIndex: 1,
            explanation: "Prophet Muhammad (PBUH) received his first revelation in the Cave of Hira, located on Jabal al-Nour (Mountain of Light) near Makkah.",
            difficulty: 'medium',
            isActive: true
          },
          {
            gameSlug: 'trivia',
            question: "What was the name of Prophet Muhammad's (PBUH) father?",
            options: ["Abu Talib", "Abdullah", "Abdul Muttalib", "Abu Bakr"],
            correctOptionIndex: 1,
            explanation: "Prophet Muhammad's (PBUH) father was Abdullah, who died before the Prophet was born.",
            difficulty: 'medium',
            isActive: true
          },
          {
            gameSlug: 'trivia',
            question: "What is the Night of Power (Laylat al-Qadr) described as in the Quran?",
            options: ["Better than a year", "Better than a hundred nights", "Better than a thousand months", "Better than ten thousand days"],
            correctOptionIndex: 2,
            explanation: "In Surah Al-Qadr, the Night of Power is described as being better than a thousand months (approximately 83 years).",
            difficulty: 'medium',
            isActive: true
          },
          {
            gameSlug: 'fiqh-mastermind',
            question: "According to the majority of scholars, how many intentions (niyyah) must be made to fast during Ramadan?",
            options: ["One intention for the entire month", "A new intention every night for the next day", "One intention every week", "No specific intention is required"],
            correctOptionIndex: 1,
            explanation: "According to the majority of scholars, a new intention must be made each night for the next day's fast during Ramadan.",
            difficulty: 'medium',
            isActive: true
          },
          {
            gameSlug: 'fiqh-mastermind',
            question: "What is the ruling on combining prayers (jam') for a traveler?",
            options: ["Obligatory", "Recommended", "Permissible", "Prohibited"],
            correctOptionIndex: 2,
            explanation: "Combining prayers (such as Dhuhr with Asr, or Maghrib with Isha) is permissible for travelers, but not obligatory or specifically recommended. It is a concession (rukhsah).",
            difficulty: 'medium',
            isActive: true
          },
          {
            gameSlug: 'fiqh-mastermind',
            question: "What is the minimum amount (nisab) of gold that makes zakat obligatory?",
            options: ["85 grams", "50 grams", "100 grams", "75 grams"],
            correctOptionIndex: 0,
            explanation: "The nisab for gold is approximately 85 grams (or 7.5 tolas, equivalent to 20 dinars). When a Muslim possesses this amount for a full lunar year, 2.5% zakat becomes due on it.",
            difficulty: 'hard',
            isActive: true
          },
          {
            gameSlug: 'fiqh-mastermind',
            question: "In the Hanafi school, what invalidates wudu?",
            options: ["Touching the opposite gender", "Bleeding from a cut", "Laughing silently during prayer", "Eating cooked food"],
            correctOptionIndex: 1,
            explanation: "According to the Hanafi school of thought, bleeding from a wound or cut invalidates wudu (ritual ablution).",
            difficulty: 'medium',
            isActive: true
          }
        ];
        
        await MultipleChoiceQuestion.insertMany(triviaMCQuestions);
        logger.info(`${triviaMCQuestions.length} multiple choice questions seeded successfully`);
      }

      // Add sample matching questions
      const matchingQuestionsCount = await MatchingQuestion.countDocuments();
      if (matchingQuestionsCount === 0) {
        logger.info('Seeding matching questions...');
        
        const matchingQuestions = [
          {
            gameSlug: 'matching',
            pairs: [
              { left: "Salah", right: "Prayer" },
              { left: "Sawm", right: "Fasting" },
              { left: "Zakat", right: "Charity" },
              { left: "Hajj", right: "Pilgrimage" },
              { left: "Shahada", right: "Declaration of Faith" }
            ],
            difficulty: 'easy',
            isActive: true
          },
          {
            gameSlug: 'matching',
            pairs: [
              { left: "Fajr", right: "Dawn prayer" },
              { left: "Dhuhr", right: "Noon prayer" },
              { left: "Asr", right: "Afternoon prayer" },
              { left: "Maghrib", right: "Sunset prayer" },
              { left: "Isha", right: "Night prayer" }
            ],
            difficulty: 'easy',
            isActive: true
          },
          {
            gameSlug: 'matching',
            pairs: [
              { left: "Al-Fatihah", right: "The Opening" },
              { left: "Al-Baqarah", right: "The Cow" },
              { left: "Al-Imran", right: "The Family of Imran" },
              { left: "An-Nisa", right: "The Women" },
              { left: "Al-Maidah", right: "The Table Spread" }
            ],
            difficulty: 'medium',
            isActive: true
          },
          {
            gameSlug: 'prophet-match',
            pairs: [
              { left: "Prophet Nuh (Noah)", right: "Built an Ark" },
              { left: "Prophet Ibrahim (Abraham)", right: "Built the Kaaba" },
              { left: "Prophet Musa (Moses)", right: "Received the Torah" },
              { left: "Prophet Isa (Jesus)", right: "Could heal the sick by Allah's permission" },
              { left: "Prophet Muhammad", right: "Received the Quran" }
            ],
            difficulty: 'medium',
            isActive: true
          },
          {
            gameSlug: 'prophet-match',
            pairs: [
              { left: "Prophet Yusuf (Joseph)", right: "Interpreted dreams" },
              { left: "Prophet Sulaiman (Solomon)", right: "Could speak to animals" },
              { left: "Prophet Yunus (Jonah)", right: "Was swallowed by a whale" },
              { left: "Prophet Dawud (David)", right: "Received the Zabur (Psalms)" },
              { left: "Prophet Ayyub (Job)", right: "Known for patience during severe trials" }
            ],
            difficulty: 'medium',
            isActive: true
          },
          {
            gameSlug: 'match-the-meaning',
            pairs: [
              { left: "Kitab", right: "Book" },
              { left: "Qalam", right: "Pen" },
              { left: "Masjid", right: "Mosque" },
              { left: "Madrasa", right: "School" },
              { left: "Bayt", right: "House" }
            ],
            difficulty: 'easy',
            isActive: true
          }
        ];
        
        await MatchingQuestion.insertMany(matchingQuestions);
        logger.info(`${matchingQuestions.length} matching questions seeded successfully`);
      }

      // Add sample word search questions
      const wordSearchQuestionsCount = await WordSearchQuestion.countDocuments();
      if (wordSearchQuestionsCount === 0) {
        logger.info('Seeding word search questions...');
        
        const wordSearchQuestions = [
          {
            gameSlug: 'word-search',
            grid: [
              ['S', 'A', 'L', 'A', 'H', 'F', 'G', 'H', 'J', 'K'],
              ['Q', 'W', 'E', 'R', 'T', 'Y', 'H', 'A', 'J', 'J'],
              ['Z', 'X', 'C', 'V', 'B', 'Z', 'A', 'K', 'A', 'T'],
              ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z'],
              ['Q', 'W', 'S', 'A', 'W', 'M', 'H', 'J', 'K', 'X'],
              ['C', 'V', 'B', 'N', 'M', 'Q', 'W', 'E', 'R', 'T'],
              ['Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G'],
              ['H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N'],
              ['M', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O'],
              ['P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L']
            ],
            words: [
              {
                word: 'SALAH',
                meaning: 'Prayer',
                direction: 'horizontal',
                startRow: 0,
                startCol: 0
              },
              {
                word: 'HAJJ',
                meaning: 'Pilgrimage',
                direction: 'horizontal',
                startRow: 1,
                startCol: 6
              },
              {
                word: 'ZAKAT',
                meaning: 'Charity',
                direction: 'horizontal',
                startRow: 2,
                startCol: 5
              },
              {
                word: 'SAWM',
                meaning: 'Fasting',
                direction: 'horizontal',
                startRow: 4,
                startCol: 2
              }
            ],
            hint: 'Find the five pillars of Islam',
            difficulty: 'easy',
            isActive: true
          },
          {
            gameSlug: 'word-search',
            grid: [
              ['M', 'A', 'K', 'K', 'A', 'H', 'F', 'G', 'H', 'J'],
              ['Q', 'W', 'E', 'R', 'T', 'Y', 'H', 'A', 'J', 'J'],
              ['Z', 'X', 'C', 'V', 'B', 'Z', 'M', 'K', 'A', 'T'],
              ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'A', 'L', 'Z'],
              ['Q', 'W', 'S', 'A', 'W', 'M', 'H', 'A', 'K', 'X'],
              ['M', 'A', 'D', 'I', 'N', 'A', 'H', 'B', 'R', 'T'],
              ['Y', 'U', 'I', 'O', 'P', 'A', 'S', 'A', 'F', 'G'],
              ['H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N'],
              ['M', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O'],
              ['P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L']
            ],
            words: [
              {
                word: 'MAKKAH',
                meaning: 'The holy city where the Kaaba is located',
                direction: 'horizontal',
                startRow: 0,
                startCol: 0
              },
              {
                word: 'MADINAH',
                meaning: 'The city where Prophet Muhammad migrated to',
                direction: 'horizontal',
                startRow: 5,
                startCol: 0
              },
              {
                word: 'KAABA',
                meaning: 'The sacred house in Makkah',
                direction: 'vertical',
                startRow: 3,
                startCol: 7
              }
            ],
            hint: 'Find important Islamic cities and sites',
            difficulty: 'easy',
            isActive: true
          }
        ];
        
        await WordSearchQuestion.insertMany(wordSearchQuestions);
        logger.info(`${wordSearchQuestions.length} word search questions seeded successfully`);
      }
      
      logger.info('Advanced database seeding completed successfully');
    } else {
      logger.info('Games already exist in the database. Skipping games seeding.');
    }
  } catch (error) {
    logger.error('Error in advanced database seeding:', error);
    throw error;
  }
};
