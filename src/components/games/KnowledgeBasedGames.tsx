
import React from 'react';
import GameCard from '@/components/ui/GameCard';
import { Users, Star, Calendar, Award, Search, Check, HelpCircle, Brain } from 'lucide-react';
import GameCategory from './GameCategory';

const KnowledgeBasedGames: React.FC = () => {
  return (
    <GameCategory title="Knowledge-Based Games">
      <GameCard
        title="Islamic Quiz Duel"
        description="Two players face off in timed Islamic trivia rounds."
        icon={Users}
        path="/games/quiz-duel"
        difficulty="medium"
        comingSoon={false}
      />
      
      <GameCard
        title="Sahaba Showdown"
        description="Guess the Sahabi based on clues and stories."
        icon={Star}
        path="/games/sahaba-showdown"
        difficulty="medium"
        comingSoon={false}
      />
      
      <GameCard
        title="Prophet Path Puzzle"
        description="A timeline puzzle game about the life of Prophet Muhammad (PBUH)."
        icon={Calendar}
        path="/games/prophet-path"
        difficulty="hard"
        comingSoon={false}
      />
      
      <GameCard
        title="99 Names Challenge"
        description="Match the 99 Names of Allah with their meanings."
        icon={Award}
        path="/games/99-names"
        difficulty="medium"
        comingSoon={false}
      />
      
      <GameCard
        title="Hadith Hunt"
        description="Match authentic Hadiths to their topics or sources."
        icon={Search}
        path="/games/hadith-hunt"
        difficulty="hard"
        comingSoon={false}
      />
      
      <GameCard
        title="Islamic True or False"
        description="A fast-paced myth-busting game about Islamic facts."
        icon={Check}
        path="/games/true-false"
        difficulty="easy"
        comingSoon={false}
      />
      
      <GameCard
        title="'Fard' or 'Sunnah'?"
        description="Categorize daily actions as fard, sunnah, mustahab, or mubah."
        icon={HelpCircle}
        path="/games/fard-or-sunnah"
        difficulty="medium"
        comingSoon={false}
      />
      
      <GameCard
        title="Fiqh Mastermind"
        description="Choose a madhhab and solve practical fiqh situations."
        icon={Brain}
        path="/games/fiqh-mastermind"
        difficulty="hard"
        comingSoon={false}
      />
    </GameCategory>
  );
};

export default KnowledgeBasedGames;
