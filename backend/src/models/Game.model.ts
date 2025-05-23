
import mongoose, { Document, Schema } from 'mongoose';

export interface IGame extends Document {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  gameType: 'true-false' | 'multiple-choice' | 'matching' | 'word-search' | 'word-hunt' | 'quiz' | 'crossword' | 'flashcards' | 'memory' | 'puzzle' | 'other';
  slug: string;
  iconName: string;
  isActive: boolean;
  comingSoon: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GameSchema = new Schema<IGame>(
  {
    title: {
      type: String,
      required: [true, 'Game title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Game description is required'],
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    category: {
      type: String,
      required: [true, 'Game category is required'],
      trim: true,
    },
    gameType: {
      type: String,
      enum: ['true-false', 'multiple-choice', 'matching', 'word-search', 'word-hunt', 'quiz', 'crossword', 'flashcards', 'memory', 'puzzle', 'other'],
      default: 'other',
      required: [true, 'Game type is required'],
    },
    slug: {
      type: String,
      required: [true, 'Game slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    iconName: {
      type: String,
      required: [true, 'Icon name is required'],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    comingSoon: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IGame>('Game', GameSchema);
