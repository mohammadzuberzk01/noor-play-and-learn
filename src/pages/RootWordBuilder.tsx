
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Book, Check, ArrowRight } from 'lucide-react';

interface RootData {
  id: number;
  root: string;
  words: Array<{
    id: number;
    word: string;
    meaning: string;
    form: string;
  }>;
}

const RootWordBuilder = () => {
  const [currentRoot, setCurrentRoot] = useState<RootData | null>(null);
  const [userInput, setUserInput] = useState('');
  const [foundWords, setFoundWords] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timer, setTimer] = useState(60);
  const [gameActive, setGameActive] = useState(true);
  const [selectedWord, setSelectedWord] = useState<{id: number, word: string, meaning: string, form: string} | null>(null);

  // Sample Qur'anic root data
  const quranicRoots: RootData[] = [
    {
      id: 1,
      root: "ك-ت-ب",
      words: [
        { id: 1, word: "كِتَاب", meaning: "Book", form: "Noun" },
        { id: 2, word: "كَتَبَ", meaning: "He wrote", form: "Past Verb" },
        { id: 3, word: "يَكْتُبُ", meaning: "He writes", form: "Present Verb" },
        { id: 4, word: "كَاتِب", meaning: "Writer", form: "Active Participle" },
        { id: 5, word: "مَكْتُوب", meaning: "Written", form: "Passive Participle" }
      ]
    },
    {
      id: 2,
      root: "ع-ل-م",
      words: [
        { id: 1, word: "عِلْم", meaning: "Knowledge", form: "Noun" },
        { id: 2, word: "عَلِمَ", meaning: "He knew", form: "Past Verb" },
        { id: 3, word: "يَعْلَمُ", meaning: "He knows", form: "Present Verb" },
        { id: 4, word: "عَالِم", meaning: "Scholar", form: "Active Participle" },
        { id: 5, word: "مَعْلُوم", meaning: "Known", form: "Passive Participle" }
      ]
    },
    {
      id: 3,
      root: "س-ج-د",
      words: [
        { id: 1, word: "سُجُود", meaning: "Prostration", form: "Noun" },
        { id: 2, word: "سَجَدَ", meaning: "He prostrated", form: "Past Verb" },
        { id: 3, word: "يَسْجُدُ", meaning: "He prostrates", form: "Present Verb" },
        { id: 4, word: "سَاجِد", meaning: "One who prostrates", form: "Active Participle" },
        { id: 5, word: "مَسْجِد", meaning: "Mosque (place of prostration)", form: "Noun of place" }
      ]
    },
    {
      id: 4,
      root: "ق-و-ل",
      words: [
        { id: 1, word: "قَوْل", meaning: "Speech", form: "Noun" },
        { id: 2, word: "قَالَ", meaning: "He said", form: "Past Verb" },
        { id: 3, word: "يَقُولُ", meaning: "He says", form: "Present Verb" },
        { id: 4, word: "قَائِل", meaning: "Speaker", form: "Active Participle" },
        { id: 5, word: "مَقُول", meaning: "What is said", form: "Passive Participle" }
      ]
    },
    {
      id: 5,
      root: "ح-م-د",
      words: [
        { id: 1, word: "حَمْد", meaning: "Praise", form: "Noun" },
        { id: 2, word: "حَمِدَ", meaning: "He praised", form: "Past Verb" },
        { id: 3, word: "يَحْمَدُ", meaning: "He praises", form: "Present Verb" },
        { id: 4, word: "حَامِد", meaning: "One who praises", form: "Active Participle" },
        { id: 5, word: "مَحْمُود", meaning: "Praised", form: "Passive Participle" }
      ]
    }
  ];

  // Initialize or start new round
  const startNewRound = () => {
    // Select a root based on the current level
    const rootIndex = (level - 1) % quranicRoots.length;
    setCurrentRoot(quranicRoots[rootIndex]);
    setFoundWords([]);
    setUserInput('');
    setTimer(60);
    setGameActive(true);
    setSelectedWord(null);
  };

  // Initialize game
  useEffect(() => {
    startNewRound();
  }, [level]);

  // Timer countdown
  useEffect(() => {
    if (gameActive && timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else if (timer === 0 && gameActive) {
      setGameActive(false);
      toast({
        title: "Time's up!",
        description: `You found ${foundWords.length} words from the root ${currentRoot?.root}`,
      });
    }
  }, [timer, gameActive, currentRoot, foundWords.length]);

  // Check user input against possible words
  const checkWord = () => {
    if (!userInput.trim() || !currentRoot) return;
    
    const match = currentRoot.words.find(
      word => word.word === userInput.trim() && !foundWords.includes(word.id)
    );
    
    if (match) {
      setFoundWords([...foundWords, match.id]);
      setScore(score + 20);
      setSelectedWord(match);
      
      toast({
        title: "Correct!",
        description: `${match.word} - ${match.meaning}`,
        variant: "default"
      });
      
      // Check if all words are found
      if (foundWords.length + 1 >= currentRoot.words.length) {
        toast({
          title: "Level Complete!",
          description: `You've found all words from this root!`,
          variant: "default"
        });
        
        setTimeout(() => {
          setLevel(level + 1);
        }, 2000);
      }
    } else if (currentRoot.words.some(word => word.word === userInput.trim())) {
      toast({
        title: "Already found",
        description: "Try another word from this root",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Not a valid word",
        description: "Try again with a different word",
        variant: "destructive"
      });
    }
    
    setUserInput('');
  };

  // Handle input submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkWord();
  };

  // Handle next level
  const handleNextLevel = () => {
    setLevel(level + 1);
  };

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Root Word Builder</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn to build multiple words from trilateral Arabic roots from the Qur'an.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-3/5">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <Badge variant="outline" className="px-3 py-1 text-base">
                  Level: {level}
                </Badge>
                <Badge variant="outline" className="px-3 py-1 text-base">
                  Time: {timer}s
                </Badge>
                <Badge variant="outline" className="px-3 py-1 text-base">
                  Score: {score}
                </Badge>
              </div>
              
              {currentRoot && (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2">Root: {currentRoot.root}</h2>
                    <p className="text-muted-foreground">
                      Build as many words as you can using this trilateral root
                    </p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="mb-6">
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Enter an Arabic word..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        className="font-arabic text-lg"
                        dir="rtl"
                        disabled={!gameActive}
                      />
                      <Button type="submit" disabled={!gameActive}>
                        Check
                      </Button>
                    </div>
                  </form>
                  
                  <div className="bg-muted p-4 rounded-lg mb-6">
                    <h3 className="font-semibold mb-2">Words Found: {foundWords.length}/{currentRoot.words.length}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {currentRoot.words.map((word) => (
                        <div 
                          key={word.id}
                          className={`p-2 rounded flex justify-between items-center ${
                            foundWords.includes(word.id) 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-white text-gray-400'
                          }`}
                        >
                          {foundWords.includes(word.id) ? (
                            <>
                              <span className="font-bold">{word.word}</span>
                              <Check className="h-4 w-4" />
                            </>
                          ) : (
                            <span>?????</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              {!gameActive && (
                <div className="text-center">
                  <Button onClick={handleNextLevel} className="mr-2">Next Level</Button>
                  <Button variant="outline" onClick={() => startNewRound()}>Retry</Button>
                </div>
              )}
            </Card>
          </div>
          
          <div className="md:w-2/5">
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Book className="mr-2 h-5 w-5" />
                About Trilateral Roots
              </h2>
              <p className="mb-4">
                Most Arabic words are derived from a three-letter root. These three 
                consonants form the foundation, and by adding specific patterns of 
                vowels and additional letters, different words with related meanings 
                can be formed.
              </p>
              <p>
                For example, from the root ك-ت-ب (k-t-b), we can derive words like:
                كِتَاب (book), كَتَبَ (he wrote), كَاتِب (writer), and more.
              </p>
            </Card>
            
            {selectedWord && (
              <Card className="p-6 animate-fade-in">
                <h2 className="text-xl font-bold mb-4">Word Details</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-muted-foreground">Word</h3>
                    <p className="text-2xl font-bold">{selectedWord.word}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground">Meaning</h3>
                    <p className="text-lg">{selectedWord.meaning}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground">Form</h3>
                    <p className="text-lg">{selectedWord.form}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground">Root</h3>
                    <p className="text-lg">{currentRoot?.root}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
        
        <div className="mt-8 bg-muted p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">How to Play</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Enter words that can be formed from the given trilateral root</li>
            <li>Find as many words as possible before time runs out</li>
            <li>Learn about word forms and their meanings in the Qur'an</li>
            <li>Complete all words to advance to the next level</li>
          </ul>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RootWordBuilder;
