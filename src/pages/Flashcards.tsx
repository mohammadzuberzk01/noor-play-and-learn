import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Copy, Shuffle, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';

interface Flashcard {
  id: number;
  front: string;
  back: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  learned: boolean;
}

const Flashcards = () => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [learnedCount, setLearnedCount] = useState(0);
  
  // Sample flashcard data
  const flashcardData: Flashcard[] = [
    {
      id: 1,
      front: "What are the five pillars of Islam?",
      back: "Shahada (Faith), Salah (Prayer), Zakat (Charity), Sawm (Fasting), Hajj (Pilgrimage)",
      category: "basics",
      difficulty: "easy",
      learned: false
    },
    {
      id: 2,
      front: "What is Tawheed?",
      back: "The concept of monotheism in Islam - the belief in Allah as the one and only God",
      category: "aqeedah",
      difficulty: "easy",
      learned: false
    },
    {
      id: 3,
      front: "What is the difference between Fard and Wajib in Hanafi fiqh?",
      back: "Fard is obligatory based on clear evidence, while Wajib is obligatory based on evidence that is slightly less clear",
      category: "fiqh",
      difficulty: "hard",
      learned: false
    },
    {
      id: 4,
      front: "What is the meaning of 'Alhamdulillah'?",
      back: "All praise is due to Allah",
      category: "vocabulary",
      difficulty: "easy",
      learned: false
    },
    {
      id: 5,
      front: "What is Shirk?",
      back: "The sin of associating partners with Allah, considered the gravest sin in Islam",
      category: "aqeedah",
      difficulty: "medium",
      learned: false
    },
    {
      id: 6,
      front: "Name the four Rightly Guided Caliphs in order",
      back: "Abu Bakr, Umar ibn Al-Khattab, Uthman ibn Affan, Ali ibn Abi Talib",
      category: "history",
      difficulty: "medium",
      learned: false
    },
    {
      id: 7,
      front: "What is the meaning of 'Bidah'?",
      back: "Innovation in religious matters that was not present during the time of the Prophet ﷺ",
      category: "fiqh",
      difficulty: "medium",
      learned: false
    },
    {
      id: 8,
      front: "What are the conditions for Wudu (ablution)?",
      back: "1. Intention (niyyah)\n2. Using clean water\n3. Full washing of specified parts\n4. Continuity without long pauses\n5. Removing anything that prevents water reaching the skin",
      category: "fiqh",
      difficulty: "medium",
      learned: false
    },
    {
      id: 9,
      front: "What is the meaning of 'JazakAllah Khair'?",
      back: "May Allah reward you with goodness",
      category: "vocabulary",
      difficulty: "easy",
      learned: false
    },
    {
      id: 10,
      front: "What are the names of the four major schools of thought (madhabs) in Sunni Islam?",
      back: "Hanafi, Maliki, Shafi'i, and Hanbali",
      category: "fiqh",
      difficulty: "medium",
      learned: false
    },
    {
      id: 11,
      front: "What is Qiyas in Islamic jurisprudence?",
      back: "Analogical reasoning - the process of applying a known injunction to a new circumstance based on similarities between the two cases",
      category: "fiqh",
      difficulty: "hard",
      learned: false
    },
    {
      id: 12,
      front: "What is the difference between Sunnah and Hadith?",
      back: "Sunnah refers to the Prophet Muhammad's ﷺ way of life (practices, habits, teachings), while Hadith refers to the narrations about his life, actions, and sayings",
      category: "basics",
      difficulty: "medium",
      learned: false
    }
  ];
  
  // Initialize cards
  useEffect(() => {
    setCards(flashcardData);
    setLearnedCount(0);
  }, []);
  
  // Filter cards based on category and difficulty
  const filteredCards = cards.filter(card => {
    if (filterCategory !== 'all' && card.category !== filterCategory) return false;
    if (filterDifficulty !== 'all' && card.difficulty !== filterDifficulty) return false;
    return true;
  });
  
  const currentCard = filteredCards[currentCardIndex] || null;
  
  const nextCard = () => {
    setFlipped(false);
    if (currentCardIndex < filteredCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setCurrentCardIndex(0);
      toast({
        title: "Cycle Complete",
        description: "Starting from the beginning",
      });
    }
  };
  
  const prevCard = () => {
    setFlipped(false);
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    } else {
      setCurrentCardIndex(filteredCards.length - 1);
    }
  };
  
  const flipCard = () => {
    setFlipped(!flipped);
  };
  
  const shuffleCards = () => {
    const currentCard = filteredCards[currentCardIndex];
    const shuffled = [...filteredCards].sort(() => Math.random() - 0.5);
    setCards(prevCards => 
      prevCards.map(card => {
        const shuffledCard = shuffled.find(s => s.id === card.id);
        return shuffledCard || card;
      })
    );
    // Keep the same card visible after shuffle
    if (currentCard) {
      const newIndex = shuffled.findIndex(card => card.id === currentCard.id);
      setCurrentCardIndex(newIndex >= 0 ? newIndex : 0);
    }
    toast({
      title: "Cards Shuffled",
      description: "The order of cards has been randomized",
    });
  };
  
  const markAsLearned = () => {
    if (!currentCard) return;
    
    const isCurrentlyLearned = currentCard.learned;
    
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === currentCard.id ? { ...card, learned: !isCurrentlyLearned } : card
      )
    );
    
    if (isCurrentlyLearned) {
      setLearnedCount(prev => prev - 1);
      toast({
        title: "Marked as Not Learned",
        description: "You can revisit this card later",
      });
    } else {
      setLearnedCount(prev => prev + 1);
      toast({
        title: "Marked as Learned!",
        description: "Great job on memorizing this concept",
        variant: "success"
      });
      nextCard();
    }
  };
  
  const resetLearned = () => {
    setCards(prevCards => 
      prevCards.map(card => ({ ...card, learned: false }))
    );
    setLearnedCount(0);
    toast({
      title: "Progress Reset",
      description: "All cards have been marked as not learned",
    });
  };

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Flashcard Frenzy</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Use flashcards to rapidly learn Islamic concepts
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar with filters and stats */}
          <div className="w-full md:w-64 space-y-6">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3">Categories</h3>
              <div className="space-y-2">
                <Button 
                  variant={filterCategory === 'all' ? 'default' : 'outline'} 
                  className="w-full justify-start"
                  onClick={() => setFilterCategory('all')}
                >
                  All Categories
                </Button>
                {Array.from(new Set(cards.map(card => card.category))).map(category => (
                  <Button 
                    key={category} 
                    variant={filterCategory === category ? 'default' : 'outline'} 
                    className="w-full justify-start"
                    onClick={() => {
                      setFilterCategory(category);
                      setCurrentCardIndex(0);
                      setFlipped(false);
                    }}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>
              
              <h3 className="text-lg font-semibold mb-3 mt-6">Difficulty</h3>
              <div className="space-y-2">
                <Button 
                  variant={filterDifficulty === 'all' ? 'default' : 'outline'} 
                  className="w-full justify-start"
                  onClick={() => setFilterDifficulty('all')}
                >
                  All Levels
                </Button>
                <Button 
                  variant={filterDifficulty === 'easy' ? 'default' : 'outline'} 
                  className="w-full justify-start"
                  onClick={() => {
                    setFilterDifficulty('easy');
                    setCurrentCardIndex(0);
                    setFlipped(false);
                  }}
                >
                  Easy
                </Button>
                <Button 
                  variant={filterDifficulty === 'medium' ? 'default' : 'outline'} 
                  className="w-full justify-start"
                  onClick={() => {
                    setFilterDifficulty('medium');
                    setCurrentCardIndex(0);
                    setFlipped(false);
                  }}
                >
                  Medium
                </Button>
                <Button 
                  variant={filterDifficulty === 'hard' ? 'default' : 'outline'} 
                  className="w-full justify-start"
                  onClick={() => {
                    setFilterDifficulty('hard');
                    setCurrentCardIndex(0);
                    setFlipped(false);
                  }}
                >
                  Hard
                </Button>
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Progress:</span>
                  <Badge variant="outline">
                    {learnedCount}/{cards.length} cards
                  </Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div 
                    className="bg-islamic-primary h-2.5 rounded-full" 
                    style={{ width: `${(learnedCount / cards.length) * 100}%` }}
                  ></div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4 w-full"
                  onClick={resetLearned}
                >
                  Reset Progress
                </Button>
              </div>
            </Card>
          </div>
          
          {/* Main flashcard area */}
          <div className="flex-1">
            {currentCard ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      Card {currentCardIndex + 1} of {filteredCards.length}
                    </Badge>
                    <Badge 
                      className={
                        currentCard.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        currentCard.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }
                    >
                      {currentCard.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      {currentCard.category}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={shuffleCards}>
                      <Shuffle className="h-4 w-4 mr-1" /> Shuffle
                    </Button>
                  </div>
                </div>
                
                <Card 
                  className={`p-6 min-h-[300px] flex flex-col justify-between transition-all ${flipped ? 'bg-card shadow-md' : 'cursor-pointer hover:shadow-md'}`}
                  onClick={flipCard}
                >
                  <div className="text-center flex-1 flex flex-col justify-center">
                    <h3 className="text-lg text-muted-foreground mb-2">
                      {flipped ? 'Answer' : 'Question'}
                    </h3>
                    <p className="text-xl md:text-2xl font-medium">
                      {flipped ? currentCard.back : currentCard.front}
                    </p>
                  </div>
                  
                  <div className="text-center mt-4 pt-4 border-t text-sm">
                    Click the card to {flipped ? 'see the question' : 'reveal the answer'}
                  </div>
                </Card>
                
                <div className="flex justify-between items-center mt-6">
                  <Button onClick={prevCard}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Previous
                  </Button>
                  
                  <Button 
                    variant={currentCard.learned ? 'outline' : 'default'}
                    className={currentCard.learned ? '' : 'bg-islamic-primary'}
                    onClick={markAsLearned}
                  >
                    {currentCard.learned ? 'Mark as Not Learned' : 'Mark as Learned'}
                  </Button>
                  
                  <Button onClick={nextCard}>
                    Next <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center p-12 bg-card rounded-lg shadow-md">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-bold mb-2">No Cards Available</h2>
                <p className="text-muted-foreground mb-6">
                  No flashcards match your current filters. Try selecting a different category or difficulty level.
                </p>
                <Button onClick={() => {
                  setFilterCategory('all');
                  setFilterDifficulty('all');
                }}>
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 bg-muted p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">How to Use Flashcards</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Click on a card to flip it and see the answer</li>
            <li>Use the "Previous" and "Next" buttons to navigate through cards</li>
            <li>Filter cards by category or difficulty level</li>
            <li>Mark cards as "Learned" to track your progress</li>
            <li>Shuffle cards for a random review session</li>
          </ul>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Flashcards;
