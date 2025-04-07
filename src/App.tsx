
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
