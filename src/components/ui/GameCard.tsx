
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  difficulty: 'easy' | 'medium' | 'hard';
  color?: string;
  comingSoon?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({
  title,
  description,
  icon: Icon,
  path,
  difficulty,
  color = 'bg-islamic-primary',
  comingSoon = false
}) => {
  const difficultyColor = {
    easy: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    hard: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <Link to={comingSoon ? '#' : path} className={comingSoon ? 'cursor-not-allowed opacity-70' : ''}>
      <div className="game-card p-6 h-full flex flex-col gap-4 group hover:translate-y-[-4px]">
        <div className={cn("w-14 h-14 rounded-full flex items-center justify-center text-white", color)}>
          <Icon className="h-7 w-7" />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold">{title}</h3>
            <Badge variant="outline" className={difficultyColor[difficulty]}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Badge>
          </div>
          <p className="text-muted-foreground">{description}</p>
        </div>
        
        {comingSoon && (
          <Badge variant="secondary" className="w-fit">Coming Soon</Badge>
        )}
      </div>
    </Link>
  );
};

export default GameCard;
