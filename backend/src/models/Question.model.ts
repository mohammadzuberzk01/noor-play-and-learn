
import mongoose, { Document, Schema } from 'mongoose';

// Base question interface that all game questions will extend
export interface IBaseQuestion extends Document {
  gameSlug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// True/False question interface
export interface ITrueFalseQuestion extends IBaseQuestion {
  text: string;
  isTrue: boolean;
  explanation: string;
}

// Multiple choice question interface
export interface IMultipleChoiceQuestion extends IBaseQuestion {
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

// Matching question interface
export interface IMatchingQuestion extends IBaseQuestion {
  pairs: Array<{
    left: string;
    right: string;
  }>;
}

// Word search question interface
export interface IWordSearchQuestion extends IBaseQuestion {
  grid: string[][];
  words: Array<{
    word: string;
    meaning: string;
    direction: 'horizontal' | 'vertical' | 'diagonal';
    startRow: number;
    startCol: number;
  }>;
  hint: string;
}

// Quiz question interface
export interface IQuizQuestion extends IBaseQuestion {
  question: string;
  options: string[];
  correctOptionIndex: number;
  category: string;
  timeLimit?: number;
  points?: number;
}

// Flashcard interface
export interface IFlashcard extends IBaseQuestion {
  front: string;
  back: string;
  category: string;
}

// Memory game card interface
export interface IMemoryCard extends IBaseQuestion {
  cards: Array<{
    id: string;
    content: string;
    matchId: string;
  }>;
  timeLimit?: number;
}

// Crossword puzzle interface
export interface ICrosswordPuzzle extends IBaseQuestion {
  grid: string[][];
  clues: Array<{
    direction: 'across' | 'down';
    number: number;
    clue: string;
    answer: string;
    startRow: number;
    startCol: number;
  }>;
  timeLimit?: number;
}

// Word hunt interface
export interface IWordHunt extends IBaseQuestion {
  letters: string[];
  words: string[];
  minimumWordLength: number;
  timeLimit?: number;
}

// Base Question Schema (shared fields)
const BaseQuestionSchema = {
  gameSlug: {
    type: String,
    required: [true, 'Game slug is required'],
    trim: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  isActive: {
    type: Boolean,
    default: true,
  }
};

// True/False Question Schema
const TrueFalseQuestionSchema = new Schema<ITrueFalseQuestion>(
  {
    ...BaseQuestionSchema,
    text: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    isTrue: {
      type: Boolean,
      required: [true, 'Truth value is required'],
    },
    explanation: {
      type: String,
      required: [true, 'Explanation is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Multiple Choice Question Schema
const MultipleChoiceQuestionSchema = new Schema<IMultipleChoiceQuestion>(
  {
    ...BaseQuestionSchema,
    question: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    options: {
      type: [String],
      required: [true, 'Options are required'],
      validate: [(val: string[]) => val.length >= 2, 'At least 2 options required'],
    },
    correctOptionIndex: {
      type: Number,
      required: [true, 'Correct option index is required'],
      min: 0,
    },
    explanation: {
      type: String,
      required: [true, 'Explanation is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Matching Question Schema
const MatchingQuestionSchema = new Schema<IMatchingQuestion>(
  {
    ...BaseQuestionSchema,
    pairs: {
      type: [{
        left: {
          type: String,
          required: true,
        },
        right: {
          type: String,
          required: true,
        }
      }],
      required: [true, 'Matching pairs are required'],
      validate: [(val: any[]) => val.length >= 2, 'At least 2 pairs required'],
    },
  },
  {
    timestamps: true,
  }
);

// Word Search Question Schema
const WordSearchQuestionSchema = new Schema<IWordSearchQuestion>(
  {
    ...BaseQuestionSchema,
    grid: {
      type: [[String]],
      required: [true, 'Word search grid is required'],
    },
    words: {
      type: [{
        word: {
          type: String,
          required: true,
        },
        meaning: {
          type: String,
          required: true,
        },
        direction: {
          type: String,
          enum: ['horizontal', 'vertical', 'diagonal'],
          required: true,
        },
        startRow: {
          type: Number,
          required: true,
        },
        startCol: {
          type: Number,
          required: true,
        }
      }],
      required: [true, 'Words are required'],
    },
    hint: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Quiz Question Schema
const QuizQuestionSchema = new Schema<IQuizQuestion>(
  {
    ...BaseQuestionSchema,
    question: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    options: {
      type: [String],
      required: [true, 'Options are required'],
      validate: [(val: string[]) => val.length >= 2, 'At least 2 options required'],
    },
    correctOptionIndex: {
      type: Number,
      required: [true, 'Correct option index is required'],
      min: 0,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    timeLimit: {
      type: Number,
      default: 15,
    },
    points: {
      type: Number,
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

// Flashcard Schema
const FlashcardSchema = new Schema<IFlashcard>(
  {
    ...BaseQuestionSchema,
    front: {
      type: String,
      required: [true, 'Front text is required'],
      trim: true,
    },
    back: {
      type: String,
      required: [true, 'Back text is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Memory Card Schema
const MemoryCardSchema = new Schema<IMemoryCard>(
  {
    ...BaseQuestionSchema,
    cards: {
      type: [{
        id: {
          type: String,
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        matchId: {
          type: String,
          required: true,
        },
      }],
      required: [true, 'Cards are required'],
      validate: [(val: any[]) => val.length >= 4, 'At least 4 cards required'],
    },
    timeLimit: {
      type: Number,
      default: 60,
    },
  },
  {
    timestamps: true,
  }
);

// Crossword Puzzle Schema
const CrosswordPuzzleSchema = new Schema<ICrosswordPuzzle>(
  {
    ...BaseQuestionSchema,
    grid: {
      type: [[String]],
      required: [true, 'Crossword grid is required'],
    },
    clues: {
      type: [{
        direction: {
          type: String,
          enum: ['across', 'down'],
          required: true,
        },
        number: {
          type: Number,
          required: true,
        },
        clue: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
        startRow: {
          type: Number,
          required: true,
        },
        startCol: {
          type: Number,
          required: true,
        },
      }],
      required: [true, 'Clues are required'],
    },
    timeLimit: {
      type: Number,
      default: 300,
    },
  },
  {
    timestamps: true,
  }
);

// Word Hunt Schema
const WordHuntSchema = new Schema<IWordHunt>(
  {
    ...BaseQuestionSchema,
    letters: {
      type: [String],
      required: [true, 'Letters are required'],
      validate: [(val: string[]) => val.length >= 9, 'At least 9 letters required'],
    },
    words: {
      type: [String],
      required: [true, 'Words are required'],
    },
    minimumWordLength: {
      type: Number,
      default: 3,
    },
    timeLimit: {
      type: Number,
      default: 180,
    },
  },
  {
    timestamps: true,
  }
);

// Create separate models for each question type
export const TrueFalseQuestion = mongoose.model<ITrueFalseQuestion>('TrueFalseQuestion', TrueFalseQuestionSchema);
export const MultipleChoiceQuestion = mongoose.model<IMultipleChoiceQuestion>('MultipleChoiceQuestion', MultipleChoiceQuestionSchema);
export const MatchingQuestion = mongoose.model<IMatchingQuestion>('MatchingQuestion', MatchingQuestionSchema);
export const WordSearchQuestion = mongoose.model<IWordSearchQuestion>('WordSearchQuestion', WordSearchQuestionSchema);
export const QuizQuestion = mongoose.model<IQuizQuestion>('QuizQuestion', QuizQuestionSchema);
export const Flashcard = mongoose.model<IFlashcard>('Flashcard', FlashcardSchema);
export const MemoryCard = mongoose.model<IMemoryCard>('MemoryCard', MemoryCardSchema);
export const CrosswordPuzzle = mongoose.model<ICrosswordPuzzle>('CrosswordPuzzle', CrosswordPuzzleSchema);
export const WordHunt = mongoose.model<IWordHunt>('WordHunt', WordHuntSchema);
