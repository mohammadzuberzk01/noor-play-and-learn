
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Shuffle, ArrowLeft, ArrowRight } from 'lucide-react';

interface Name {
  arabic: string;
  english: string;
  transliteration: string;
  meaning: string;
}

const NinetyNineNames = () => {
  const [currentMode, setCurrentMode] = useState<'learn' | 'match'>('learn');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchPairs, setMatchPairs] = useState<Name[]>([]);
  const [selectedName, setSelectedName] = useState<Name | null>(null);
  const [selectedMeaning, setSelectedMeaning] = useState<Name | null>(null);
  const [correctPairs, setCorrectPairs] = useState<string[]>([]);
  const [shuffledNames, setShuffledNames] = useState<Name[]>([]);
  const [shuffledMeanings, setShuffledMeanings] = useState<Name[]>([]);
  const [gameComplete, setGameComplete] = useState(false);

  const names: Name[] = [
    { arabic: 'الرحمن', english: 'Ar-Rahman', transliteration: 'Ar-Rahman', meaning: 'The Most Compassionate' },
    { arabic: 'الرحيم', english: 'Ar-Raheem', transliteration: 'Ar-Raheem', meaning: 'The Most Merciful' },
    { arabic: 'الملك', english: 'Al-Malik', transliteration: 'Al-Malik', meaning: 'The King, The Sovereign' },
    { arabic: 'القدوس', english: 'Al-Quddus', transliteration: 'Al-Quddus', meaning: 'The Most Holy' },
    { arabic: 'السلام', english: 'As-Salam', transliteration: 'As-Salam', meaning: 'The Source of Peace' },
    { arabic: 'المؤمن', english: 'Al-Mu\'min', transliteration: 'Al-Mu\'min', meaning: 'The Guardian of Faith' },
    { arabic: 'المهيمن', english: 'Al-Muhaymin', transliteration: 'Al-Muhaymin', meaning: 'The Protector' },
    { arabic: 'العزيز', english: 'Al-Aziz', transliteration: 'Al-Aziz', meaning: 'The Mighty' },
    { arabic: 'الجبار', english: 'Al-Jabbar', transliteration: 'Al-Jabbar', meaning: 'The Compeller' },
    { arabic: 'المتكبر', english: 'Al-Mutakabbir', transliteration: 'Al-Mutakabbir', meaning: 'The Greatest' },
    { arabic: 'الخالق', english: 'Al-Khaliq', transliteration: 'Al-Khaliq', meaning: 'The Creator' },
    { arabic: 'البارئ', english: 'Al-Bari\'', transliteration: 'Al-Bari\'', meaning: 'The Maker' }
  ];

  useEffect(() => {
    // Initialize match game when mode is set to 'match'
    if (currentMode === 'match') {
      initializeMatchGame();
    }
  }, [currentMode]);

  const initializeMatchGame = () => {
    // Select a subset of names for the matching game
    const gameNames = [...names].slice(0, 8);
    setMatchPairs(gameNames);
    
    // Shuffle names and meanings for the game
    const shuffled1 = [...gameNames].sort(() => Math.random() - 0.5);
    const shuffled2 = [...gameNames].sort(() => Math.random() - 0.5);
    
    setShuffledNames(shuffled1);
    setShuffledMeanings(shuffled2);
    setCorrectPairs([]);
    setSelectedName(null);
    setSelectedMeaning(null);
    setGameComplete(false);
  };

  const nextName = () => {
    if (currentIndex < names.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      toast("That's all 99 names! Starting from the beginning.");
      setCurrentIndex(0);
    }
  };

  const prevName = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      toast("You're at the beginning of the list.");
    }
  };

  const handleNameClick = (name: Name) => {
    if (correctPairs.includes(name.english)) return;
    
    setSelectedName(name);
    
    if (selectedMeaning) {
      // Check if the pair is correct
      if (name.english === selectedMeaning.english) {
        toast.success("Correct match!");
        setCorrectPairs([...correctPairs, name.english]);
        
        // Check if the game is complete
        if (correctPairs.length + 1 === matchPairs.length) {
          setGameComplete(true);
          toast.success("Congratulations! You've matched all names correctly!");
        }
      } else {
        toast.error("Not a match, try again!");
      }
      
      // Reset selections
      setTimeout(() => {
        setSelectedName(null);
        setSelectedMeaning(null);
      }, 1000);
    }
  };

  const handleMeaningClick = (name: Name) => {
    if (correctPairs.includes(name.english)) return;
    
    setSelectedMeaning(name);
    
    if (selectedName) {
      // Check if the pair is correct
      if (name.english === selectedName.english) {
        toast.success("Correct match!");
        setCorrectPairs([...correctPairs, name.english]);
        
        // Check if the game is complete
        if (correctPairs.length + 1 === matchPairs.length) {
          setGameComplete(true);
          toast.success("Congratulations! You've matched all names correctly!");
        }
      } else {
        toast.error("Not a match, try again!");
      }
      
      // Reset selections
      setTimeout(() => {
        setSelectedName(null);
        setSelectedMeaning(null);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">99 Names of Allah</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Learn and match the beautiful 99 Names of Allah with their meanings.
          </p>
          
          <div className="flex justify-center gap-4 mb-8">
            <Button 
              onClick={() => setCurrentMode('learn')} 
              variant={currentMode === 'learn' ? 'default' : 'outline'}
            >
              Learn Mode
            </Button>
            <Button 
              onClick={() => setCurrentMode('match')} 
              variant={currentMode === 'match' ? 'default' : 'outline'}
            >
              Match Game
            </Button>
          </div>
        </div>
        
        {currentMode === 'learn' && (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-islamic-primary text-white text-center p-6">
              <h2 className="text-3xl font-bold mb-2">{names[currentIndex].arabic}</h2>
              <p className="text-xl font-medium">{names[currentIndex].transliteration}</p>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {currentIndex + 1} of {names.length}
                </Badge>
                <h3 className="text-xl font-bold text-islamic-primary">{names[currentIndex].english}</h3>
              </div>
              
              <p className="text-lg mb-8 text-center font-medium">
                {names[currentIndex].meaning}
              </p>
              
              <div className="flex justify-between">
                <Button 
                  onClick={prevName} 
                  variant="outline" 
                  className="flex items-center gap-2"
                  disabled={currentIndex === 0}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <Button 
                  onClick={nextName} 
                  className="flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {currentMode === 'match' && (
          <div>
            <div className="flex justify-end mb-4">
              <Button
                onClick={initializeMatchGame}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Shuffle className="h-4 w-4" />
                Restart
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-bold mb-4 text-center">Names</h2>
                <div className="grid grid-cols-2 gap-3">
                  {shuffledNames.map((name, index) => (
                    <div
                      key={`name-${index}`}
                      className={`p-4 rounded-lg text-center cursor-pointer transition-all ${
                        correctPairs.includes(name.english)
                          ? 'bg-green-100 text-green-800 cursor-default'
                          : selectedName?.english === name.english
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-white hover:bg-gray-50'
                      }`}
                      onClick={() => handleNameClick(name)}
                    >
                      <p className="text-xl mb-1 font-bold">{name.arabic}</p>
                      <p className="text-sm">{name.transliteration}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-bold mb-4 text-center">Meanings</h2>
                <div className="grid grid-cols-1 gap-3">
                  {shuffledMeanings.map((name, index) => (
                    <div
                      key={`meaning-${index}`}
                      className={`p-4 rounded-lg text-center cursor-pointer transition-all ${
                        correctPairs.includes(name.english)
                          ? 'bg-green-100 text-green-800 cursor-default'
                          : selectedMeaning?.english === name.english
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-white hover:bg-gray-50'
                      }`}
                      onClick={() => handleMeaningClick(name)}
                    >
                      <p>{name.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {gameComplete && (
              <div className="mt-8 text-center">
                <Badge variant="outline" className="text-lg px-4 py-2 bg-green-100 text-green-800 border-green-200 inline-block">
                  Game Complete! Congratulations!
                </Badge>
              </div>
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default NinetyNineNames;
