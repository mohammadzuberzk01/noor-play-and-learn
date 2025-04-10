
import React from 'react';
import GameCard from '@/components/ui/GameCard';
import { Search, Languages, Puzzle, Book, Calendar, Grid3X3, Edit } from 'lucide-react';
import GameCategory from './GameCategory';

const QuranicArabicGames: React.FC = () => {
  return (
    <GameCategory title="Qur'anic Arabic Learning">
      <GameCard
        title="Word Hunt: Qur'an Edition"
        description="Find hidden Arabic words from the Qur'an in a puzzle grid."
        icon={Search}
        path="/games/word-hunt-quranic"
        difficulty="medium"
        comingSoon={false}
      />
      
      <GameCard
        title="Match the Meaning"
        description="Match Arabic Qur'anic words to their English meanings with a timer."
        icon={Languages}
        path="/games/match-the-meaning"
        difficulty="medium"
        comingSoon={false}
      />
      
      <GameCard
        title="Root Word Builder"
        description="Build multiple words from trilateral Qur'anic roots."
        icon={Puzzle}
        path="/games/root-word-builder"
        difficulty="medium"
        comingSoon={false}
      />
      
      <GameCard
        title="Ayah Breakdown"
        description="Break down Qur'anic verses word by word and learn meanings."
        icon={Book}
        path="/games/ayah-breakdown"
        difficulty="medium"
        comingSoon={false}
      />
      
      <GameCard
        title="Word of the Day Challenge"
        description="Learn one new Qur'anic word daily with quizzes."
        icon={Calendar}
        path="/games/word-of-the-day"
        difficulty="easy"
        comingSoon={false}
      />
      
      <GameCard
        title="Qur'anic Word Bingo"
        description="Play bingo with common Qur'anic vocabulary."
        icon={Grid3X3}
        path="/games/quranic-word-bingo"
        difficulty="easy"
        comingSoon={false}
      />
      
      <GameCard
        title="Harakah Hero"
        description="Add the correct vowel marks to Arabic words."
        icon={Edit}
        path="/games/harakah-hero"
        difficulty="medium"
        comingSoon={false}
      />
    </GameCategory>
  );
};

export default QuranicArabicGames;
