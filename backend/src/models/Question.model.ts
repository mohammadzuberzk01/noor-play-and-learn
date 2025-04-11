
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

// Create separate models for each question type
export const TrueFalseQuestion = mongoose.model<ITrueFalseQuestion>('TrueFalseQuestion', TrueFalseQuestionSchema);
export const MultipleChoiceQuestion = mongoose.model<IMultipleChoiceQuestion>('MultipleChoiceQuestion', MultipleChoiceQuestionSchema);
export const MatchingQuestion = mongoose.model<IMatchingQuestion>('MatchingQuestion', MatchingQuestionSchema);
export const WordSearchQuestion = mongoose.model<IWordSearchQuestion>('WordSearchQuestion', WordSearchQuestionSchema);
