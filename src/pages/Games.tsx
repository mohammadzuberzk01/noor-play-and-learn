
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GameFilter from '@/components/games/GameFilter';
import PopularGames from '@/components/games/PopularGames';
import QuranicArabicGames from '@/components/games/QuranicArabicGames';
import KnowledgeBasedGames from '@/components/games/KnowledgeBasedGames';
import QuranHadithGames from '@/components/games/QuranHadithGames';
import MemoryBrainGames from '@/components/games/MemoryBrainGames';
import ActivitiesChallenges from '@/components/games/ActivitiesChallenges';

const Games = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-6">Islamic Games</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            Explore our collection of educational Islamic games designed to make learning fun and engaging for all ages.
          </p>
          
          <GameFilter activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
        </div>
        
        {/* We can conditionally render based on activeFilter if needed */}
        <PopularGames />
        <QuranicArabicGames />
        <KnowledgeBasedGames />
        <QuranHadithGames />
        <MemoryBrainGames />
        <ActivitiesChallenges />
      </main>
      
      <Footer />
    </div>
  );
};

export default Games;
