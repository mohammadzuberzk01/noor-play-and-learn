
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Shuffle, Timer, Check, X } from 'lucide-react';

interface VocabPair {
  id: number;
  arabic: string;
  english: string;
}

const MatchTheMeaning = () => {
  const [vocabularyPairs, setVocabularyPairs] = useState<VocabPair[]>([
    { id: 1, arabic: 'كتاب', english: 'book' },
    { id: 2, arabic: 'قلم', english: 'pen' },
    { id: 3, arabic: 'مسجد', english: 'mosque' },
    { id: 4, arabic: 'علم', english: 'knowledge' },
    { id: 5, arabic: 'سلام', english: 'peace' },
    { id: 6, arabic: 'صلاة', english: 'prayer' },
    { id: 7, arabic: 'رحمة', english: 'mercy' },
    { id: 8, arabic: 'جنة', english: 'paradise' },
    { id: 9, arabic: 'نور', english: 'light' },
    { id: 10, arabic: 'ماء', english: 'water' },
  ]);
  
  const [arabicOptions, setArabicOptions] = useState<string[]>([]);
  const [englishOptions, setEnglishOptions] = useState<string[]>([]);
  const [selectedArabic, setSelectedArabic] = useState<string | null>(null);
  const [selectedEnglish, setSelectedEnglish] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  // Set up the game
  useEffect(() => {
    if (gameStarted && !gameOver) {
      setupGame();
    }
  }, [gameStarted, difficulty]);

  // Timer countdown
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (gameStarted && !gameOver && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      endGame();
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameOver, timer]);

  const setupGame = () => {
    // Select a subset of vocabulary based on difficulty
    let numPairs: number;
    let newTimer: number;
    
    switch (difficulty) {
      case 'easy':
        numPairs = 5;
        newTimer = 60;
        break;
      case 'medium':
        numPairs = 7;
        newTimer = 45;
        break;
      case 'hard':
        numPairs = 10;
        newTimer = 30;
        break;
      default:
        numPairs = 5;
        newTimer = 60;
    }
    
    // Shuffle and select pairs
    const shuffledPairs = [...vocabularyPairs].sort(() => Math.random() - 0.5).slice(0, numPairs);
    
    // Extract and shuffle the Arabic and English options
    const arabic = shuffledPairs.map(pair => pair.arabic).sort(() => Math.random() - 0.5);
    const english = shuffledPairs.map(pair => pair.english).sort(() => Math.random() - 0.5);
    
    setArabicOptions(arabic);
    setEnglishOptions(english);
    setMatchedPairs([]);
    setScore(0);
    setTimer(newTimer);
    setSelectedArabic(null);
    setSelectedEnglish(null);
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setupGame();
  };

  const endGame = () => {
    setGameOver(true);
    toast({
      title: "Game Over!",
      description: `Final score: ${score}`,
      variant: "default",
    });
  };

  const handleArabicSelect = (arabic: string) => {
    if (matchedPairs.includes(vocabularyPairs.find(pair => pair.arabic === arabic)?.id || -1)) {
      return; // Already matched
    }
    
    setSelectedArabic(arabic);
    
    if (selectedEnglish) {
      // Check if this forms a match
      const matchingPair = vocabularyPairs.find(
        pair => pair.arabic === arabic && pair.english === selectedEnglish
      );
      
      if (matchingPair) {
        // Correct match
        setMatchedPairs([...matchedPairs, matchingPair.id]);
        setScore(score + 10);
        setSelectedArabic(null);
        setSelectedEnglish(null);
        
        toast({
          title: "Correct!",
          description: "+10 points",
          variant: "default",
        });
        
        // Check if all pairs are matched
        if (matchedPairs.length + 1 === arabicOptions.length) {
          toast({
            title: "Level Complete!",
            description: "Great job matching all words!",
            variant: "default",
          });
          
          // Set up next level or end game if it's the last level
          if (difficulty === 'easy') {
            setDifficulty('medium');
            setupGame();
          } else if (difficulty === 'medium') {
            setDifficulty('hard');
            setupGame();
          } else {
            endGame();
          }
        }
      } else {
        // Incorrect match
        setTimeout(() => {
          setSelectedArabic(null);
          setSelectedEnglish(null);
          setScore(Math.max(0, score - 5));
          
          toast({
            title: "Incorrect!",
            description: "-5 points",
            variant: "destructive",
          });
        }, 500);
      }
    }
  };

  const handleEnglishSelect = (english: string) => {
    if (matchedPairs.includes(vocabularyPairs.find(pair => pair.english === english)?.id || -1)) {
      return; // Already matched
    }
    
    setSelectedEnglish(english);
    
    if (selectedArabic) {
      // Check if this forms a match
      const matchingPair = vocabularyPairs.find(
        pair => pair.english === english && pair.arabic === selectedArabic
      );
      
      if (matchingPair) {
        // Correct match
        setMatchedPairs([...matchedPairs, matchingPair.id]);
        setScore(score + 10);
        setSelectedArabic(null);
        setSelectedEnglish(null);
        
        toast({
          title: "Correct!",
          description: "+10 points",
          variant: "default",
        });
        
        // Check if all pairs are matched
        if (matchedPairs.length + 1 === englishOptions.length) {
          toast({
            title: "Level Complete!",
            description: "Great job matching all words!",
            variant: "default",
          });
          
          // Set up next level or end game if it's the last level
          if (difficulty === 'easy') {
            setDifficulty('medium');
            setupGame();
          } else if (difficulty === 'medium') {
            setDifficulty('hard');
            setupGame();
          } else {
            endGame();
          }
        }
      } else {
        // Incorrect match
        setTimeout(() => {
          setSelectedArabic(null);
          setSelectedEnglish(null);
          setScore(Math.max(0, score - 5));
          
          toast({
            title: "Incorrect!",
            description: "-5 points",
            variant: "destructive",
          });
        }, 500);
      }
    }
  };

  const isMatched = (id: number) => matchedPairs.includes(id);

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Match the Meaning</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Match Arabic Qur'anic words with their correct English meanings before time runs out!
          </p>
        </div>

        {!gameStarted || gameOver ? (
          <div className="max-w-2xl mx-auto bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">{gameOver ? "Game Over" : "Ready to Play?"}</h2>
            <p className="mb-6">
              {gameOver 
                ? `Final score: ${score}. Would you like to play again?` 
                : "Test your knowledge of Qur'anic vocabulary by matching Arabic words with their English meanings. Be quick - you're racing against the clock!"}
            </p>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Select Difficulty:</h3>
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={() => setDifficulty('easy')}
                  variant={difficulty === 'easy' ? 'default' : 'outline'}
                >
                  Easy
                </Button>
                <Button 
                  onClick={() => setDifficulty('medium')}
                  variant={difficulty === 'medium' ? 'default' : 'outline'}
                >
                  Medium
                </Button>
                <Button 
                  onClick={() => setDifficulty('hard')}
                  variant={difficulty === 'hard' ? 'default' : 'outline'}
                >
                  Hard
                </Button>
              </div>
            </div>
            
            <Button onClick={startGame} size="lg">
              {gameOver ? "Play Again" : "Start Game"}
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <Badge variant="outline" className="text-lg px-4 py-2">
                Score: {score}
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2 flex items-center">
                <Timer className="mr-2 h-4 w-4" />
                Time: {timer}s
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">
                Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <Card className="p-4">
                <h3 className="text-xl font-bold mb-4 text-center">Arabic Words</h3>
                <div className="grid grid-cols-2 gap-2">
                  {arabicOptions.map((arabic, index) => {
                    const pair = vocabularyPairs.find(p => p.arabic === arabic);
                    const isAlreadyMatched = pair && matchedPairs.includes(pair.id);
                    
                    return (
                      <Button
                        key={index}
                        variant={isAlreadyMatched ? "default" : (selectedArabic === arabic ? "default" : "outline")}
                        className={`text-xl h-16 ${isAlreadyMatched ? "opacity-50 pointer-events-none" : ""}`}
                        onClick={() => handleArabicSelect(arabic)}
                        disabled={isAlreadyMatched}
                      >
                        {arabic} {isAlreadyMatched && <Check className="ml-2 h-4 w-4" />}
                      </Button>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="text-xl font-bold mb-4 text-center">English Meanings</h3>
                <div className="grid grid-cols-2 gap-2">
                  {englishOptions.map((english, index) => {
                    const pair = vocabularyPairs.find(p => p.english === english);
                    const isAlreadyMatched = pair && matchedPairs.includes(pair.id);
                    
                    return (
                      <Button
                        key={index}
                        variant={isAlreadyMatched ? "default" : (selectedEnglish === english ? "default" : "outline")}
                        className={`h-16 ${isAlreadyMatched ? "opacity-50 pointer-events-none" : ""}`}
                        onClick={() => handleEnglishSelect(english)}
                        disabled={isAlreadyMatched}
                      >
                        {english} {isAlreadyMatched && <Check className="ml-2 h-4 w-4" />}
                      </Button>
                    );
                  })}
                </div>
              </Card>
            </div>

            <div className="flex justify-center">
              <Button variant="outline" onClick={setupGame} className="flex items-center">
                <Shuffle className="mr-2 h-4 w-4" /> Shuffle Words
              </Button>
            </div>
          </div>
        )}

        <div className="mt-8 bg-muted p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">How to Play</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Select an Arabic word, then select its English meaning to make a match.</li>
            <li>Each correct match gives you 10 points.</li>
            <li>Each incorrect match costs you 5 points.</li>
            <li>Match all words before time runs out to advance to the next level.</li>
            <li>As you progress, the difficulty increases with more words and less time.</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MatchTheMeaning;
