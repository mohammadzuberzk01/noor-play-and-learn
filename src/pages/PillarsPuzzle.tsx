import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Puzzle, Award, Clock } from 'lucide-react';

interface PuzzlePiece {
  id: number;
  pillar: string;
  description: string;
  position: number;
  correctPosition: number;
  isCorrect?: boolean;
}

const PillarsPuzzle = () => {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [droppedPieces, setDroppedPieces] = useState<PuzzlePiece[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  const [draggedPiece, setDraggedPiece] = useState<PuzzlePiece | null>(null);
  const [currentDifficulty, setCurrentDifficulty] = useState('easy');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const puzzleData: PuzzlePiece[] = [
    {
      id: 1,
      pillar: "Shahada",
      description: "Declaration of faith: 'There is no god but Allah, and Muhammad is the messenger of Allah'",
      position: 1,
      correctPosition: 1
    },
    {
      id: 2,
      pillar: "Salah",
      description: "Prayer five times a day facing the Kaaba in Mecca",
      position: 2,
      correctPosition: 2
    },
    {
      id: 3,
      pillar: "Zakat",
      description: "Giving a fixed portion of one's wealth to charity and the needy",
      position: 3,
      correctPosition: 3
    },
    {
      id: 4,
      pillar: "Sawm",
      description: "Fasting during the month of Ramadan from dawn until sunset",
      position: 4,
      correctPosition: 4
    },
    {
      id: 5,
      pillar: "Hajj",
      description: "Pilgrimage to Mecca at least once in a lifetime for those who are able",
      position: 5,
      correctPosition: 5
    }
  ];
  
  const generatePuzzle = (level: string) => {
    console.log(`Generating puzzle with difficulty: ${level}`);
    const shuffled = [...puzzleData]
      .sort(() => Math.random() - 0.5)
      .map((piece, index) => ({ ...piece, position: index + 1 }));
    
    setPieces(shuffled);
    setDroppedPieces([]);
    setIsComplete(false);
    setTimeTaken(0);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimeTaken(prev => prev + 1);
    }, 1000);
  };
  
  useEffect(() => {
    if (isPlaying) {
      generatePuzzle(currentDifficulty);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, currentDifficulty]);
  
  useEffect(() => {
    if (droppedPieces.length === puzzleData.length) {
      const isCorrect = droppedPieces.every(piece => 
        droppedPieces.findIndex(p => p.id === piece.id) + 1 === piece.correctPosition
      );
      
      if (isCorrect) {
        setIsComplete(true);
        setIsPlaying(false);
        
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        
        toast({
          title: "Puzzle Complete!",
          description: `Well done! You completed the ${currentDifficulty} puzzle.`,
          variant: "default"
        });
      } else {
        setDroppedPieces(prev => 
          prev.map((piece, index) => ({
            ...piece,
            isCorrect: index + 1 === piece.correctPosition
          }))
        );
        
        toast({
          title: "Not Quite Right",
          description: "Some pieces are in the wrong position. Look at the green and red indicators.",
          variant: "destructive"
        });
      }
    }
  }, [droppedPieces, timeTaken]);
  
  const handleDragStart = (piece: PuzzlePiece) => {
    setDraggedPiece(piece);
  };
  
  const handleDragEnd = () => {
    setDraggedPiece(null);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedPiece) {
      setDroppedPieces(prev => [...prev, draggedPiece]);
      setPieces(prev => prev.filter(p => p.id !== draggedPiece.id));
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handlePieceClick = (piece: PuzzlePiece) => {
    if (pieces.includes(piece)) {
      setDroppedPieces(prev => [...prev, piece]);
      setPieces(prev => prev.filter(p => p.id !== piece.id));
    }
  };
  
  const resetPuzzle = () => {
    const allPieces = [...pieces, ...droppedPieces];
    const shuffled = allPieces
      .sort(() => Math.random() - 0.5)
      .map((piece, index) => ({ ...piece, position: index + 1, isCorrect: undefined }));
    
    setPieces(shuffled);
    setDroppedPieces([]);
  };
  
  const startGame = () => {
    setIsPlaying(true);
  };
  
  const restartGame = () => {
    setIsPlaying(true);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Puzzle the Pillars</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Arrange the five pillars of Islam in the correct order
          </p>
        </div>
        
        {!isPlaying && !isComplete ? (
          <div className="max-w-lg mx-auto text-center p-8 bg-card rounded-lg shadow-md">
            <Puzzle className="h-16 w-16 mx-auto mb-4 text-islamic-primary" />
            <h2 className="text-2xl font-bold mb-4">Five Pillars Puzzle Challenge</h2>
            <p className="mb-6">Arrange the five pillars of Islam in the correct order. Learn about the fundamental practices that form the foundation of Islamic life.</p>
            <Button size="lg" onClick={startGame}>
              Start Puzzle
            </Button>
          </div>
        ) : isComplete ? (
          <div className="max-w-lg mx-auto text-center p-8 bg-card rounded-lg shadow-md">
            <Award className="h-16 w-16 mx-auto mb-4 text-islamic-primary" />
            <h2 className="text-2xl font-bold mb-4">Puzzle Complete!</h2>
            <p className="text-xl mb-6">You completed the puzzle in {formatTime(timeTaken)}!</p>
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold">The Five Pillars of Islam</h3>
              {puzzleData.map(piece => (
                <div key={piece.id} className="bg-muted p-3 rounded-md text-left">
                  <p className="font-bold">{piece.correctPosition}. {piece.pillar}</p>
                  <p className="text-sm text-muted-foreground">{piece.description}</p>
                </div>
              ))}
            </div>
            <Button size="lg" onClick={restartGame}>
              Play Again
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <Badge variant="outline" className="text-lg px-4 py-2">
                Pieces Placed: {droppedPieces.length}/{puzzleData.length}
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>Time: {formatTime(timeTaken)}</span>
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Arrange the Pillars</h2>
                <Card 
                  className="min-h-[400px] p-4 flex flex-col gap-3 border-2 border-dashed border-islamic-primary/30"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  {droppedPieces.length === 0 ? (
                    <p className="text-center text-muted-foreground my-auto">Drag the pillars here in the correct order</p>
                  ) : (
                    droppedPieces.map((piece, index) => (
                      <div 
                        key={piece.id}
                        className={`p-4 rounded-lg ${
                          piece.isCorrect === undefined ? 'bg-card border border-islamic-primary/50' :
                          piece.isCorrect ? 'bg-green-100 border border-green-500' :
                          'bg-red-100 border border-red-500'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-islamic-primary text-white flex items-center justify-center">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">{piece.pillar}</h3>
                            <p className="text-sm text-muted-foreground">{piece.description}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </Card>
                
                {droppedPieces.length > 0 && (
                  <div className="text-center mt-4">
                    <Button variant="outline" onClick={resetPuzzle}>
                      Reset Puzzle
                    </Button>
                  </div>
                )}
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-4">Pillar Pieces</h2>
                <div className="space-y-3">
                  {pieces.map(piece => (
                    <Card 
                      key={piece.id}
                      className="p-4 cursor-move bg-card hover:shadow-md transition-shadow"
                      draggable
                      onDragStart={() => handleDragStart(piece)}
                      onDragEnd={handleDragEnd}
                      onClick={() => handlePieceClick(piece)}
                    >
                      <h3 className="text-xl font-bold">{piece.pillar}</h3>
                      <p className="text-sm text-muted-foreground">{piece.description}</p>
                    </Card>
                  ))}
                  
                  {pieces.length === 0 && (
                    <p className="text-center text-muted-foreground p-8">All pieces have been placed on the board</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        
        <div className="mt-8 bg-muted p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">The Five Pillars of Islam</h3>
          <p className="text-muted-foreground mb-4">
            The five pillars of Islam are the foundation of Muslim life. They are the testimony of faith, prayer, giving zakat (support of the needy), fasting during the month of Ramadan, and the pilgrimage to Mecca once in a lifetime for those who are able.
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Drag the pillar pieces to the board on the left</li>
            <li>Arrange them in the correct order (1st to 5th pillar)</li>
            <li>Green highlighting indicates correct placement</li>
            <li>Red highlighting indicates incorrect placement</li>
          </ul>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PillarsPuzzle;
