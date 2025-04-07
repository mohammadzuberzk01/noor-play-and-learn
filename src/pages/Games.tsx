
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GameCard from '@/components/ui/GameCard';
import { Search, Grid3X3, Puzzle, HelpCircle, Footprints, PenTool, Book, Timer, BookOpen } from 'lucide-react';

const Games = () => {
  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6">Islamic Games</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of educational Islamic games designed to make learning fun and engaging for all ages.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          
          <GameCard
            title="Masjid Maze"
            description="Navigate through mazes to reach the masjid."
            icon={Footprints}
            path="/games/maze"
            difficulty="easy"
            comingSoon={false}
          />
          
          <GameCard
            title="Arabic Calligraphy"
            description="Practice writing Arabic letters with guided templates."
            icon={PenTool}
            path="/games/calligraphy"
            difficulty="medium"
            comingSoon={false}
          />
          
          <GameCard
            title="Qur'an Puzzle"
            description="Arrange Qur'anic verses in the correct order."
            icon={Book}
            path="/games/quran-puzzle"
            difficulty="hard"
            comingSoon={false}
          />
          
          <GameCard
            title="Ramadan Timer"
            description="Track Suhoor and Iftar times during Ramadan."
            icon={Timer}
            path="/games/ramadan-timer"
            difficulty="easy"
            comingSoon={false}
          />
          
          <GameCard
            title="Islamic Stories"
            description="Interactive stories from Islamic history."
            icon={BookOpen}
            path="/games/stories"
            difficulty="medium"
            comingSoon={false}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Games;
