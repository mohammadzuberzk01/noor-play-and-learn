
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

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
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
            <Route path="/games/prophet-match" element={<ProphetMatch />} />
            <Route path="/games/quiz-duel" element={<QuizDuel />} />
            <Route path="/games/quranic-word-bingo" element={<QuranicWordBingo />} />
            <Route path="/games/word-of-the-day" element={<WordOfTheDay />} />
            <Route path="/games/word-search" element={<WordSearch />} />
            <Route path="/games/true-or-false" element={<TrueOrFalse />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
