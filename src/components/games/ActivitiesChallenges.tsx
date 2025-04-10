
import React from 'react';
import GameCard from '@/components/ui/GameCard';
import { PenTool, Timer, BookOpen, Clock, Heart, Calendar } from 'lucide-react';
import GameCategory from './GameCategory';

const ActivitiesChallenges: React.FC = () => {
  return (
    <GameCategory title="Activities & Challenges">
      <GameCard
        title="Arabic Calligraphy"
        description="Practice writing Arabic letters with guided templates."
        icon={PenTool}
        path="/games/calligraphy"
        difficulty="medium"
      />
      
      <GameCard
        title="Ramadan Timer"
        description="Track Suhoor and Iftar times during Ramadan."
        icon={Timer}
        path="/games/ramadan-timer"
        difficulty="easy"
      />
      
      <GameCard
        title="Islamic Stories"
        description="Interactive stories from Islamic history."
        icon={BookOpen}
        path="/games/stories"
        difficulty="medium"
      />
      
      <GameCard
        title="Salah Streak"
        description="Keep a streak of on-time Salah with daily rewards."
        icon={Clock}
        path="/games/salah-streak"
        difficulty="easy"
        comingSoon={false}
      />
      
      <GameCard
        title="Daily Dhikr Quest"
        description="Track your daily dhikr and beat your previous score."
        icon={Heart}
        path="/games/dhikr-quest"
        difficulty="easy"
        comingSoon={false}
      />
      
      <GameCard
        title="30-Day Muslim Tracker"
        description="An all-round Islamic lifestyle tracker with challenges."
        icon={Calendar}
        path="/games/muslim-tracker"
        difficulty="medium"
        comingSoon={false}
      />
    </GameCategory>
  );
};

export default ActivitiesChallenges;
