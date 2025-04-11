
import React from 'react';
import GameCard from '@/components/ui/GameCard';
import { Check, BookOpen, Brain, HelpCircle } from 'lucide-react';
import GameCategory from './GameCategory';

const KnowledgeBasedGames: React.FC = () => {
  return (
    <GameCategory title="Knowledge-Based Games">
      <GameCard
        title="True or False"
        description="Test your knowledge of Islamic facts with true or false questions."
        icon={Check}
        path="/games/true-or-false"
        difficulty="easy"
      />
      
      <GameCard
        title="Fiqh Mastermind"
        description="Answer questions about Islamic jurisprudence."
        icon={BookOpen}
        path="/games/fiqh-mastermind"
        difficulty="hard"
      />
      
      <GameCard
        title="Quiz Duel"
        description="Compete with friends in Islamic knowledge quizzes."
        icon={Brain}
        path="/games/quiz-duel"
        difficulty="medium"
      />
      
      <GameCard
        title="Trivia Challenge"
        description="Test your knowledge of Islamic history and culture."
        icon={HelpCircle}
        path="/games/trivia"
        difficulty="medium"
      />
    </GameCategory>
  );
};

export default KnowledgeBasedGames;
