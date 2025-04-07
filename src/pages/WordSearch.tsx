import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, HelpCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Word search game data
const gameData = {
  grid: [
    ['M', 'R', 'A', 'M', 'A', 'D', 'A', 'N', 'R', 'F'],
    ['A', 'S', 'U', 'H', 'O', 'O', 'R', 'A', 'Y', 'F'],
    ['S', 'B', 'F', 'R', 'I', 'F', 'T', 'A', 'R', 'A'],
    ['J', 'Q', 'S', 'A', 'L', 'A', 'H', 'M', 'Z', 'J'],
    ['I', 'I', 'U', 'U', 'S', 'X', 'H', 'O', 'A', 'R'],
    ['D', 'S', 'O', 'R', 'N', 'T', 'W', 'O', 'K', 'D'],
    ['T', 'L', 'E', 'V', 'A', 'N', 'I', 'N', 'A', 'A'],
    ['G', 'A', 'I', 'D', 'B', 'N', 'A', 'N', 'T', 'T'],
    ['Q', 'L', 'D', 'U', 'B', 'N', 'U', 'H', 'G', 'E'],
    ['D', 'H', 'M', 'A', 'A', 'L', 'L', 'A', 'H', 'S']
  ],
  words: [
    { word: 'RAMADAN', found: false, description: 'The ninth month of the Islamic calendar, observed as a month of fasting.' },
    { word: 'SUHOOR', found: false, description: 'Pre-dawn meal consumed before fasting begins.' },
    { word: 'IFTAR', found: false, description: 'The meal eaten at sunset to break the fast.' },
    { word: 'SALAH', found: false, description: 'Ritual prayer performed five times daily.' },
    { word: 'MASJID', found: false, description: 'A place of worship for Muslims.' },
    { word: 'QURAN', found: false, description: 'The holy book of Islam.' },
    { word: 'ALLAH', found: false, description: 'The Arabic word for God in Abrahamic religions.' },
    { word: 'ZAKAT', found: false, description: 'Giving a fixed portion of one\'s wealth to charity.' }
  ]
};

