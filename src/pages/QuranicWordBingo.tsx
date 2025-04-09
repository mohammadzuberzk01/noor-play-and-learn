
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Check, Book, RefreshCw } from 'lucide-react';

interface BingoWord {
  id: number;
  word: string;
  meaning: string;
  frequency: string;
  called: boolean;
}

const QuranicWordBingo = () => {
  const [board, setBoard] = useState<BingoWord[][]>([]);
  const [calledWords, setCalledWords] = useState<BingoWord[]>([]);
  const [currentWord, setCurrentWord] = useState<BingoWord | null>(null);
  const [gameActive, setGameActive] = useState(false);
  const [bingoAchieved, setBingoAchieved] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);
  
  // Sample Qur'anic words data (high-frequency words)
  const quranicWords: BingoWord[] = [
    { id: 1, word: "الله", meaning: "Allah", frequency: "2699 times", called: false },
    { id: 2, word: "رب", meaning: "Lord", frequency: "970 times", called: false },
    { id: 3, word: "قال", meaning: "He said", frequency: "1722 times", called: false },
    { id: 4, word: "كان", meaning: "He was/is", frequency: "1361 times", called: false },
    { id: 5, word: "ناس", meaning: "People", frequency: "241 times", called: false },
    { id: 6, word: "يوم", meaning: "Day", frequency: "475 times", called: false },
    { id: 7, word: "أرض", meaning: "Earth", frequency: "461 times", called: false },
    { id: 8, word: "سماء", meaning: "Sky/Heaven", frequency: "310 times", called: false },
    { id: 9, word: "علم", meaning: "Knowledge", frequency: "854 times", called: false },
    { id: 10, word: "قلب", meaning: "Heart", frequency: "168 times", called: false },
    { id: 11, word: "نفس", meaning: "Soul/Self", frequency: "295 times", called: false },
    { id: 12, word: "آية", meaning: "Sign/Verse", frequency: "382 times", called: false },
    { id: 13, word: "كتاب", meaning: "Book", frequency: "261 times", called: false },
    { id: 14, word: "سبيل", meaning: "Way/Path", frequency: "176 times", called: false },
    { id: 15, word: "خير", meaning: "Good", frequency: "186 times", called: false },
    { id: 16, word: "عمل", meaning: "Work/Deed", frequency: "360 times", called: false },
    { id: 17, word: "ذكر", meaning: "Remember/Mention", frequency: "285 times", called: false },
    { id: 18, word: "جنة", meaning: "Garden/Paradise", frequency: "147 times", called: false },
    { id: 19, word: "نار", meaning: "Fire", frequency: "145 times", called: false },
    { id: 20, word: "حق", meaning: "Truth/Right", frequency: "282 times", called: false },
    { id: 21, word: "آمن", meaning: "Believe", frequency: "818 times", called: false },
    { id: 22, word: "صلاة", meaning: "Prayer", frequency: "99 times", called: false },
    { id: 23, word: "رحمة", meaning: "Mercy", frequency: "114 times", called: false },
    { id: 24, word: "ماء", meaning: "Water", frequency: "63 times", called: false },
    { id: 25, word: "ليل", meaning: "Night", frequency: "92 times", called: false },
    { id: 26, word: "نهار", meaning: "Day", frequency: "57 times", called: false },
    { id: 27, word: "سمع", meaning: "Hear", frequency: "185 times", called: false },
    { id: 28, word: "بصر", meaning: "See", frequency: "148 times", called: false },
    { id: 29, word: "قدر", meaning: "Power/Ability", frequency: "132 times", called: false },
    { id: 30, word: "فضل", meaning: "Favor/Bounty", frequency: "104 times", called: false }
  ];

  // Board size (5x5 for standard bingo)
  const BOARD_SIZE = 5;
  
  // Initialize or create a new board
  const createBoard = () => {
    // Reset game state
    setBingoAchieved(false);
    setSelectedCells([]);
    setCurrentWord(null);
    setCalledWords([]);
    
    // Shuffle words and select a subset based on level (more difficult words as level increases)
    const shuffledWords = [...quranicWords]
      .sort(() => Math.random() - 0.5)
      .map(word => ({ ...word, called: false }));
    
    // Create 5x5 board with random words
    const newBoard: BingoWord[][] = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      const row: BingoWord[] = [];
      for (let j = 0; j < BOARD_SIZE; j++) {
        const wordIndex = i * BOARD_SIZE + j;
        if (wordIndex < shuffledWords.length) {
          row.push(shuffledWords[wordIndex]);
        } else {
          // Fallback if not enough words
          row.push(shuffledWords[Math.floor(Math.random() * shuffledWords.length)]);
        }
      }
      newBoard.push(row);
    }
    
    // Set the middle cell as "FREE" in classic bingo style
    if (level === 1) {
      const middleWord = { 
        id: 0, 
        word: "مجاني", 
        meaning: "FREE", 
        frequency: "", 
        called: true 
      };
      newBoard[2][2] = middleWord;
      setSelectedCells([[2, 2]]);
    }
    
    setBoard(newBoard);
    setGameActive(true);
  };

  // Initialize game
  useEffect(() => {
    createBoard();
  }, [level]);

  // Call a random word
  const callRandomWord = () => {
    if (!gameActive || bingoAchieved) return;
    
    // Find words not yet called
    const flatBoard = board.flat();
    const uncalledWords = flatBoard.filter(word => 
      !word.called && word.id !== 0 && !calledWords.some(called => called.id === word.id)
    );
    
    if (uncalledWords.length === 0) {
      toast({
        title: "All words called!",
        description: "The game is now complete.",
      });
      return;
    }
    
    // Select a random uncalled word
    const randomIndex = Math.floor(Math.random() * uncalledWords.length);
    const newCalledWord = uncalledWords[randomIndex];
    
    // Update called words
    setCurrentWord(newCalledWord);
    setCalledWords([...calledWords, newCalledWord]);
    
    // Highlight all instances of this word on the board
    const newBoard = board.map(row =>
      row.map(cell =>
        cell.id === newCalledWord.id ? { ...cell, called: true } : cell
      )
    );
    
    setBoard(newBoard);
    
    // Announce the called word
    toast({
      title: "Word Called!",
      description: `${newCalledWord.word} - ${newCalledWord.meaning}`,
    });
  };

  // Handle cell selection
  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (!gameActive || bingoAchieved) return;
    
    const cell = board[rowIndex][colIndex];
    
    // Can only mark cells with called words
    if (!cell.called) {
      toast({
        title: "Not Called Yet",
        description: "This word hasn't been called yet!",
        variant: "destructive"
      });
      return;
    }
    
    // Toggle cell selection
    if (selectedCells.some(([r, c]) => r === rowIndex && c === colIndex)) {
      setSelectedCells(selectedCells.filter(([r, c]) => !(r === rowIndex && c === colIndex)));
    } else {
      setSelectedCells([...selectedCells, [rowIndex, colIndex]]);
      
      // Check for bingo after selection
      setTimeout(() => {
        checkForBingo([...selectedCells, [rowIndex, colIndex]]);
      }, 100);
    }
  };

  // Check if player has achieved a bingo
  const checkForBingo = (cells: [number, number][]) => {
    // Check for horizontal bingo
    for (let row = 0; row < BOARD_SIZE; row++) {
      let count = 0;
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (cells.some(([r, c]) => r === row && c === col)) {
          count++;
        }
      }
      if (count === BOARD_SIZE) {
        achieveBingo();
        return;
      }
    }
    
    // Check for vertical bingo
    for (let col = 0; col < BOARD_SIZE; col++) {
      let count = 0;
      for (let row = 0; row < BOARD_SIZE; row++) {
        if (cells.some(([r, c]) => r === row && c === col)) {
          count++;
        }
      }
      if (count === BOARD_SIZE) {
        achieveBingo();
        return;
      }
    }
    
    // Check for diagonal bingo (top-left to bottom-right)
    let count = 0;
    for (let i = 0; i < BOARD_SIZE; i++) {
      if (cells.some(([r, c]) => r === i && c === i)) {
        count++;
      }
    }
    if (count === BOARD_SIZE) {
      achieveBingo();
      return;
    }
    
    // Check for diagonal bingo (top-right to bottom-left)
    count = 0;
    for (let i = 0; i < BOARD_SIZE; i++) {
      if (cells.some(([r, c]) => r === i && c === BOARD_SIZE - 1 - i)) {
        count++;
      }
    }
    if (count === BOARD_SIZE) {
      achieveBingo();
      return;
    }
  };

  // Handle bingo achievement
  const achieveBingo = () => {
    setBingoAchieved(true);
    setGameActive(false);
    setScore(score + 100 * level);
    
    toast({
      title: "BINGO!",
      description: `Congratulations! You scored ${100 * level} points.`,
      variant: "default"
    });
  };

  // Advance to next level
  const nextLevel = () => {
    setLevel(level + 1);
  };

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Qur'anic Word Bingo</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Play bingo with commonly repeated Qur'anic words and learn their meanings.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-7/12">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <Badge variant="outline" className="px-3 py-1 text-base">
                  Level: {level}
                </Badge>
                <Badge variant="outline" className="px-3 py-1 text-base">
                  Score: {score}
                </Badge>
                <Badge variant={bingoAchieved ? "default" : "outline"} className="px-3 py-1 text-base">
                  {bingoAchieved ? "BINGO!" : "No Bingo Yet"}
                </Badge>
              </div>
              
              {/* Bingo Board */}
              <div className="mb-6">
                <div className="grid grid-cols-5 gap-1">
                  {board.map((row, rowIndex) => (
                    row.map((cell, colIndex) => (
                      <div 
                        key={`${rowIndex}-${colIndex}`}
                        className={`aspect-square border p-1 cursor-pointer flex flex-col items-center justify-center text-center ${
                          selectedCells.some(([r, c]) => r === rowIndex && c === colIndex)
                            ? 'bg-islamic-primary text-white'
                            : cell.called
                              ? 'bg-islamic-primary/20'
                              : 'bg-white'
                        }`}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                      >
                        <div className="font-bold text-lg font-arabic">{cell.word}</div>
                        <div className="text-xs mt-1">{cell.meaning}</div>
                      </div>
                    ))
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center gap-4">
                <Button onClick={callRandomWord} disabled={!gameActive || bingoAchieved}>
                  Call Word
                </Button>
                
                {bingoAchieved && (
                  <Button onClick={nextLevel}>
                    Next Level
                  </Button>
                )}
                
                <Button variant="outline" onClick={createBoard}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  New Board
                </Button>
              </div>
            </Card>
          </div>
          
          <div className="md:w-5/12">
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">
                {currentWord ? "Current Word" : "No Word Called Yet"}
              </h2>
              
              {currentWord ? (
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="font-bold text-3xl mb-2 font-arabic">{currentWord.word}</div>
                  <div className="text-xl mb-1">{currentWord.meaning}</div>
                  <div className="text-sm text-muted-foreground">
                    Appears in Qur'an: {currentWord.frequency}
                  </div>
                </div>
              ) : (
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p>Click "Call Word" to start the game</p>
                </div>
              )}
            </Card>
            
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Book className="mr-2 h-5 w-5" />
                Most Frequent Qur'anic Words
              </h2>
              <p className="mb-4">
                Did you know that learning just the top 125 most frequent words in the Qur'an 
                would allow you to recognize approximately 50% of the words in the Qur'an? 
              </p>
              <p>
                The most frequently used word is "Allah" (الله), appearing 2,699 times.
                Learning high-frequency words is an efficient way to build your Qur'anic vocabulary.
              </p>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Called Words</h2>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {calledWords.length === 0 ? (
                  <p className="text-muted-foreground">No words called yet</p>
                ) : (
                  calledWords.map((word, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                      <div>
                        <span className="font-bold font-arabic">{word.word}</span>
                        <span className="mx-1">-</span>
                        <span>{word.meaning}</span>
                      </div>
                      <Check className="h-4 w-4 text-islamic-primary" />
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
        
        <div className="mt-8 bg-muted p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">How to Play</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Click "Call Word" to reveal a random Qur'anic word</li>
            <li>Mark any matches on your bingo board by clicking the cell</li>
            <li>Complete a row, column or diagonal to get BINGO!</li>
            <li>Learn common Qur'anic words and their meanings as you play</li>
          </ul>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default QuranicWordBingo;
