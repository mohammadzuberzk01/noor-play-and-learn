
import React from 'react';
import GameCard from '@/components/ui/GameCard';
import { Search, Grid3X3, Puzzle, HelpCircle } from 'lucide-react';
import GameCategory from './GameCategory';

const PopularGames: React.FC = () => {
  return (
    <GameCategory title="Popular Games">
      <GameCard
        title="Word Search"
        description="Find Islamic terms hidden in a grid of letters."
        icon={Search}
        path="/games/word-search"
        difficulty="easy"
      />
      
      <GameCard
        title="Crossword"
        description="Test your knowledge of Islamic terms with our crossword puzzles."
        icon={Grid3X3}
        path="/games/crossword"
        difficulty="medium"
      />
      
      <GameCard
        title="Matching"
        description="Match Islamic terms with their correct meanings."
        icon={Puzzle}
        path="/games/matching"
        difficulty="easy"
      />
      
      <GameCard
        title="Trivia"
        description="Answer questions about Islam and Islamic history."
        icon={HelpCircle}
        path="/games/trivia"
        difficulty="medium"
      />
    </GameCategory>
  );
};

export default PopularGames;
