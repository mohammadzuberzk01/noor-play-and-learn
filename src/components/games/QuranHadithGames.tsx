
import React from 'react';
import GameCard from '@/components/ui/GameCard';
import { Book, Volume, Link, BookOpen, Headphones, Edit } from 'lucide-react';
import GameCategory from './GameCategory';

const QuranHadithGames: React.FC = () => {
  return (
    <GameCategory title="Qur'an & Hadith Learning">
      <GameCard
        title="Surah Scramble"
        description="Arrange the verses of short Surahs in the correct order."
        icon={Book}
        path="/games/quran-puzzle"
        difficulty="medium"
      />
      
      <GameCard
        title="Tajweed Trainer"
        description="Practice correct pronunciation with voice feedback."
        icon={Volume}
        path="/games/tajweed-trainer"
        difficulty="hard"
        comingSoon={false}
      />
      
      <GameCard
        title="Verse Matchmaker"
        description="Match ayahs to their Surah names."
        icon={Link}
        path="/games/verse-match"
        difficulty="medium"
        comingSoon={false}
      />
      
      <GameCard
        title="Hadith Collector"
        description="Collect authentic hadiths across themes."
        icon={BookOpen}
        path="/games/hadith-collector"
        difficulty="medium"
        comingSoon={false}
      />
      
      <GameCard
        title="Ayah Audio Puzzle"
        description="Hear a verse and pick its translation."
        icon={Headphones}
        path="/games/ayah-audio"
        difficulty="medium"
        comingSoon={false}
      />
      
      <GameCard
        title="Word-by-Word Arabic"
        description="Learn meanings by building ayahs word by word."
        icon={Edit}
        path="/games/word-by-word"
        difficulty="hard"
        comingSoon={false}
      />
    </GameCategory>
  );
};

export default QuranHadithGames;