const WordSearch = () => {
  const { toast } = useToast();
  const [grid, setGrid] = useState(gameData.grid);
  const [words, setWords] = useState(gameData.words);
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [hintWord, setHintWord] = useState('');
  const [completionPercentage, setCompletionPercentage] = useState(0);
  
  // Calculate completion percentage
  useEffect(() => {
    const foundWords = words.filter(word => word.found).length;
    const totalWords = words.length;
    setCompletionPercentage((foundWords / totalWords) * 100);
    
    // Check if all words are found
    if (foundWords === totalWords) {
      toast({
        title: "Congratulations!",
        description: "You've found all the words!",
        duration: 5000,
      });
    }
  }, [words, toast]);
  
  // Handle cell selection start
  const handleMouseDown = (rowIndex: number, colIndex: number) => {
    setIsSelecting(true);
    setSelectedCells([[rowIndex, colIndex]]);
    setCurrentWord(grid[rowIndex][colIndex]);
  };
  
  // Handle cell selection during mouse move
  const handleMouseEnter = (rowIndex: number, colIndex: number) => {
    if (!isSelecting) return;
    
    // Get the starting cell
    const startCell = selectedCells[0];
    
    // Check if the selection is in a straight line (horizontal, vertical, or diagonal)
    const isHorizontal = startCell[0] === rowIndex;
    const isVertical = startCell[1] === colIndex;
    const isDiagonal = Math.abs(startCell[0] - rowIndex) === Math.abs(startCell[1] - colIndex);
    
    if (!isHorizontal && !isVertical && !isDiagonal) return;
    
    // Generate all cells in the line from start to current
    const newSelectedCells: [number, number][] = [startCell];
    let newWord = grid[startCell[0]][startCell[1]];
    
    if (isHorizontal) {
      const startCol = Math.min(startCell[1], colIndex);
      const endCol = Math.max(startCell[1], colIndex);
      for (let col = startCol + 1; col <= endCol; col++) {
        newSelectedCells.push([rowIndex, col]);
        newWord += grid[rowIndex][col];
      }
    } else if (isVertical) {
      const startRow = Math.min(startCell[0], rowIndex);
      const endRow = Math.max(startCell[0], rowIndex);
      for (let row = startRow + 1; row <= endRow; row++) {
        newSelectedCells.push([row, colIndex]);
        newWord += grid[row][colIndex];
      }
    } else if (isDiagonal) {
      const rowDirection = rowIndex > startCell[0] ? 1 : -1;
      const colDirection = colIndex > startCell[1] ? 1 : -1;
      let currentRow = startCell[0] + rowDirection;
      let currentCol = startCell[1] + colDirection;
      
      while (
        (rowDirection > 0 ? currentRow <= rowIndex : currentRow >= rowIndex) &&
        (colDirection > 0 ? currentCol <= colIndex : currentCol >= colIndex)
      ) {
        newSelectedCells.push([currentRow, currentCol]);
        newWord += grid[currentRow][currentCol];
        currentRow += rowDirection;
        currentCol += colDirection;
      }
    }
    
    setSelectedCells(newSelectedCells);
    setCurrentWord(newWord);
  };
  
  // Handle cell selection end
  const handleMouseUp = () => {
    setIsSelecting(false);
    
    // Check if the selected word matches any in the list
    const forwardWord = currentWord;
    const backwardWord = forwardWord.split('').reverse().join('');
    
    const wordIndex = words.findIndex(
      w => w.word === forwardWord || w.word === backwardWord
    );
    
    if (wordIndex !== -1 && !words[wordIndex].found) {
      // Word found!
      const updatedWords = [...words];
      updatedWords[wordIndex].found = true;
      setWords(updatedWords);
      
      toast({
        title: "Word Found!",
        description: `You found ${words[wordIndex].word}: ${words[wordIndex].description}`,
        duration: 3000,
      });
      
      // Keep the selection to highlight the found word
    } else {
      // Word not in list or already found, clear selection
      setSelectedCells([]);
      setCurrentWord('');
    }
  };
  
  // Reset game
  const resetGame = () => {
    setWords(gameData.words.map(word => ({ ...word, found: false })));
    setSelectedCells([]);
    setCurrentWord('');
    setShowHint(false);
    setHintWord('');
    
    toast({
      title: "Game Reset",
      description: "The word search has been reset. Good luck!",
      duration: 2000,
    });
  };
  
  // Show a hint
  const showWordHint = () => {
    const unfoundWords = words.filter(word => !word.found);
    if (unfoundWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * unfoundWords.length);
      setHintWord(unfoundWords[randomIndex].word);
      setShowHint(true);
      
      toast({
        title: "Hint Activated",
        description: `Look for the word: ${unfoundWords[randomIndex].word}`,
        duration: 3000,
      });
    } else {
      toast({
        title: "No Hints Available",
        description: "You've already found all the words!",
        duration: 2000,
      });
    }
  };
  
  // Check if a cell is in the selected cells array
  const isCellSelected = (rowIndex: number, colIndex: number) => {
    return selectedCells.some(cell => cell[0] === rowIndex && cell[1] === colIndex);
  };
  
  // Check if a cell is part of a found word
  const isCellFoundWord = (rowIndex: number, colIndex: number) => {
    // This is simplified - in a real game you'd need to track which cells belong to which found words
    return false;
  };
  
  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <Link to="/games">
            <Button variant="outline" size="icon" className="mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Islamic Word Search</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="mb-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="text-lg font-bold">Progress:</div>
                  <div className="w-48 h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-islamic-primary rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {words.filter(w => w.found).length}/{words.length}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={showWordHint}>
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Hint
                  </Button>
                  <Button variant="outline" size="sm" onClick={resetGame}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
              
              <div 
                className="grid grid-cols-10 gap-1 max-w-[500px] mx-auto select-none"
                onMouseLeave={() => {
                  if (isSelecting) {
                    setIsSelecting(false);
                    handleMouseUp();
                  }
                }}
              >
                {grid.map((row, rowIndex) => (
                  <React.Fragment key={rowIndex}>
                    {row.map((cell, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`w-10 h-10 rounded flex items-center justify-center font-bold text-lg cursor-pointer transition-all
                          ${isCellSelected(rowIndex, colIndex) ? 'bg-islamic-primary text-white' : 'bg-card hover:bg-muted'}
                          ${isCellFoundWord(rowIndex, colIndex) ? 'ring-2 ring-islamic-gold' : ''}
                          ${showHint && cell === hintWord[0] ? 'animate-pulse bg-islamic-gold/20' : ''}
                        `}
                        onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                        onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                        onMouseUp={handleMouseUp}
                      >
                        {cell}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
              
              {showHint && (
                <div className="mt-4 p-3 bg-islamic-gold/10 border border-islamic-gold/30 rounded-lg text-center">
                  <p className="text-sm font-medium">Hint: Look for the word "{hintWord}"</p>
                </div>
              )}
            </Card>
          </div>
          
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Words to Find</h2>
              <div className="space-y-3">
                {words.map((word, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between p-2 rounded-lg transition-colors
                      ${word.found ? 'bg-islamic-primary/10 border border-islamic-primary/30' : 'bg-card'}
                    `}
                  >
                    <div className="flex items-center">
                      {word.found && <Check className="h-4 w-4 text-islamic-primary mr-2" />}
                      <span className={word.found ? 'line-through text-islamic-primary font-medium' : ''}>
                        {word.word}
                      </span>
                    </div>
                    <Badge variant={word.found ? "outline" : "secondary"}>
                      {word.found ? "Found" : "Find Me"}
                    </Badge>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-bold mb-2">Game Instructions:</h3>
                <ol className="space-y-2 text-sm text-muted-foreground list-decimal pl-5">
                  <li>Find the Islamic words hidden in the grid.</li>
                  <li>Words can appear horizontally, vertically, or diagonally.</li>
                  <li>Click and drag to select the words.</li>
                  <li>Use the hint button if you're stuck.</li>
                </ol>
              </div>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WordSearch;
