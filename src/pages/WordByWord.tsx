
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Edit, Check, X, Award } from 'lucide-react';

interface ArabicWord {
  id: number;
  arabic: string;
  transliteration: string;
  meaning: string;
  isCorrect?: boolean;
}

interface AyahPuzzle {
  id: number;
  surahName: string;
  ayahNumber: string;
  words: ArabicWord[];
  wordOrder: number[];
}

const WordByWord = () => {
  const [puzzles, setPuzzles] = useState<AyahPuzzle[]>([]);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  // Sample puzzle data
  const puzzleData: AyahPuzzle[] = [
    {
      id: 1,
      surahName: "Al-Fatihah",
      ayahNumber: "1:1",
      words: [
        { id: 1, arabic: "بِسْمِ", transliteration: "Bismi", meaning: "In the name" },
        { id: 2, arabic: "اللَّهِ", transliteration: "Allāhi", meaning: "of Allah" },
        { id: 3, arabic: "الرَّحْمَٰنِ", transliteration: "ar-Raḥmāni", meaning: "the Most Gracious" },
        { id: 4, arabic: "الرَّحِيمِ", transliteration: "ar-Raḥīmi", meaning: "the Most Merciful" }
      ],
      wordOrder: [1, 2, 3, 4]
    },
    {
      id: 2,
      surahName: "Al-Ikhlas",
      ayahNumber: "112:1",
      words: [
        { id: 1, arabic: "قُلْ", transliteration: "Qul", meaning: "Say" },
        { id: 2, arabic: "هُوَ", transliteration: "Huwa", meaning: "He is" },
        { id: 3, arabic: "اللَّهُ", transliteration: "Allāhu", meaning: "Allah" },
        { id: 4, arabic: "أَحَدٌ", transliteration: "Aḥad", meaning: "One" }
      ],
      wordOrder: [1, 2, 3, 4]
    },
    {
      id: 3,
      surahName: "Al-Asr",
      ayahNumber: "103:1-2",
      words: [
        { id: 1, arabic: "وَالْعَصْرِ", transliteration: "Wal-'Asr", meaning: "By time" },
        { id: 2, arabic: "إِنَّ", transliteration: "Inna", meaning: "Indeed" },
        { id: 3, arabic: "الْإِنسَانَ", transliteration: "al-insāna", meaning: "mankind" },
        { id: 4, arabic: "لَفِي", transliteration: "lafī", meaning: "is in" },
        { id: 5, arabic: "خُسْرٍ", transliteration: "khusr", meaning: "loss" }
      ],
      wordOrder: [1, 2, 3, 4, 5]
    }
  ];
  
  useEffect(() => {
    if (isPlaying) {
      // Shuffle the puzzles
      const shuffledPuzzles = [...puzzleData];
      setPuzzles(shuffledPuzzles);
      setCurrentPuzzleIndex(0);
      setSelectedWords([]);
      setScore(0);
      setLevel(1);
      setIsComplete(false);
    }
  }, [isPlaying]);
  
  const startGame = () => {
    setIsPlaying(true);
  };
  
  const handleWordSelect = (wordId: number) => {
    // Check if word is already selected
    if (selectedWords.includes(wordId)) {
      return;
    }
    
    const newSelectedWords = [...selectedWords, wordId];
    setSelectedWords(newSelectedWords);
    
    const currentPuzzle = puzzles[currentPuzzleIndex];
    
    // Check if all words are selected
    if (newSelectedWords.length === currentPuzzle.words.length) {
      // Check if the order is correct
      const isOrderCorrect = newSelectedWords.every(
        (wordId, index) => wordId === currentPuzzle.wordOrder[index]
      );
      
      if (isOrderCorrect) {
        // Order is correct
        setScore(score + 10);
        toast({
          title: "Correct!",
          description: "Perfect order! +10 points",
          variant: "success"
        });
        
        // Check if there are more puzzles
        if (currentPuzzleIndex < puzzles.length - 1) {
          setTimeout(() => {
            setCurrentPuzzleIndex(currentPuzzleIndex + 1);
            setSelectedWords([]);
            setLevel(level + 1);
          }, 1500);
        } else {
          // Game complete
          setIsComplete(true);
          toast({
            title: "Game Complete!",
            description: `Final score: ${score + 10}`,
          });
        }
      } else {
        // Order is incorrect
        // Highlight wrong words
        const puzzleWordsWithCorrectness = currentPuzzle.words.map(word => ({
          ...word,
          isCorrect: newSelectedWords.indexOf(word.id) === currentPuzzle.wordOrder.indexOf(word.id)
        }));
        
        // Update puzzle with correctness info
        const updatedPuzzles = [...puzzles];
        updatedPuzzles[currentPuzzleIndex] = {
          ...currentPuzzle,
          words: puzzleWordsWithCorrectness
        };
        setPuzzles(updatedPuzzles);
        
        toast({
          title: "Incorrect Order",
          description: "Try again with the correct order",
          variant: "destructive"
        });
        
        // Reset after a delay
        setTimeout(() => {
          setSelectedWords([]);
          // Reset correctness indicators
          const resetPuzzles = [...updatedPuzzles];
          resetPuzzles[currentPuzzleIndex] = puzzleData[currentPuzzleIndex];
          setPuzzles(resetPuzzles);
        }, 2000);
      }
    }
  };
  
  const currentPuzzle = puzzles[currentPuzzleIndex];
  
  // Get available words (those not yet selected)
  const availableWords = currentPuzzle?.words.filter(
    word => !selectedWords.includes(word.id)
  ) || [];
  
  // Get selected words in order of selection
  const orderedSelectedWords = currentPuzzle?.words.filter(
    word => selectedWords.includes(word.id)
  ).sort((a, b) => selectedWords.indexOf(a.id) - selectedWords.indexOf(b.id)) || [];
  
  // Shuffle available words for display
  const shuffledAvailableWords = [...availableWords].sort(() => Math.random() - 0.5);
  
  const restartGame = () => {
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Word-by-Word Arabic</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Build Quranic verses word by word to understand their meaning
          </p>
        </div>
        
        {!isPlaying && !isComplete ? (
          <div className="max-w-lg mx-auto text-center p-8 bg-card rounded-lg shadow-md">
            <Edit className="h-16 w-16 mx-auto mb-4 text-islamic-primary" />
            <h2 className="text-2xl font-bold mb-4">Word-by-Word Challenge</h2>
            <p className="mb-6">Arrange Arabic words in the correct order to form complete Quranic verses. Learn word meanings and improve your understanding of the Quran.</p>
            <Button size="lg" onClick={startGame}>
              Start Game
            </Button>
          </div>
        ) : isComplete ? (
          <div className="max-w-lg mx-auto text-center p-8 bg-card rounded-lg shadow-md">
            <Award className="h-16 w-16 mx-auto mb-4 text-islamic-primary" />
            <h2 className="text-2xl font-bold mb-4">Game Complete!</h2>
            <p className="text-xl mb-6">Your final score: {score}</p>
            <Button size="lg" onClick={restartGame}>
              Play Again
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <Badge variant="outline" className="text-lg px-4 py-2">
                Score: {score}
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">
                Level: {level}/{puzzles.length}
              </Badge>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-md mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Surah {currentPuzzle?.surahName} ({currentPuzzle?.ayahNumber})
                </h3>
                <Badge>Build the verse</Badge>
              </div>
              
              {/* Selected Words Area */}
              <div className="min-h-24 p-4 bg-muted rounded-lg mb-6 flex flex-wrap gap-2 items-center">
                {orderedSelectedWords.length > 0 ? (
                  orderedSelectedWords.map((word, index) => (
                    <div 
                      key={word.id} 
                      className={`px-4 py-2 rounded-md flex flex-col items-center ${
                        word.isCorrect === false ? 'bg-red-100 border border-red-300' : 
                        word.isCorrect === true ? 'bg-green-100 border border-green-300' : 
                        'bg-white border border-gray-200'
                      }`}
                    >
                      <span className="text-lg font-arabic">{word.arabic}</span>
                      <span className="text-xs text-muted-foreground">{word.transliteration}</span>
                      {word.isCorrect === false && <X className="h-4 w-4 text-red-500 mt-1" />}
                      {word.isCorrect === true && <Check className="h-4 w-4 text-green-500 mt-1" />}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">Select words to build the verse...</p>
                )}
              </div>
              
              {/* Available Words */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Available Words:</h3>
                <div className="flex flex-wrap gap-3">
                  {shuffledAvailableWords.map(word => (
                    <Button
                      key={word.id}
                      variant="outline"
                      className="flex flex-col items-center"
                      onClick={() => handleWordSelect(word.id)}
                    >
                      <span className="text-lg font-arabic">{word.arabic}</span>
                      <span className="text-xs">{word.transliteration}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Word Meanings */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3">Word Meanings:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {currentPuzzle?.words.map(word => (
                  <div key={word.id} className="p-3 bg-muted rounded-md">
                    <p className="text-lg font-arabic">{word.arabic}</p>
                    <p className="text-xs text-muted-foreground">{word.transliteration}</p>
                    <p className="text-sm font-medium mt-1">{word.meaning}</p>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}
        
        <div className="mt-8 bg-muted p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">How to Play</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Select words in the correct order to build the Quranic verse</li>
            <li>Learn the meaning of each word to improve your understanding</li>
            <li>Complete all levels to finish the game</li>
            <li>Earn 10 points for each correctly ordered verse</li>
          </ul>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WordByWord;
