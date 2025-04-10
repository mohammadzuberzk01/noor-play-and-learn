
import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider"
import Games from './pages/Games';
import ProphetMatch from './pages/ProphetMatch';
import QuizDuel from './pages/QuizDuel';
import QuranicWordBingo from './pages/QuranicWordBingo';
import WordOfTheDay from './pages/WordOfTheDay';

function App() {
  return (
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
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
