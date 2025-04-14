
import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Games from './pages/Games';
import ProphetMatch from './pages/ProphetMatch';
import QuizDuel from './pages/QuizDuel';
import QuranicWordBingo from './pages/QuranicWordBingo';
import WordOfTheDay from './pages/WordOfTheDay';
import WordSearch from './pages/WordSearch';
import TrueOrFalse from './pages/TrueOrFalse';
import Crossword from './pages/Crossword';
import DhikrQuest from './pages/DhikrQuest';
import AyahAudio from './pages/AyahAudio';
import AyahBreakdown from './pages/AyahBreakdown';
import Profile from './pages/Profile';
import Achievements from './pages/Achievements';
import Leaderboard from './pages/Leaderboard';
import AdminRoutes from './routes/AdminRoutes';
import About from './pages/About';
import { Toaster } from '@/components/ui/toaster';
import NotFound from './pages/NotFound';

// Import other game components
import Matching from './pages/Matching';
import Trivia from './pages/Trivia';
import WordHuntQuranic from './pages/WordHuntQuranic';
import MatchTheMeaning from './pages/MatchTheMeaning';
import RootWordBuilder from './pages/RootWordBuilder';
import HarakahHero from './pages/HarakahHero';
import WordByWord from './pages/WordByWord';
import Maze from './pages/Maze';
import HifzHero from './pages/HifzHero';
import SoundSalah from './pages/SoundSalah';
import Flashcards from './pages/Flashcards';
import PillarsPuzzle from './pages/PillarsPuzzle';
import Calligraphy from './pages/Calligraphy';
import RamadanTimer from './pages/RamadanTimer';
import Stories from './pages/Stories';
import SalahStreak from './pages/SalahStreak';
import MuslimTracker from './pages/MuslimTracker';
import FiqhMastermind from './pages/FiqhMastermind';
import QuranPuzzle from './pages/QuranPuzzle';
import TajweedTrainer from './pages/TajweedTrainer';
import VerseMatch from './pages/VerseMatch';
import HadithCollector from './pages/HadithCollector';
import NinetyNineNames from './pages/NinetyNineNames';
import FardOrSunnah from './pages/FardOrSunnah';
import ProphetPath from './pages/ProphetPath';
import SahabaShowdown from './pages/SahabaShowdown';
import HadithHunt from './pages/HadithHunt';
import WordHunt from './pages/WordHunt';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Routes>
              <Route path="/" element={<Games />} />
              <Route path="/games" element={<Games />} />
              
              {/* User Profile Routes */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/about" element={<About />} />
              
              {/* Basic game routes that were already set up */}
              <Route path="/games/prophet-match" element={<ProphetMatch />} />
              <Route path="/games/quiz-duel" element={<QuizDuel />} />
              <Route path="/games/quranic-word-bingo" element={<QuranicWordBingo />} />
              <Route path="/games/word-of-the-day" element={<WordOfTheDay />} />
              <Route path="/games/word-search" element={<WordSearch />} />
              <Route path="/games/true-or-false" element={<TrueOrFalse />} />
              <Route path="/games/crossword" element={<Crossword />} />
              <Route path="/games/dhikr-quest" element={<DhikrQuest />} />
              <Route path="/games/ayah-audio" element={<AyahAudio />} />
              <Route path="/games/ayah-breakdown" element={<AyahBreakdown />} />
              
              {/* Add routes for the additional games */}
              <Route path="/games/matching" element={<Matching />} />
              <Route path="/games/trivia" element={<Trivia />} />
              <Route path="/games/word-hunt-quranic" element={<WordHuntQuranic />} />
              <Route path="/games/match-the-meaning" element={<MatchTheMeaning />} />
              <Route path="/games/root-word-builder" element={<RootWordBuilder />} />
              <Route path="/games/harakah-hero" element={<HarakahHero />} />
              <Route path="/games/word-by-word" element={<WordByWord />} />
              <Route path="/games/maze" element={<Maze />} />
              <Route path="/games/hifz-hero" element={<HifzHero />} />
              <Route path="/games/sound-salah" element={<SoundSalah />} />
              <Route path="/games/flashcards" element={<Flashcards />} />
              <Route path="/games/pillars-puzzle" element={<PillarsPuzzle />} />
              <Route path="/games/calligraphy" element={<Calligraphy />} />
              <Route path="/games/ramadan-timer" element={<RamadanTimer />} />
              <Route path="/games/stories" element={<Stories />} />
              <Route path="/games/salah-streak" element={<SalahStreak />} />
              <Route path="/games/muslim-tracker" element={<MuslimTracker />} />
              <Route path="/games/fiqh-mastermind" element={<FiqhMastermind />} />
              <Route path="/games/quran-puzzle" element={<QuranPuzzle />} />
              <Route path="/games/tajweed-trainer" element={<TajweedTrainer />} />
              <Route path="/games/verse-match" element={<VerseMatch />} />
              <Route path="/games/hadith-collector" element={<HadithCollector />} />
              <Route path="/games/ninety-nine-names" element={<NinetyNineNames />} />
              <Route path="/games/fard-or-sunnah" element={<FardOrSunnah />} />
              <Route path="/games/prophet-path" element={<ProphetPath />} />
              <Route path="/games/sahaba-showdown" element={<SahabaShowdown />} />
              <Route path="/games/hadith-hunt" element={<HadithHunt />} />
              <Route path="/games/word-hunt" element={<WordHunt />} />
              
              {/* Admin routes */}
              <Route path="/admin/*" element={<AdminRoutes />} />
              
              {/* 404 page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
      <Toaster />
    </div>
  );
}

export default App;
