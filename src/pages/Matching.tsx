
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Shuffle } from 'lucide-react';

interface Card {
  id: number;
  type: 'term' | 'definition';
  content: string;
  matchId: number;
  isFlipped: boolean;
  isMatched: boolean;
}

const Matching = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const islamicTerms = [
    { term: 'Salah', definition: 'The ritual prayer performed five times daily' },
    { term: 'Zakat', definition: 'Obligatory charity that constitutes one of the Five Pillars of Islam' },
    { term: 'Sawm', definition: 'Fasting during the month of Ramadan' },
    { term: 'Hajj', definition: 'The pilgrimage to Mecca that Muslims must make at least once in their lifetime' },
    { term: 'Shahada', definition: 'The declaration of faith in Islam' },
    { term: 'Tawhid', definition: 'The concept of monotheism in Islam' },
    { term: 'Eid al-Fitr', definition: 'The festival marking the end of Ramadan' },
    { term: 'Eid al-Adha', definition: 'The festival of sacrifice that marks the end of Hajj' }
  ];

  useEffect(() => {
    if (gameStarted) {
      initializeGame();
    }
  }, [gameStarted]);

  useEffect(() => {
    // Check if two cards are flipped
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      
      // Check if the cards match
      if (first.matchId === second.matchId && first.type !== second.type) {
        // Cards match
        setCards(prev => 
          prev.map(card => 
            card.id === first.id || card.id === second.id 
              ? { ...card, isMatched: true } 
              : card
          )
        );
        setMatchedPairs(prev => prev + 1);
        toast.success('Match found!');
      } else {
        // Cards don't match, flip them back after a delay
        setTimeout(() => {
          setCards(prev => 
            prev.map(card => 
              card.id === first.id || card.id === second.id 
                ? { ...card, isFlipped: false } 
                : card
            )
          );
        }, 1000);
      }
      
      // Increment moves
      setMoves(prev => prev + 1);
      
      // Reset flipped cards
      setTimeout(() => {
        setFlippedCards([]);
      }, 1000);
    }
  }, [flippedCards]);

  useEffect(() => {
    // Check if game is complete
    if (matchedPairs === islamicTerms.length && gameStarted) {
      setGameComplete(true);
      toast.success('Congratulations! You completed the matching game!');
    }
  }, [matchedPairs, gameStarted]);

  const initializeGame = () => {
    // Create cards from terms and definitions
    let newCards: Card[] = [];
    let id = 0;
    
    islamicTerms.forEach((item, index) => {
      // Term card
      newCards.push({
        id: id++,
        type: 'term',
        content: item.term,
        matchId: index,
        isFlipped: false,
        isMatched: false
      });
      
      // Definition card
      newCards.push({
        id: id++,
        type: 'definition',
        content: item.definition,
        matchId: index,
        isFlipped: false,
        isMatched: false
      });
    });
    
    // Shuffle cards
    newCards = shuffleCards(newCards);
    
    setCards(newCards);
    setFlippedCards([]);
    setMoves(0);
    setMatchedPairs(0);
    setGameComplete(false);
  };

  const shuffleCards = (cardsArray: Card[]) => {
    const shuffled = [...cardsArray];
    
    // Fisher-Yates shuffle algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
  };

  const handleCardClick = (card: Card) => {
    // Prevent clicking if already flipped, matched, or if two cards are already flipped
    if (card.isFlipped || card.isMatched || flippedCards.length >= 2) {
      return;
    }
    
    // Flip the card
    setCards(prev => 
      prev.map(c => 
        c.id === card.id ? { ...c, isFlipped: true } : c
      )
    );
    
    // Add to flipped cards
    setFlippedCards(prev => [...prev, card]);
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const restartGame = () => {
    initializeGame();
  };

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Islamic Matching Game</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Match Islamic terms with their definitions to test your knowledge. Flip cards by clicking on them.
          </p>
          
          {!gameStarted ? (
            <Button onClick={startGame} size="lg" className="mx-auto">
              Start Game
            </Button>
          ) : (
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="outline" className="px-4 py-2 text-lg">
                Moves: {moves}
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-lg">
                Pairs: {matchedPairs}/{islamicTerms.length}
              </Badge>
              <Button onClick={restartGame} variant="outline" className="flex items-center gap-2">
                <Shuffle className="h-4 w-4" />
                Restart
              </Button>
            </div>
          )}
        </div>
        
        {gameStarted && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {cards.map(card => (
              <div
                key={card.id}
                className={`aspect-[3/4] rounded-lg cursor-pointer transition-all duration-300 transform ${
                  card.isFlipped || card.isMatched ? 'rotate-y-180' : ''
                } ${
                  card.isMatched ? 'opacity-70' : ''
                }`}
                onClick={() => handleCardClick(card)}
              >
                <div className={`w-full h-full relative transition-transform duration-500 transform-style-3d ${
                  card.isFlipped || card.isMatched ? 'rotate-y-180' : ''
                }`}>
                  {/* Card Back */}
                  <div className={`absolute w-full h-full backface-hidden rounded-lg bg-islamic-primary flex items-center justify-center text-white text-xl font-bold border-2 border-white transition-opacity duration-300 ${
                    card.isFlipped || card.isMatched ? 'opacity-0' : 'opacity-100'
                  }`}>
                    Islamic Knowledge
                  </div>
                  
                  {/* Card Front */}
                  <div className={`absolute w-full h-full backface-hidden rounded-lg p-4 flex items-center justify-center text-center transform rotate-y-180 transition-opacity duration-300 ${
                    card.isFlipped || card.isMatched ? 'opacity-100' : 'opacity-0'
                  } ${
                    card.type === 'term' ? 'bg-islamic-secondary text-white' : 'bg-white text-islamic-secondary'
                  }`}>
                    <p className={`font-medium ${card.type === 'term' ? 'text-xl' : 'text-sm'}`}>
                      {card.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {gameComplete && (
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Game Complete!</h2>
            <p className="text-lg mb-6">You completed the game in {moves} moves.</p>
            <Button onClick={restartGame} size="lg">
              Play Again
            </Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Matching;
