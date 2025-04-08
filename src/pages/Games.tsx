import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GameCard from '@/components/ui/GameCard';
import { 
  Search, Grid3X3, Puzzle, HelpCircle, Footprints, PenTool, Book, Timer, BookOpen,
  Award, Star, Clock, Flag, Gift, Calendar, Heart, Check, MessageSquare, User,
  Users, Shield, AlertTriangle, HelpCircle as QuestionMark, BookOpen as QuranBook,
  Volume, Headphones, Link, Edit, Copy, AlertCircle, Brain
} from 'lucide-react';

const Games = () => {
  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-6">Islamic Games</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            Explore our collection of educational Islamic games designed to make learning fun and engaging for all ages.
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button className="px-4 py-2 bg-islamic-primary text-white rounded-full text-sm hover:bg-islamic-primary/90 transition">All Games</button>
            <button className="px-4 py-2 bg-white text-islamic-primary rounded-full text-sm hover:bg-gray-100 transition">Knowledge-Based</button>
            <button className="px-4 py-2 bg-white text-islamic-primary rounded-full text-sm hover:bg-gray-100 transition">Qur'an & Hadith</button>
            <button className="px-4 py-2 bg-white text-islamic-primary rounded-full text-sm hover:bg-gray-100 transition">Memory Games</button>
            <button className="px-4 py-2 bg-white text-islamic-primary rounded-full text-sm hover:bg-gray-100 transition">Group Games</button>
            <button className="px-4 py-2 bg-white text-islamic-primary rounded-full text-sm hover:bg-gray-100 transition">Challenges</button>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Popular Games</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
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
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Knowledge-Based Games</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
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
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Qur'an & Hadith Learning</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          <GameCard
            title="Surah Scramble"
            description="Arrange the verses of short Surahs in the correct order."
            icon={Book}
            path="/games/quran-puzzle"
            difficulty="medium"
          />
          
          <GameCard
            title="Tajweed Trainer"
            description="Practice correct pronunciation with voice feedback."
            icon={Volume}
            path="/games/tajweed-trainer"
            difficulty="hard"
            comingSoon={false}
          />
          
          <GameCard
            title="Verse Matchmaker"
            description="Match ayahs to their Surah names."
            icon={Link}
            path="/games/verse-match"
            difficulty="medium"
            comingSoon={true}
          />
          
          <GameCard
            title="Hadith Collector"
            description="Collect authentic hadiths across themes."
            icon={BookOpen}
            path="/games/hadith-collector"
            difficulty="medium"
            comingSoon={true}
          />
          
          <GameCard
            title="Ayah Audio Puzzle"
            description="Hear a verse and pick its translation."
            icon={Headphones}
            path="/games/ayah-audio"
            difficulty="medium"
            comingSoon={true}
          />
          
          <GameCard
            title="Word-by-Word Arabic"
            description="Learn meanings by building ayahs word by word."
            icon={Edit}
            path="/games/word-by-word"
            difficulty="hard"
            comingSoon={true}
          />
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Memory and Brain Games</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
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
            comingSoon={true}
          />
          
          <GameCard
            title="Sound & Salah"
            description="Match Salah times with their Adhan melodies."
            icon={Volume}
            path="/games/sound-salah"
            difficulty="easy"
            comingSoon={true}
          />
          
          <GameCard
            title="Flashcard Frenzy"
            description="Use flashcards for rapid learning of Islamic concepts."
            icon={Copy}
            path="/games/flashcards"
            difficulty="easy"
            comingSoon={true}
          />
          
          <GameCard
            title="Puzzle the Pillars"
            description="Solve a jigsaw puzzle that forms the five pillars of Islam."
            icon={Puzzle}
            path="/games/pillars-puzzle"
            difficulty="easy"
            comingSoon={true}
          />
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Activities & Challenges</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
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
            comingSoon={true}
          />
          
          <GameCard
            title="30-Day Muslim Tracker"
            description="An all-round Islamic lifestyle tracker with challenges."
            icon={Calendar}
            path="/games/muslim-tracker"
            difficulty="medium"
            comingSoon={true}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Games;
