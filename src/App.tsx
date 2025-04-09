
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Games from "./pages/Games";
import WordSearch from "./pages/WordSearch";
import Crossword from "./pages/Crossword";
import Matching from "./pages/Matching";
import Trivia from "./pages/Trivia";
import Maze from "./pages/Maze";
import Calligraphy from "./pages/Calligraphy";
import QuranPuzzle from "./pages/QuranPuzzle";
import RamadanTimer from "./pages/RamadanTimer";
import Stories from "./pages/Stories";
import Profile from "./pages/Profile";
import Achievements from "./pages/Achievements";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import NinetyNineNames from "./pages/NinetyNineNames";
import TrueOrFalse from "./pages/TrueOrFalse";
import QuizDuel from "./pages/QuizDuel";
import SahabaShowdown from "./pages/SahabaShowdown";
import ProphetPath from "./pages/ProphetPath";
import HadithHunt from "./pages/HadithHunt";
import FardOrSunnah from "./pages/FardOrSunnah";
import HifzHero from "./pages/HifzHero";
import FiqhMastermind from "./pages/FiqhMastermind";
import TajweedTrainer from "./pages/TajweedTrainer";
import SalahStreak from "./pages/SalahStreak";
import VerseMatch from "./pages/VerseMatch";
import HadithCollector from "./pages/HadithCollector";
import AyahAudio from "./pages/AyahAudio";
import WordByWord from "./pages/WordByWord";
import ProphetMatch from "./pages/ProphetMatch";
import SoundSalah from "./pages/SoundSalah";
import Flashcards from "./pages/Flashcards";
import PillarsPuzzle from "./pages/PillarsPuzzle";
import DhikrQuest from "./pages/DhikrQuest";
import MuslimTracker from "./pages/MuslimTracker";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/word-search" element={<WordSearch />} />
          <Route path="/games/crossword" element={<Crossword />} />
          <Route path="/games/matching" element={<Matching />} />
          <Route path="/games/trivia" element={<Trivia />} />
          <Route path="/games/maze" element={<Maze />} />
          <Route path="/games/calligraphy" element={<Calligraphy />} />
          <Route path="/games/quran-puzzle" element={<QuranPuzzle />} />
          <Route path="/games/ramadan-timer" element={<RamadanTimer />} />
          <Route path="/games/stories" element={<Stories />} />
          <Route path="/games/99-names" element={<NinetyNineNames />} />
          <Route path="/games/true-false" element={<TrueOrFalse />} />
          <Route path="/games/quiz-duel" element={<QuizDuel />} />
          <Route path="/games/sahaba-showdown" element={<SahabaShowdown />} />
          <Route path="/games/prophet-path" element={<ProphetPath />} />
          <Route path="/games/hadith-hunt" element={<HadithHunt />} />
          <Route path="/games/fard-or-sunnah" element={<FardOrSunnah />} />
          <Route path="/games/hifz-hero" element={<HifzHero />} />
          <Route path="/games/fiqh-mastermind" element={<FiqhMastermind />} />
          <Route path="/games/tajweed-trainer" element={<TajweedTrainer />} />
          <Route path="/games/salah-streak" element={<SalahStreak />} />
          <Route path="/games/verse-match" element={<VerseMatch />} />
          <Route path="/games/hadith-collector" element={<HadithCollector />} />
          <Route path="/games/ayah-audio" element={<AyahAudio />} />
          <Route path="/games/word-by-word" element={<WordByWord />} />
          <Route path="/games/prophet-match" element={<ProphetMatch />} />
          <Route path="/games/sound-salah" element={<SoundSalah />} />
          <Route path="/games/flashcards" element={<Flashcards />} />
          <Route path="/games/pillars-puzzle" element={<PillarsPuzzle />} />
          <Route path="/games/dhikr-quest" element={<DhikrQuest />} />
          <Route path="/games/muslim-tracker" element={<MuslimTracker />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/about" element={<About />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
