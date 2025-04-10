
import mongoose, { Document, Schema } from 'mongoose';

export interface IWordOfTheDay extends Document {
  word: string;
  arabicWord: string;
  transliteration: string;
  meaning: string;
  example: {
    arabic: string;
    transliteration: string;
    english: string;
  };
  dateActive: Date;
  rootWord?: string;
  audioUrl?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
  updatedAt: Date;
}

const WordOfTheDaySchema = new Schema<IWordOfTheDay>(
  {
    word: {
      type: String,
      required: [true, 'Word is required'],
      trim: true,
    },
    arabicWord: {
      type: String,
      required: [true, 'Arabic word is required'],
      trim: true,
    },
    transliteration: {
      type: String,
      required: [true, 'Transliteration is required'],
      trim: true,
    },
    meaning: {
      type: String,
      required: [true, 'Meaning is required'],
      trim: true,
    },
    example: {
      arabic: {
        type: String,
        required: [true, 'Arabic example is required'],
        trim: true,
      },
      transliteration: {
        type: String,
        required: [true, 'Example transliteration is required'],
        trim: true,
      },
      english: {
        type: String,
        required: [true, 'English example is required'],
        trim: true,
      },
    },
    dateActive: {
      type: Date,
      required: [true, 'Active date is required'],
      unique: true,
    },
    rootWord: {
      type: String,
      trim: true,
    },
    audioUrl: {
      type: String,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IWordOfTheDay>('WordOfTheDay', WordOfTheDaySchema);
