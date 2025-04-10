
import React from 'react';
import GameCard from '@/components/ui/GameCard';
import { LucideIcon } from 'lucide-react';

interface GameCategoryProps {
  title: string;
  children: React.ReactNode;
}

const GameCategory: React.FC<GameCategoryProps> = ({ title, children }) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {children}
      </div>
    </div>
  );
};

export default GameCategory;
