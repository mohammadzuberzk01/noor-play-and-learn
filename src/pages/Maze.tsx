
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const CELL_SIZE = 40;
const GRID_ROWS = 10;
const GRID_COLS = 10;

interface Position {
  row: number;
  col: number;
}

interface MazeCell {
  isWall: boolean;
  isVisited: boolean;
  isPath: boolean;
}

const Maze = () => {
  const [maze, setMaze] = useState<MazeCell[][]>([]);
  const [playerPosition, setPlayerPosition] = useState<Position>({ row: 0, col: 0 });
  const [targetPosition, setTargetPosition] = useState<Position>({ row: GRID_ROWS - 1, col: GRID_COLS - 1 });
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [movesCount, setMovesCount] = useState(0);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (gameStarted) {
      generateMaze();
    }
  }, [gameStarted, difficulty]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted || isGameComplete) return;
      
      let newRow = playerPosition.row;
      let newCol = playerPosition.col;
      
      switch (e.key) {
        case 'ArrowUp':
          newRow = Math.max(0, newRow - 1);
          break;
        case 'ArrowDown':
          newRow = Math.min(GRID_ROWS - 1, newRow + 1);
          break;
        case 'ArrowLeft':
          newCol = Math.max(0, newCol - 1);
          break;
        case 'ArrowRight':
          newCol = Math.min(GRID_COLS - 1, newCol + 1);
          break;
        default:
          return;
      }
      
      movePlayer(newRow, newCol);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [playerPosition, gameStarted, isGameComplete]);

  const generateMaze = () => {
    // Initialize grid with walls
    const newMaze: MazeCell[][] = Array(GRID_ROWS).fill(null).map(() => 
      Array(GRID_COLS).fill(null).map(() => ({
        isWall: true,
        isVisited: false,
        isPath: false
      }))
    );
    
    // Start position is always open
    newMaze[0][0] = { isWall: false, isVisited: true, isPath: false };
    
    // Target position is always open
    newMaze[GRID_ROWS - 1][GRID_COLS - 1] = { isWall: false, isVisited: false, isPath: false };
    
    // Generate maze using Depth-First Search
    generatePath(newMaze, 0, 0);
    
    // Add some randomness based on difficulty
    addRandomOpenings(newMaze, difficulty);
    
    setMaze(newMaze);
    setPlayerPosition({ row: 0, col: 0 });
    setTargetPosition({ row: GRID_ROWS - 1, col: GRID_COLS - 1 });
    setIsGameComplete(false);
    setMovesCount(0);
  };

  const generatePath = (grid: MazeCell[][], row: number, col: number) => {
    // Directions: up, right, down, left
    const directions = [
      { row: -2, col: 0 },
      { row: 0, col: 2 },
      { row: 2, col: 0 },
      { row: 0, col: -2 },
    ];
    
    // Shuffle directions randomly
    for (let i = directions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [directions[i], directions[j]] = [directions[j], directions[i]];
    }
    
    // Try each direction
    for (const dir of directions) {
      const newRow = row + dir.row;
      const newCol = col + dir.col;
      
      // Check if new position is valid
      if (newRow >= 0 && newRow < GRID_ROWS && newCol >= 0 && newCol < GRID_COLS && grid[newRow][newCol].isWall) {
        // Mark the cell in between as a path
        grid[row + dir.row / 2][col + dir.col / 2] = { isWall: false, isVisited: true, isPath: false };
        
        // Mark the new cell as a path
        grid[newRow][newCol] = { isWall: false, isVisited: true, isPath: false };
        
        // Continue generating path from new position
        generatePath(grid, newRow, newCol);
      }
    }
  };

  const addRandomOpenings = (grid: MazeCell[][], difficulty: string) => {
    let openingCount;
    
    switch (difficulty) {
      case 'easy':
        openingCount = Math.floor(GRID_ROWS * GRID_COLS * 0.2); // 20% of cells
        break;
      case 'medium':
        openingCount = Math.floor(GRID_ROWS * GRID_COLS * 0.1); // 10% of cells
        break;
      case 'hard':
        openingCount = Math.floor(GRID_ROWS * GRID_COLS * 0.05); // 5% of cells
        break;
      default:
        openingCount = 0;
    }
    
    for (let i = 0; i < openingCount; i++) {
      const row = Math.floor(Math.random() * GRID_ROWS);
      const col = Math.floor(Math.random() * GRID_COLS);
      
      // Don't modify start or end positions
      if ((row === 0 && col === 0) || (row === GRID_ROWS - 1 && col === GRID_COLS - 1)) {
        continue;
      }
      
      grid[row][col] = { isWall: false, isVisited: false, isPath: false };
    }
  };

  const movePlayer = (newRow: number, newCol: number) => {
    // Check if the new position is a wall
    if (maze[newRow][newCol].isWall) {
      return;
    }
    
    // Update player position
    setPlayerPosition({ row: newRow, col: newCol });
    setMovesCount(prevMoves => prevMoves + 1);
    
    // Check if player reached the target
    if (newRow === targetPosition.row && newCol === targetPosition.col) {
      handleGameComplete();
    }
  };

  const handleGameComplete = () => {
    setIsGameComplete(true);
    toast.success('Congratulations! You found the Masjid!');
  };

  const handleCellClick = (row: number, col: number) => {
    if (!gameStarted || isGameComplete) return;
    
    // Check if the clicked cell is adjacent to the player
    const isAdjacent = (
      (Math.abs(row - playerPosition.row) === 1 && col === playerPosition.col) ||
      (Math.abs(col - playerPosition.col) === 1 && row === playerPosition.row)
    );
    
    if (isAdjacent) {
      movePlayer(row, col);
    }
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const restartGame = () => {
    generateMaze();
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Masjid Maze</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            Navigate through the maze to find the path to the Masjid. Use arrow keys or click adjacent cells to move.
          </p>
          
          {!gameStarted ? (
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Select Difficulty</h2>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <Badge 
                  variant="outline" 
                  className={`cursor-pointer px-4 py-2 ${difficulty === 'easy' ? getDifficultyColor('easy') : ''}`}
                  onClick={() => setDifficulty('easy')}
                >
                  Easy
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`cursor-pointer px-4 py-2 ${difficulty === 'medium' ? getDifficultyColor('medium') : ''}`}
                  onClick={() => setDifficulty('medium')}
                >
                  Medium
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`cursor-pointer px-4 py-2 ${difficulty === 'hard' ? getDifficultyColor('hard') : ''}`}
                  onClick={() => setDifficulty('hard')}
                >
                  Hard
                </Badge>
              </div>
              <Button onClick={startGame} className="w-full">
                Start Maze
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <Badge variant="outline" className="px-4 py-2">
                Moves: {movesCount}
              </Badge>
              <Badge 
                variant="outline" 
                className={getDifficultyColor(difficulty)}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </Badge>
              <Button onClick={restartGame} variant="outline">
                New Maze
              </Button>
            </div>
          )}
        </div>
        
        {gameStarted && (
          <div className="flex justify-center mb-8">
            <div 
              className="grid gap-0.5 bg-gray-200 p-1 rounded shadow-md"
              style={{ 
                gridTemplateRows: `repeat(${GRID_ROWS}, ${CELL_SIZE}px)`, 
                gridTemplateColumns: `repeat(${GRID_COLS}, ${CELL_SIZE}px)` 
              }}
            >
              {maze.map((row, rowIndex) => (
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`${
                      cell.isWall ? 'bg-gray-800' : 'bg-white hover:bg-gray-100 cursor-pointer'
                    } flex items-center justify-center transition-colors`}
                    style={{ width: CELL_SIZE, height: CELL_SIZE }}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    {rowIndex === playerPosition.row && colIndex === playerPosition.col && (
                      <div className="w-3/4 h-3/4 rounded-full bg-islamic-primary animate-pulse" />
                    )}
                    {rowIndex === targetPosition.row && colIndex === targetPosition.col && (
                      <div className="w-3/4 h-3/4 bg-islamic-gold">
                        {/* Simple mosque icon */}
                        <div className="w-full h-2/3 flex items-end justify-center">
                          <div className="w-1/2 h-full rounded-t-full bg-islamic-secondary"></div>
                        </div>
                        <div className="w-full h-1/3 bg-islamic-secondary"></div>
                      </div>
                    )}
                  </div>
                ))
              ))}
            </div>
          </div>
        )}
        
        {isGameComplete && (
          <div className="text-center mt-8">
            <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
            <p className="text-lg mb-6">You found the path to the Masjid in {movesCount} moves!</p>
            <Button onClick={restartGame}>
              Play Again
            </Button>
          </div>
        )}
        
        {gameStarted && (
          <div className="max-w-lg mx-auto text-center mt-6">
            <h3 className="text-lg font-medium mb-2">How to Play:</h3>
            <ul className="text-sm text-muted-foreground list-disc list-inside">
              <li>Use arrow keys on your keyboard to move</li>
              <li>Or click on adjacent cells to move</li>
              <li>Find the path to reach the Masjid (golden building)</li>
              <li>Dark cells are walls and cannot be passed through</li>
            </ul>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Maze;
