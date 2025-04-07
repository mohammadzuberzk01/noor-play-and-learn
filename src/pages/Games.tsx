
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GameCard from '@/components/ui/GameCard';
import { 
  Search, 
  AlignJustify, 
  Puzzle, 
  HelpCircle, 
  PenTool, 
  Waypoints,
  Book,
  Clock,
  BookOpen
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Games = () => {
  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Islamic Educational Games</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from our collection of fun and educational games to learn about Islamic traditions, history, and teachings.
          </p>
        </div>
        
        <Tabs defaultValue="all" className="w-full mb-12">
          <TabsList className="w-full max-w-md mx-auto justify-center mb-8">
            <TabsTrigger value="all">All Games</TabsTrigger>
            <TabsTrigger value="ramadan">Ramadan</TabsTrigger>
            <TabsTrigger value="quran">Qur'an</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GameCard 
              title="Islamic Word Search" 
              description="Find Islamic terms and concepts hidden in a grid of letters."
              icon={Search}
              path="/games/word-search"
              difficulty="easy"
              color="bg-islamic-primary"
            />
            
            <GameCard 
              title="Islamic Crossword" 
              description="Test your knowledge of Islamic terms with engaging crossword puzzles."
              icon={AlignJustify}
              path="/games/crossword"
              difficulty="medium"
              color="bg-islamic-secondary"
            />
            
            <GameCard 
              title="Islamic Matching" 
              description="Match Islamic terms with their meanings in this memory game."
              icon={Puzzle}
              path="/games/matching"
              difficulty="easy"
              color="bg-islamic-accent"
            />
            
            <GameCard 
              title="Islamic Trivia" 
              description="Test your knowledge of Islam with fun trivia questions."
              icon={HelpCircle}
              path="/games/trivia"
              difficulty="medium"
              color="bg-islamic-gold"
            />
            
            <GameCard 
              title="Masjid Maze" 
              description="Navigate through mazes to find the path to the Masjid."
              icon={Waypoints}
              path="/games/maze"
              difficulty="easy"
              color="bg-islamic-teal"
            />
            
            <GameCard 
              title="Arabic Calligraphy" 
              description="Learn to write Arabic letters with guided practice."
              icon={PenTool}
              path="/games/calligraphy"
              difficulty="hard"
              color="bg-islamic-red"
              comingSoon={true}
            />
            
            <GameCard 
              title="Qur'an Verse Puzzle" 
              description="Rearrange words to complete Qur'anic verses with audio recitation."
              icon={Book}
              path="/games/quran-puzzle"
              difficulty="medium"
              color="bg-islamic-primary"
            />
            
            <GameCard 
              title="Ramadan Timer" 
              description="Interactive timer for Suhoor and Iftar times with educational elements."
              icon={Clock}
              path="/games/ramadan-timer"
              difficulty="easy"
              color="bg-islamic-secondary"
              comingSoon={true}
            />
            
            <GameCard 
              title="Islamic Stories" 
              description="Interactive storytelling from Islamic history and traditions."
              icon={BookOpen}
              path="/games/stories"
              difficulty="easy"
              color="bg-islamic-accent"
              comingSoon={true}
            />
          </TabsContent>
          
          <TabsContent value="ramadan" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GameCard 
              title="Ramadan Word Search" 
              description="Find Ramadan-related terms hidden in a grid of letters."
              icon={Search}
              path="/games/ramadan-word-search"
              difficulty="easy"
              color="bg-islamic-primary"
            />
            
            <GameCard 
              title="Ramadan Matching" 
              description="Match Ramadan terms with their meanings in this memory game."
              icon={Puzzle}
              path="/games/ramadan-matching"
              difficulty="easy"
              color="bg-islamic-accent"
            />
            
            <GameCard 
              title="Ramadan Trivia" 
              description="Test your knowledge of Ramadan with fun trivia questions."
              icon={HelpCircle}
              path="/games/ramadan-trivia"
              difficulty="medium"
              color="bg-islamic-gold"
            />
            
            <GameCard 
              title="Ramadan Timer" 
              description="Interactive timer for Suhoor and Iftar times with educational elements."
              icon={Clock}
              path="/games/ramadan-timer"
              difficulty="easy"
              color="bg-islamic-secondary"
              comingSoon={true}
            />
          </TabsContent>
          
          <TabsContent value="quran" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GameCard 
              title="Qur'an Verse Puzzle" 
              description="Rearrange words to complete Qur'anic verses with audio recitation."
              icon={Book}
              path="/games/quran-puzzle"
              difficulty="medium"
              color="bg-islamic-primary"
            />
            
            <GameCard 
              title="Arabic Calligraphy" 
              description="Learn to write Arabic letters with guided practice."
              icon={PenTool}
              path="/games/calligraphy"
              difficulty="hard"
              color="bg-islamic-red"
              comingSoon={true}
            />
          </TabsContent>
          
          <TabsContent value="history" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GameCard 
              title="Islamic History Trivia" 
              description="Test your knowledge of Islamic history with fun trivia questions."
              icon={HelpCircle}
              path="/games/history-trivia"
              difficulty="medium"
              color="bg-islamic-gold"
            />
            
            <GameCard 
              title="Islamic Stories" 
              description="Interactive storytelling from Islamic history and traditions."
              icon={BookOpen}
              path="/games/stories"
              difficulty="easy"
              color="bg-islamic-accent"
              comingSoon={true}
            />
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Games;
