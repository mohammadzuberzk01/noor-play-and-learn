
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Users, Award, Clock } from 'lucide-react';

interface MatchCard {
  id: number;
  prophet: string;
  miracle: string;
  matched: boolean;
  selected: boolean;
  type: 'prophet' | 'miracle';
}

const ProphetMatch = () => {
  const [cards, setCards] = useState<MatchCard[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [firstCard, setFirstCard] = useState<MatchCard | null>(null);
  const [secondCard, setSecondCard] = useState<MatchCard | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  // Prophet and miracle pairs
  const prophetMiraclePairs = [
    { prophet: "Muhammad (ﷺ)", miracle: "The Holy Quran" },
    { prophet: "Musa (Moses)", miracle: "Staff turning into a serpent" },
    { prophet: "Isa (Jesus)", miracle: "Healing the sick and raising the dead" },
    { prophet: "Ibrahim (Abraham)", miracle: "Surviving the fire" },
    { prophet: "Nuh (Noah)", miracle: "The Ark and the flood" },
    { prophet: "Sulaiman (Solomon)", miracle: "Control over the jinns and animals" },
    { prophet: "Yusuf (Joseph)", miracle: "Interpreting dreams" },
    { prophet: "Yunus (Jonah)", miracle: "Surviving inside the whale" }
  ];
  
  // Create and shuffle cards when game starts
  useEffect(() => {
    if (isPlaying) {
      // Create card pairs
      const cardPairs = prophetMiraclePairs.map((pair, index) => [
        {
          id: index * 2,
          prophet: pair.prophet,
          miracle: pair.miracle,
          matched: false,
          selected: false,
          type: 'prophet' as const
        },
        {
          id: index * 2 + 1,
          prophet: pair.prophet,
          miracle: pair.miracle,
          matched: false,
          selected: false,
          type: 'miracle' as const
        }
      ]).flat();
      
      // Shuffle cards
      const shuffledCards = [...cardPairs].sort(() => Math.random() - 0.5);
      setCards(shuffledCards);
      setMatchedPairs(0);
      setMoves(0);
      setFirstCard(null);
      setSecondCard(null);
      setGameComplete(false);
      setTimeElapsed(0);
    }
  }, [isPlaying]);
  
  // Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && !gameComplete) {
      timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, gameComplete]);
  
  // Check for matches
  useEffect(() => {
    if (firstCard && secondCard) {
      // Increment moves
      setMoves(moves + 1);
      
      // Check if cards match
      if (firstCard.prophet === secondCard.prophet) {
        // Match found
        setCards(prevCards => 
          prevCards.map(card => 
            (card.id === firstCard.id || card.id === secondCard.id)
              ? { ...card, matched: true, selected: false }
              : card
          )
        );
        
        setMatchedPairs(prev => {
          const newMatchedPairs = prev + 1;
          // Check if game is complete
          if (newMatchedPairs === prophetMiraclePairs.length) {
            setGameComplete(true);
            setIsPlaying(false);
            toast({
              title: "Game Complete!",
              description: `You found all matches in ${moves + 1} moves and ${timeElapsed} seconds!`,
              variant: "success"
            });
          }
          return newMatchedPairs;
        });
        
        // Reset selected cards
        setFirstCard(null);
        setSecondCard(null);
      } else {
        // No match, flip cards back after delay
        setTimeout(() => {
          setCards(prevCards => 
            prevCards.map(card => 
              (card.id === firstCard.id || card.id === secondCard.id)
                ? { ...card, selected: false }
                : card
            )
          );
          setFirstCard(null);
          setSecondCard(null);
        }, 1000);
      }
    }
  }, [firstCard, secondCard, moves, timeElapsed]);
  
  const handleCardClick = (clickedCard: MatchCard) => {
    // Ignore clicks if card is already matched or selected, or if two cards are already flipped
    if (clickedCard.matched || clickedCard.selected || (firstCard && secondCard)) {
      return;
    }
    
    // Flip the card
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === clickedCard.id ? { ...card, selected: true } : card
      )
    );
    
    // Set as first or second selected card
    if (!firstCard) {
      setFirstCard(clickedCard);
    } else {
      setSecondCard(clickedCard);
    }
  };
  
  const startGame = () => {
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
          <h1 className="text-4xl font-bold mb-2">Memory Match: Prophets</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Match prophets with their miracles in this memory game
          </p>
        </div>
        
        {!isPlaying && !gameComplete ? (
          <div className="max-w-lg mx-auto text-center p-8 bg-card rounded-lg shadow-md">
            <Users className="h-16 w-16 mx-auto mb-4 text-islamic-primary" />
            <h2 className="text-2xl font-bold mb-4">Prophet & Miracle Memory Game</h2>
            <p className="mb-6">Test your memory while learning about the prophets mentioned in the Quran and their miracles. Match each prophet with their corresponding miracle.</p>
            <Button size="lg" onClick={startGame}>
              Start Game
            </Button>
          </div>
        ) : gameComplete ? (
          <div className="max-w-lg mx-auto text-center p-8 bg-card rounded-lg shadow-md">
            <Award className="h-16 w-16 mx-auto mb-4 text-islamic-primary" />
            <h2 className="text-2xl font-bold mb-4">Game Complete!</h2>
            <div className="space-y-2 mb-6">
              <p className="text-lg">You found all matches!</p>
              <p className="font-medium">Moves: {moves}</p>
              <p className="font-medium">Time: {formatTime(timeElapsed)}</p>
            </div>
            <Button size="lg" onClick={startGame}>
              Play Again
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  Matches: {matchedPairs}/{prophetMiraclePairs.length}
                </Badge>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  Moves: {moves}
                </Badge>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{formatTime(timeElapsed)}</span>
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {cards.map(card => (
                <Card 
                  key={card.id}
                  className={`h-32 md:h-40 flex items-center justify-center cursor-pointer transition-all ${
                    card.matched ? 'bg-green-100 border-green-500' : 
                    card.selected ? 'bg-islamic-primary/10 border-islamic-primary' : 
                    'hover:border-islamic-primary'
                  }`}
                  onClick={() => handleCardClick(card)}
                >
                  <div className="text-center p-2">
                    {card.selected || card.matched ? (
                      <>
                        <Badge className="mb-2">{card.type}</Badge>
                        <p className="font-medium text-sm md:text-base">
                          {card.type === 'prophet' ? card.prophet : card.miracle}
                        </p>
                      </>
                    ) : (
                      <span className="text-3xl text-islamic-primary">?</span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
        
        <div className="mt-8 bg-muted p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">How to Play</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Click on cards to flip them over</li>
            <li>Match each prophet with their corresponding miracle</li>
            <li>Find all the pairs to complete the game</li>
            <li>Try to finish in as few moves as possible</li>
          </ul>
        </div>
        
        <div className="mt-4 bg-muted p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Learn About the Prophets</h3>
          <p className="text-muted-foreground mb-2">The Quran mentions many prophets who were sent by Allah with divine guidance and miracles as signs of their prophethood.</p>
          <p className="text-muted-foreground">Each prophet had specific miracles that served as evidence of their truthfulness and divine connection.</p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProphetMatch;
