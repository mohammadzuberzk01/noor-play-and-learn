
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

const gameRoutes = [
  { path: "/games/prophet-match", element: <ProphetMatch /> },
  { path: "/games/quiz-duel", element: <QuizDuel /> },
  { path: "/games/quranic-word-bingo", element: <QuranicWordBingo /> },
  { path: "/games/word-of-the-day", element: <WordOfTheDay /> },
  { path: "/games/word-search", element: <WordSearch /> },
  { path: "/games/true-or-false", element: <TrueOrFalse /> },
  { path: "/games/crossword", element: <Crossword /> },
  { path: "/games/dhikr-quest", element: <DhikrQuest /> },
  { path: "/games/ayah-audio", element: <AyahAudio /> },
  { path: "/games/ayah-breakdown", element: <AyahBreakdown /> },
  // Additional game routes - you would add all 37 game routes here
  { path: "/games/flashcards", element: <ProphetMatch /> }, // Need to create dedicated components 
  { path: "/games/matching", element: <ProphetMatch /> },    // for each game type or use a 
  { path: "/games/memory", element: <ProphetMatch /> },      // dynamic game component
];

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
              
              {/* Dynamically render all game routes */}
              {gameRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
              
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
