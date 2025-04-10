
import React from 'react';
import GameCard from '@/components/ui/GameCard';
import { Footprints, Star, Users, Volume, Copy, Puzzle } from 'lucide-react';
import GameCategory from './GameCategory';

const MemoryBrainGames: React.FC = () => {
  return (
    <GameCategory title="Memory and Brain Games">
      <GameCard
        title="Masjid Maze"
        description="Navigate through mazes to reach the masjid."
        icon={Footprints}
        path="/games/maze"
        difficulty="easy"
      />
      
      <GameCard
        title="Hifz Hero"
        description="A memorization game for children and adults."
        icon={Star}
        path="/games/hifz-hero"
        difficulty="medium"
        comingSoon={false}
      />
      
      <GameCard
        title="Memory Match: Prophets"
        description="Match the prophets with their miracles."
        icon={Users}
        path="/games/prophet-match"
        difficulty="medium"
        comingSoon={false}
      />
      
      <GameCard
        title="Sound & Salah"
        description="Match Salah times with their Adhan melodies."
        icon={Volume}
        path="/games/sound-salah"
        difficulty="easy"
        comingSoon={false}
      />
      
      <GameCard
        title="Flashcard Frenzy"
        description="Use flashcards for rapid learning of Islamic concepts."
        icon={Copy}
        path="/games/flashcards"
        difficulty="easy"
        comingSoon={false}
      />
      
      <GameCard
        title="Puzzle the Pillars"
        description="Solve a jigsaw puzzle that forms the five pillars of Islam."
        icon={Puzzle}
        path="/games/pillars-puzzle"
        difficulty="easy"
        comingSoon={false}
      />
    </GameCategory>
  );
};

export default MemoryBrainGames;
