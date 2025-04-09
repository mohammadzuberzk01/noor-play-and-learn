
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Search, Book, Check } from 'lucide-react';

interface WordData {
  id: number;
  word: string;
  meaning: string;
  root: string;
  example: string;
}

const WordHunt = () => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [gridSize, setGridSize] = useState(8);
  const [words, setWords] = useState<WordData[]>([]);
  const [foundWords, setFoundWords] = useState<number[]>([]);
  const [selectedCells, setSelectedCells] = useState<number[][]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [wordToLearn, setWordToLearn] = useState<WordData | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Sample Qur'anic words data
  const quranicWords: WordData[] = [
    {
      id: 1,
      word: "كتاب",
      meaning: "Book",
      root: "ك-ت-ب",
      example: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ"
    },
    {
      id: 2,
      word: "علم",
      meaning: "Knowledge",
      root: "ع-ل-م",
      example: "وَعَلَّمَ آدَمَ الْأَسْمَاءَ كُلَّهَا"
    },
    {
      id: 3,
      word: "رحمة",
      meaning: "Mercy",
      root: "ر-ح-م",
      example: "وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ"
    },
    {
      id: 4,
      word: "نور",
      meaning: "Light",
      root: "ن-و-ر",
      example: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ"
    },
    {
      id: 5,
      word: "هدى",
      meaning: "Guidance",
      root: "ه-د-ي",
      example: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ"
    },
    {
      id: 6,
      word: "صلاة",
      meaning: "Prayer",
      root: "ص-ل-و",
      example: "وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ"
    }
  ];

  // Generate random Arabic letters for filling the grid
  const generateRandomLetter = () => {
    const arabicLetters = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي';
    return arabicLetters.charAt(Math.floor(Math.random() * arabicLetters.length));
  };

  // Initialize or create a new grid
  const createGrid = () => {
    // Select a subset of words for the current level
    const levelWords = quranicWords
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(3 + level, quranicWords.length));
    
    setWords(levelWords);
    
    // Create empty grid
    const newGrid = Array(gridSize).fill(null).map(() => 
      Array(gridSize).fill('').map(() => generateRandomLetter())
    );
    
    // Place words in the grid
    levelWords.forEach(wordData => {
      const word = wordData.word;
      const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
      let placed = false;
      
      while (!placed) {
        if (direction === 'horizontal') {
          const row = Math.floor(Math.random() * gridSize);
          const col = Math.floor(Math.random() * (gridSize - word.length + 1));
          
          let canPlace = true;
          for (let i = 0; i < word.length; i++) {
            if (newGrid[row][col + i] !== '' && newGrid[row][col + i] !== word[i]) {
              canPlace = false;
              break;
            }
          }
          
          if (canPlace) {
            for (let i = 0; i < word.length; i++) {
              newGrid[row][col + i] = word[i];
            }
            placed = true;
          }
        } else {
          const row = Math.floor(Math.random() * (gridSize - word.length + 1));
          const col = Math.floor(Math.random() * gridSize);
          
          let canPlace = true;
          for (let i = 0; i < word.length; i++) {
            if (newGrid[row + i][col] !== '' && newGrid[row + i][col] !== word[i]) {
              canPlace = false;
              break;
            }
          }
          
          if (canPlace) {
            for (let i = 0; i < word.length; i++) {
              newGrid[row + i][col] = word[i];
            }
            placed = true;
          }
        }
        
        // Fallback if stuck in loop
        if (!placed && Math.random() > 0.9) {
          placed = true; // Try again with new random position
        }
      }
    });
    
    setGrid(newGrid);
    setFoundWords([]);
    setSelectedCells([]);
  };

  // Initialize game
  useEffect(() => {
    createGrid();
  }, [level]);

  // Check if current selection forms a valid word
  const checkSelection = () => {
    const selectedWord = currentWord;
    
    const foundWord = words.find(w => 
      w.word === selectedWord && !foundWords.includes(w.id)
    );
    
    if (foundWord) {
      setFoundWords([...foundWords, foundWord.id]);
      setScore(score + (selectedWord.length * 10));
      setWordToLearn(foundWord);
      setShowDetails(true);
      
      toast({
        title: "Word found!",
        description: `${foundWord.word} - ${foundWord.meaning}`,
        variant: "default"
      });
      
      // Check if all words are found
      if (foundWords.length + 1 >= words.length) {
        setTimeout(() => {
          toast({
            title: "Level Complete!",
            description: `Moving to level ${level + 1}`,
            variant: "default"
          });
          setLevel(level + 1);
        }, 1500);
      }
    } else {
      toast({
        title: "Not a valid word",
        description: "Try again!",
        variant: "destructive"
      });
    }
    
    setSelectedCells([]);
    setCurrentWord('');
  };

  // Cell selection handlers
  const handleCellMouseDown = (row: number, col: number) => {
    setIsSelecting(true);
    setSelectedCells([[row, col]]);
    setCurrentWord(grid[row][col]);
  };
  
  const handleCellMouseOver = (row: number, col: number) => {
    if (isSelecting) {
      // Check if cell is adjacent to the last selected cell
      const lastCell = selectedCells[selectedCells.length - 1];
      const isAdjacent = 
        (Math.abs(lastCell[0] - row) <= 1 && Math.abs(lastCell[1] - col) <= 1) &&
        !selectedCells.some(cell => cell[0] === row && cell[1] === col);
      
      if (isAdjacent) {
        setSelectedCells([...selectedCells, [row, col]]);
        setCurrentWord(currentWord + grid[row][col]);
      }
    }
  };
  
  const handleCellMouseUp = () => {
    setIsSelecting(false);
    if (currentWord.length >= 2) {
      checkSelection();
    } else {
      setSelectedCells([]);
      setCurrentWord('');
    }
  };
  
  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some(cell => cell[0] === row && cell[1] === col);
  };
  
  const getCellClassName = (row: number, col: number) => {
    const isSelected = isCellSelected(row, col);
    const foundWordContainsCell = foundWords.some(wordId => {
      const word = words.find(w => w.id === wordId);
      return word && word.word.includes(grid[row][col]);
    });
    
    return `w-9 h-9 flex items-center justify-center text-lg font-bold cursor-pointer select-none ${
      isSelected ? 'bg-islamic-primary text-white' : 
      foundWordContainsCell ? 'bg-green-100 text-green-800' : 'bg-white'
    }`;
  };

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Word Hunt: Qur'an Edition</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find hidden Arabic words from the Qur'an in the puzzle grid.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-3/5">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <Badge variant="outline" className="px-3 py-1 text-base">
                  Level: {level}
                </Badge>
                <Badge variant="outline" className="px-3 py-1 text-base">
                  Score: {score}
                </Badge>
              </div>
              
              <div 
                className="grid gap-1 mx-auto w-fit" 
                style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
                onMouseLeave={() => {
                  if (isSelecting) {
                    setIsSelecting(false);
                    if (currentWord.length >= 2) {
                      checkSelection();
                    } else {
                      setSelectedCells([]);
                      setCurrentWord('');
                    }
                  }
                }}
              >
                {grid.map((row, rowIndex) => (
                  row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={getCellClassName(rowIndex, colIndex)}
                      onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                      onMouseOver={() => handleCellMouseOver(rowIndex, colIndex)}
                      onMouseUp={handleCellMouseUp}
                    >
                      {cell}
                    </div>
                  ))
                ))}
              </div>
              
              {currentWord && (
                <div className="mt-4 text-center">
                  <p className="text-lg font-bold">{currentWord}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="md:w-2/5">
            <Card className="p-4 mb-4">
              <h2 className="text-xl font-bold mb-3 flex items-center">
                <Search className="mr-2 h-5 w-5" />
                Words to Find ({foundWords.length}/{words.length})
              </h2>
              <div className="space-y-2">
                {words.map((word) => (
                  <div 
                    key={word.id} 
                    className={`p-2 rounded-md flex justify-between items-center ${
                      foundWords.includes(word.id) 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-muted'
                    }`}
                  >
                    <span className="font-bold text-lg">{word.word}</span>
                    {foundWords.includes(word.id) && (
                      <Check className="h-5 w-5" />
                    )}
                  </div>
                ))}
              </div>
            </Card>
            
            {wordToLearn && showDetails && (
              <Card className="p-4 animate-fade-in">
                <h2 className="text-xl font-bold mb-3 flex items-center">
                  <Book className="mr-2 h-5 w-5" />
                  Word Details
                </h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-muted-foreground">Word</h3>
                    <p className="text-2xl font-bold">{wordToLearn.word}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground">Meaning</h3>
                    <p className="text-lg">{wordToLearn.meaning}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground">Root</h3>
                    <p className="text-lg">{wordToLearn.root}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground">Example from Qur'an</h3>
                    <p className="text-lg text-right mb-1">{wordToLearn.example}</p>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => setShowDetails(false)}
                  >
                    Continue Playing
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => createGrid()}>
            New Grid
          </Button>
        </div>
        
        <div className="mt-8 bg-muted p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">How to Play</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Find the hidden Arabic words in the grid</li>
            <li>Click and drag to select connected letters</li>
            <li>Learn the meanings and examples of each word you find</li>
            <li>Find all words to advance to the next level</li>
          </ul>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WordHunt;
