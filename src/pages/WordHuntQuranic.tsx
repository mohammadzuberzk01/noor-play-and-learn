
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Shuffle, Check, Timer, Info } from 'lucide-react';

interface Word {
  arabic: string;
  english: string;
  found: boolean;
}

const WordHuntQuranic = () => {
  const [gridSize, setGridSize] = useState(8);
  const [grid, setGrid] = useState<string[][]>([]);
  const [words, setWords] = useState<Word[]>([
    { arabic: 'كتاب', english: 'book', found: false },
    { arabic: 'قلم', english: 'pen', found: false },
    { arabic: 'علم', english: 'knowledge', found: false },
    { arabic: 'رب', english: 'lord', found: false },
    { arabic: 'خير', english: 'good', found: false },
    { arabic: 'نور', english: 'light', found: false },
    { arabic: 'ماء', english: 'water', found: false },
    { arabic: 'سلام', english: 'peace', found: false }
  ]);
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(180);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  const arabicAlphabet = [
    'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 
    'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'
  ];

  useEffect(() => {
    if (gameStarted && !gameOver) {
      setupGame();
    }
  }, [gameStarted, difficulty]);

  useEffect(() => {
    let interval: number;
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
    // Adjust grid size and timer based on difficulty
    let newGridSize: number;
    let newTimer: number;
    let wordCount: number;
    
    switch (difficulty) {
      case 'easy':
        newGridSize = 8;
        newTimer = 180;
        wordCount = 5;
        break;
      case 'medium':
        newGridSize = 10;
        newTimer = 150;
        wordCount = 7;
        break;
      case 'hard':
        newGridSize = 12;
        newTimer = 120;
        wordCount = 8;
        break;
      default:
        newGridSize = 8;
        newTimer = 180;
        wordCount = 5;
    }
    
    setGridSize(newGridSize);
    setTimer(newTimer);
    
    // Reset words
    const shuffledWords = [...words].sort(() => Math.random() - 0.5).slice(0, wordCount).map(word => ({
      ...word,
      found: false
    }));
    setWords(shuffledWords);
    
    // Create empty grid
    const emptyGrid = Array(newGridSize).fill(0).map(() => Array(newGridSize).fill(''));
    
    // Place words in the grid
    const filledGrid = placeWordsInGrid(emptyGrid, shuffledWords);
    
    // Fill remaining cells with random letters
    const finalGrid = fillEmptyCells(filledGrid);
    
    setGrid(finalGrid);
    setSelectedCells([]);
    setScore(0);
  };

  const placeWordsInGrid = (grid: string[][], words: Word[]) => {
    const directions = [
      [0, 1],  // right
      [1, 0],  // down
      [1, 1],  // diagonal down-right
      [0, -1], // left
      [-1, 0], // up
      [-1, -1], // diagonal up-left
      [1, -1], // diagonal down-left
      [-1, 1]  // diagonal up-right
    ];
    
    const newGrid = [...grid.map(row => [...row])];
    
    words.forEach(word => {
      let placed = false;
      let attempts = 0;
      const maxAttempts = 50;
      
      while (!placed && attempts < maxAttempts) {
        attempts++;
        
        // Pick a random direction
        const dirIndex = Math.floor(Math.random() * directions.length);
        const [dx, dy] = directions[dirIndex];
        
        // Pick a random starting point
        const startRow = Math.floor(Math.random() * gridSize);
        const startCol = Math.floor(Math.random() * gridSize);
        
        // Check if word fits
        const arabicWord = word.arabic.split('');
        let fits = true;
        let cells: [number, number][] = [];
        
        for (let i = 0; i < arabicWord.length; i++) {
          const row = startRow + i * dx;
          const col = startCol + i * dy;
          
          if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) {
            fits = false;
            break;
          }
          
          if (newGrid[row][col] !== '' && newGrid[row][col] !== arabicWord[i]) {
            fits = false;
            break;
          }
          
          cells.push([row, col]);
        }
        
        if (fits) {
          arabicWord.forEach((letter, i) => {
            const [row, col] = cells[i];
            newGrid[row][col] = letter;
          });
          placed = true;
        }
      }
      
      // If we couldn't place the word after max attempts, just ignore it
    });
    
    return newGrid;
  };

  const fillEmptyCells = (grid: string[][]) => {
    return grid.map(row => 
      row.map(cell => cell === '' ? arabicAlphabet[Math.floor(Math.random() * arabicAlphabet.length)] : cell)
    );
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
      description: `Final score: ${score}. You found ${words.filter(w => w.found).length} out of ${words.length} words.`,
      variant: "default",
    });
  };

  const handleCellClick = (row: number, col: number) => {
    if (selectedCells.some(([r, c]) => r === row && c === col)) {
      // Deselect the cell
      setSelectedCells(selectedCells.filter(([r, c]) => !(r === row && c === col)));
      return;
    }
    
    if (selectedCells.length === 0) {
      // First cell selection
      setSelectedCells([[row, col]]);
      return;
    }
    
    // Check if the new cell is adjacent to the last selected cell
    const [lastRow, lastCol] = selectedCells[selectedCells.length - 1];
    const isAdjacent = Math.abs(row - lastRow) <= 1 && Math.abs(col - lastCol) <= 1;
    
    if (!isAdjacent) {
      // If not adjacent, start a new selection
      setSelectedCells([[row, col]]);
      return;
    }
    
    // Check if we're continuing in the same direction
    if (selectedCells.length >= 2) {
      const [prevRow, prevCol] = selectedCells[selectedCells.length - 2];
      const dx1 = lastRow - prevRow;
      const dy1 = lastCol - prevCol;
      const dx2 = row - lastRow;
      const dy2 = col - lastCol;
      
      if (dx1 !== dx2 || dy1 !== dy2) {
        // Not continuing in the same direction, start a new selection
        setSelectedCells([[row, col]]);
        return;
      }
    }
    
    // Add the cell to the selection
    setSelectedCells([...selectedCells, [row, col]]);
    
    // Check if the current selection forms a word
    checkForWord([...selectedCells, [row, col]]);
  };

  const checkForWord = (cells: [number, number][]) => {
    const selectedWord = cells.map(([row, col]) => grid[row][col]).join('');
    const wordMatch = words.find(word => !word.found && word.arabic === selectedWord);
    
    if (wordMatch) {
      // Word found!
      setWords(words.map(word => 
        word.arabic === selectedWord ? { ...word, found: true } : word
      ));
      
      setScore(score + (selectedWord.length * 10));
      
      toast({
        title: "Word Found!",
        description: `${selectedWord} (${wordMatch.english}) has been found!`,
        variant: "default",
      });
      
      setSelectedCells([]);
      
      // Check if all words are found
      if (words.filter(w => !w.found).length === 1) {
        toast({
          title: "All Words Found!",
          description: "Congratulations! You've found all the words.",
          variant: "default",
        });
        endGame();
      }
    }
  };

  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some(([r, c]) => r === row && c === col);
  };

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Word Hunt: Qur'an Edition</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find hidden Arabic words from the Qur'an in the puzzle grid.
          </p>
        </div>

        {!gameStarted || gameOver ? (
          <div className="max-w-2xl mx-auto bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">{gameOver ? "Game Over" : "Ready to Play?"}</h2>
            <p className="mb-6">
              {gameOver 
                ? `Final score: ${score}. You found ${words.filter(w => w.found).length} out of ${words.length} words.` 
                : "Search for Arabic words hidden in the puzzle grid. Words can be arranged horizontally, vertically, or diagonally."}
            </p>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Select Difficulty:</h3>
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={() => setDifficulty('easy')}
                  variant={difficulty === 'easy' ? 'default' : 'outline'}
                >
                  Easy (8×8)
                </Button>
                <Button 
                  onClick={() => setDifficulty('medium')}
                  variant={difficulty === 'medium' ? 'default' : 'outline'}
                >
                  Medium (10×10)
                </Button>
                <Button 
                  onClick={() => setDifficulty('hard')}
                  variant={difficulty === 'hard' ? 'default' : 'outline'}
                >
                  Hard (12×12)
                </Button>
              </div>
            </div>
            
            <Button onClick={startGame} size="lg">
              {gameOver ? "Play Again" : "Start Game"}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  Score: {score}
                </Badge>
                <Badge variant="outline" className="text-lg px-4 py-2 flex items-center">
                  <Timer className="mr-2 h-4 w-4" />
                  Time: {timer}s
                </Badge>
              </div>

              <Card className="p-4 overflow-auto">
                <div className="grid" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(30px, 1fr))` }}>
                  {grid.map((row, rowIndex) => 
                    row.map((cell, colIndex) => (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        className={`aspect-square flex items-center justify-center text-xl font-arabic border border-gray-200 ${
                          isCellSelected(rowIndex, colIndex) 
                            ? 'bg-islamic-primary text-white' 
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                      >
                        {cell}
                      </button>
                    ))
                  )}
                </div>
              </Card>
            </div>

            <div>
              <Card className="p-4 mb-4">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Info className="mr-2 h-5 w-5" />
                  Words to Find
                </h3>
                <div className="space-y-2">
                  {words.map((word, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        {word.found && <Check className="mr-2 h-4 w-4 text-green-500" />}
                        <span className={`text-lg ${word.found ? 'line-through opacity-50' : 'font-bold'}`}>
                          {word.arabic}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {word.english}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              <Button variant="outline" onClick={setupGame} className="w-full mb-4 flex items-center justify-center">
                <Shuffle className="mr-2 h-4 w-4" /> New Puzzle
              </Button>
            </div>
          </div>
        )}

        <div className="mt-8 bg-muted p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">How to Play</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Search for the Arabic words listed in the "Words to Find" panel.</li>
            <li>Words can be arranged horizontally, vertically, or diagonally in any direction.</li>
            <li>Click on the first letter of a word, then click on the last letter to select the entire word.</li>
            <li>When you find a word, it will be crossed out from the list.</li>
            <li>Find all words before the timer runs out!</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WordHuntQuranic;
