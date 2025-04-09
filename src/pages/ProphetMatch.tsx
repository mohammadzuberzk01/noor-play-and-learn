import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface Prophet {
  name: string;
  image: string;
}

const ProphetMatch = () => {
  const [prophets, setProphets] = useState<Prophet[]>([
    { name: 'Adam', image: '/images/prophets/adam.png' },
    { name: 'Nuh', image: '/images/prophets/nuh.png' },
    { name: 'Ibrahim', image: '/images/prophets/ibrahim.png' },
    { name: 'Musa', image: '/images/prophets/musa.png' },
    { name: 'Isa', image: '/images/prophets/isa.png' },
    { name: 'Muhammad', image: '/images/prophets/muhammad.png' },
  ]);
  const [selectedProphet, setSelectedProphet] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    // Shuffle prophets on mount
    shuffleProphets();
  }, []);

  useEffect(() => {
    // Check if all pairs are matched
    if (matchedPairs.length === prophets.length * 2) {
      setGameOver(true);
      toast({
        title: "Congratulations!",
        description: `You matched all the prophets in ${attempts} attempts with a score of ${score}.`,
      });
    }
  }, [matchedPairs, prophets.length, attempts, score]);

  const shuffleProphets = () => {
    const duplicatedProphets = [...prophets, ...prophets];
    const shuffledProphets = duplicatedProphets.sort(() => Math.random() - 0.5);
    setProphets(shuffledProphets);
    setMatchedPairs([]);
    setAttempts(0);
    setScore(0);
    setGameOver(false);
  };

  const handleCardClick = (prophetName: string) => {
    console.log(`Selected prophet: ${prophetName}`);
    setSelectedProphet(prophetName);

    if (selectedProphet) {
      setAttempts(attempts + 1);
      if (selectedProphet === prophetName && !matchedPairs.includes(prophetName)) {
        setScore(score + 10);
        setMatchedPairs([...matchedPairs, selectedProphet, prophetName]);
        setSelectedProphet(null);
        toast({
          title: "Match found!",
          description: "+10 points",
          variant: "default"
        });
      } else {
        setScore(Math.max(0, score - 5));
        setSelectedProphet(null);
        toast({
          title: "No match!",
          description: "-5 points",
          variant: "destructive"
        });
      }
    } else {
      setSelectedProphet(prophetName);
    }
  };

  const isMatched = (prophetName: string) => matchedPairs.includes(prophetName);

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Prophet Match</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Match pairs of prophet cards to test your knowledge!
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <Badge variant="outline" className="text-lg px-4 py-2">
            Score: {score}
          </Badge>
          <Badge variant="outline" className="text-lg px-4 py-2">
            Attempts: {attempts}
          </Badge>
        </div>

        {gameOver ? (
          <div className="text-center p-8 bg-card rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
            <p className="text-xl mb-6">You matched all the prophets in {attempts} attempts with a score of {score}.</p>
            <Button size="lg" onClick={shuffleProphets}>
              Play Again
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {prophets.map((prophet, index) => (
              <Card
                key={index}
                className={`p-4 cursor-pointer transition-all ${isMatched(prophet.name) ? 'opacity-50 pointer-events-none' : ''} ${selectedProphet === prophet.name ? 'border-2 border-islamic-primary' : 'hover:border-islamic-primary/50'}`}
                onClick={() => !isMatched(prophet.name) && handleCardClick(prophet.name)}
              >
                <img src={prophet.image} alt={prophet.name} className="w-full h-32 object-contain mb-2" />
                <p className="text-center font-medium">{prophet.name}</p>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 bg-muted p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">How to Play</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Click on a card to reveal a prophet.</li>
            <li>Click on another card to find a matching prophet.</li>
            <li>Match all pairs to win the game.</li>
            <li>Earn 10 points for each correct match, lose 5 points for incorrect matches.</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProphetMatch;
