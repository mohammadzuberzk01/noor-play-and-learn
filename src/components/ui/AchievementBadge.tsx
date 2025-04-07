
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AchievementBadgeProps {
  name: string;
  description: string;
  icon: LucideIcon;
  unlocked: boolean;
  color: string;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  name,
  description,
  icon: Icon,
  unlocked,
  color
}) => {
  return (
    <motion.div 
      className={cn(
        "relative p-6 rounded-xl border bg-card text-card-foreground shadow flex flex-col items-center gap-3",
        !unlocked && "opacity-60 grayscale"
      )}
      whileHover={{ y: -5 }}
    >
      <div className={cn(
        "w-16 h-16 rounded-full flex items-center justify-center text-white", 
        color
      )}>
        <Icon className="h-8 w-8" />
      </div>
      
      <div className="text-center">
        <h3 className="text-lg font-bold">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      
      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm rounded-xl">
          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AchievementBadge;
