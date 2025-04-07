
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const Crossword = () => {
  const [grid, setGrid] = useState<string[][]>(Array(10).fill(null).map(() => Array(10).fill('')));
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [direction, setDirection] = useState<'across' | 'down'>('across');
  const [complete, setComplete] = useState(false);

  const crosswordData = {
    words: [
      { 
        word: 'RAMADAN', 
        startRow: 0, 
        startCol: 2, 
        direction: 'down',
        clue: 'The ninth month of the Islamic calendar, observed by Muslims worldwide as a month of fasting.'
      },
      { 
        word: 'SALAH', 
        startRow: 2, 
        startCol: 0, 
        direction: 'across',
        clue: 'Ritual prayer performed five times a day by Muslims.'
      },
      { 
        word: 'HAJJ', 
        startRow: 4, 
        startCol: 3, 
        direction: 'across',
        clue: 'Annual Islamic pilgrimage to Mecca, Saudi Arabia.'
      },
      { 
        word: 'QURAN', 
        startRow: 3, 
        startCol: 7, 
        direction: 'down',
        clue: 'The central religious text of Islam.'
      },
      { 
        word: 'IMAN', 
        startRow: 7, 
        startCol: 1, 
        direction: 'across',
        clue: 'Faith or belief in Islamic theology.'
      }
    ]
  };

  // Initialize the grid with the crossword pattern
  React.useEffect(() => {
    const newGrid = Array(10).fill(null).map(() => Array(10).fill(''));
    
    // Place black cells in the grid where no letters should go
    crosswordData.words.forEach(word => {
      for (let i = 0; i < word.word.length; i++) {
        const row = word.direction === 'across' ? word.startRow : word.startRow + i;
        const col = word.direction === 'across' ? word.startCol + i : word.startCol;
        
        newGrid[row][col] = '';
      }
    });
    
    setGrid(newGrid);
  }, []);

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    
    if (e.key === 'Backspace') {
      const newGrid = [...grid];
      newGrid[row][col] = '';
      setGrid(newGrid);
      
      // Move to previous cell
      if (direction === 'across' && col > 0) {
        setSelectedCell({ row, col: col - 1 });
      } else if (direction === 'down' && row > 0) {
        setSelectedCell({ row: row - 1, col });
      }
    } else if (/^[A-Za-z]$/.test(e.key)) {
      const newGrid = [...grid];
      newGrid[row][col] = e.key.toUpperCase();
      setGrid(newGrid);
      
      // Move to next cell
      if (direction === 'across' && col < 9) {
        setSelectedCell({ row, col: col + 1 });
      } else if (direction === 'down' && row < 9) {
        setSelectedCell({ row: row + 1, col });
      }
      
      // Check if crossword is complete
      checkCrossword(newGrid);
    } else if (e.key === 'ArrowRight') {
      if (col < 9) setSelectedCell({ row, col: col + 1 });
    } else if (e.key === 'ArrowLeft') {
      if (col > 0) setSelectedCell({ row, col: col - 1 });
    } else if (e.key === 'ArrowDown') {
      if (row < 9) setSelectedCell({ row: row + 1, col });
    } else if (e.key === 'ArrowUp') {
      if (row > 0) setSelectedCell({ row: row - 1, col });
    }
  };

  const checkCrossword = (currentGrid: string[][]) => {
    let isComplete = true;
    
    crosswordData.words.forEach(word => {
      for (let i = 0; i < word.word.length; i++) {
        const row = word.direction === 'across' ? word.startRow : word.startRow + i;
        const col = word.direction === 'across' ? word.startCol + i : word.startCol;
        
        if (currentGrid[row][col] !== word.word[i]) {
          isComplete = false;
          break;
        }
      }
    });
    
    if (isComplete && !complete) {
      setComplete(true);
      toast.success('Congratulations! You completed the crossword!');
    }
  };

  const toggleDirection = () => {
    setDirection(direction === 'across' ? 'down' : 'across');
  };

  const resetCrossword = () => {
    const newGrid = Array(10).fill(null).map(() => Array(10).fill(''));
    setGrid(newGrid);
    setComplete(false);
  };

  // Helper to determine if a cell should be displayed as part of the crossword
  const isCrosswordCell = (row: number, col: number) => {
    return crosswordData.words.some(word => {
      for (let i = 0; i < word.word.length; i++) {
        const wordRow = word.direction === 'across' ? word.startRow : word.startRow + i;
        const wordCol = word.direction === 'across' ? word.startCol + i : word.startCol;
        
        if (wordRow === row && wordCol === col) {
          return true;
        }
      }
      return false;
    });
  };

  // Find starting cell numbers for clues
  const getCellNumber = (row: number, col: number) => {
    const wordStart = crosswordData.words.findIndex(word => 
      (word.startRow === row && word.startCol === col)
    );
    
    return wordStart !== -1 ? crosswordData.words.findIndex(word => 
      (word.startRow === row && word.startCol === col)
    ) + 1 : null;
  };

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Islamic Crossword</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            Complete the crossword puzzle using the clues provided. Click a cell and type to enter letters.
          </p>
          <div className="flex justify-center gap-4 mb-6">
            <Button 
              onClick={toggleDirection} 
              variant="outline"
              className="flex items-center gap-2"
            >
              Direction: {direction === 'across' ? 'Across →' : 'Down ↓'}
            </Button>
            <Button 
              onClick={resetCrossword} 
              variant="outline"
              className="flex items-center gap-2"
            >
              Reset
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row justify-center gap-8">
          <div 
            className="grid grid-cols-10 gap-0.5 bg-gray-300 p-0.5 rounded w-fit mx-auto"
            tabIndex={0}
            onKeyDown={handleKeyDown}
          >
            {grid.map((row, rowIndex) => (
              row.map((cell, colIndex) => (
                isCrosswordCell(rowIndex, colIndex) ? (
                  <div 
                    key={`${rowIndex}-${colIndex}`}
                    className={`w-10 h-10 flex items-center justify-center relative bg-white border border-gray-300 cursor-pointer ${
                      selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    {getCellNumber(rowIndex, colIndex) && (
                      <span className="absolute text-xs top-0.5 left-0.5">{getCellNumber(rowIndex, colIndex)}</span>
                    )}
                    <span className="text-lg font-bold">{cell}</span>
                  </div>
                ) : (
                  <div 
                    key={`${rowIndex}-${colIndex}`}
                    className="w-10 h-10 bg-gray-800"
                  ></div>
                )
              ))
            ))}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto lg:mx-0">
            <h2 className="text-xl font-bold mb-4">Clues</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Across</h3>
                <ol className="list-decimal list-inside space-y-2">
                  {crosswordData.words
                    .filter(word => word.direction === 'across')
                    .map((word, index) => (
                      <li key={index} className="text-sm">
                        <span className="font-medium">{crosswordData.words.findIndex(w => w.word === word.word) + 1}.</span> {word.clue}
                      </li>
                    ))
                  }
                </ol>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Down</h3>
                <ol className="list-decimal list-inside space-y-2">
                  {crosswordData.words
                    .filter(word => word.direction === 'down')
                    .map((word, index) => (
                      <li key={index} className="text-sm">
                        <span className="font-medium">{crosswordData.words.findIndex(w => w.word === word.word) + 1}.</span> {word.clue}
                      </li>
                    ))
                  }
                </ol>
              </div>
            </div>
          </div>
        </div>
        
        {complete && (
          <div className="mt-8 text-center">
            <Badge variant="outline" className="px-4 py-2 text-lg bg-green-100 text-green-800 border-green-200">
              Completed!
            </Badge>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Crossword;
