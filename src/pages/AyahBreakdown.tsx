
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Book, ArrowRight, Check } from 'lucide-react';

interface WordData {
  id: number;
  arabic: string;
  transliteration: string;
  meaning: string;
}

interface AyahData {
  id: number;
  surah: string;
  ayahNumber: string;
  arabic: string;
  translation: string;
  words: WordData[];
}

const AyahBreakdown = () => {
  const [currentAyah, setCurrentAyah] = useState<AyahData | null>(null);
  const [shuffledWords, setShuffledWords] = useState<WordData[]>([]);
  const [selectedWords, setSelectedWords] = useState<WordData[]>([]);
  const [correctOrder, setCorrectOrder] = useState<boolean>(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [showTranslation, setShowTranslation] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  
  // Sample ayahs data
  const ayahs: AyahData[] = [
    {
      id: 1,
      surah: "Al-Fatihah",
      ayahNumber: "1:1",
      arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
      words: [
        { id: 1, arabic: "بِسْمِ", transliteration: "Bismi", meaning: "In the name" },
        { id: 2, arabic: "اللَّهِ", transliteration: "Allāhi", meaning: "of Allah" },
        { id: 3, arabic: "الرَّحْمَٰنِ", transliteration: "ar-Raḥmāni", meaning: "the Most Gracious" },
        { id: 4, arabic: "الرَّحِيمِ", transliteration: "ar-Raḥīmi", meaning: "the Most Merciful" }
      ]
    },
    {
      id: 2,
      surah: "Al-Ikhlas",
      ayahNumber: "112:1",
      arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
      translation: "Say, 'He is Allah, [who is] One'",
      words: [
        { id: 1, arabic: "قُلْ", transliteration: "Qul", meaning: "Say" },
        { id: 2, arabic: "هُوَ", transliteration: "Huwa", meaning: "He" },
        { id: 3, arabic: "اللَّهُ", transliteration: "Allāhu", meaning: "Allah" },
        { id: 4, arabic: "أَحَدٌ", transliteration: "Aḥadun", meaning: "One" }
      ]
    },
    {
      id: 3,
      surah: "Al-Baqarah",
      ayahNumber: "2:255 (Ayatul Kursi - beginning)",
      arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
      translation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence.",
      words: [
        { id: 1, arabic: "اللَّهُ", transliteration: "Allāhu", meaning: "Allah" },
        { id: 2, arabic: "لَا", transliteration: "Lā", meaning: "No" },
        { id: 3, arabic: "إِلَٰهَ", transliteration: "ilāha", meaning: "deity" },
        { id: 4, arabic: "إِلَّا", transliteration: "illā", meaning: "except" },
        { id: 5, arabic: "هُوَ", transliteration: "huwa", meaning: "Him" },
        { id: 6, arabic: "الْحَيُّ", transliteration: "al-ḥayyu", meaning: "the Ever-Living" },
        { id: 7, arabic: "الْقَيُّومُ", transliteration: "al-qayyūmu", meaning: "the Sustainer" }
      ]
    },
    {
      id: 4,
      surah: "Al-Asr",
      ayahNumber: "103:1-2",
      arabic: "وَالْعَصْرِ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ",
      translation: "By time, Indeed, mankind is in loss.",
      words: [
        { id: 1, arabic: "وَالْعَصْرِ", transliteration: "Wal-'aṣri", meaning: "By time" },
        { id: 2, arabic: "إِنَّ", transliteration: "Inna", meaning: "Indeed" },
        { id: 3, arabic: "الْإِنسَانَ", transliteration: "al-insāna", meaning: "mankind" },
        { id: 4, arabic: "لَفِي", transliteration: "lafī", meaning: "is in" },
        { id: 5, arabic: "خُسْرٍ", transliteration: "khusrin", meaning: "loss" }
      ]
    }
  ];

  // Initialize or start new level
  useEffect(() => {
    // Set current ayah based on level
    const ayahIndex = (level - 1) % ayahs.length;
    const ayah = ayahs[ayahIndex];
    setCurrentAyah(ayah);
    
    // Shuffle words for matching exercise
    if (ayah) {
      const shuffled = [...ayah.words].sort(() => Math.random() - 0.5);
      setShuffledWords(shuffled);
    }
    
    setSelectedWords([]);
    setCorrectOrder(false);
    setGameComplete(false);
    setShowTranslation(false);
  }, [level]);

  // Handle word selection
  const handleWordSelect = (word: WordData) => {
    // Check if word is already selected
    if (selectedWords.some(w => w.id === word.id)) {
      return;
    }
    
    const newSelectedWords = [...selectedWords, word];
    setSelectedWords(newSelectedWords);
    
    // Check if all words are selected
    if (currentAyah && newSelectedWords.length === currentAyah.words.length) {
      // Check if order is correct
      const isCorrect = newSelectedWords.every((word, index) => 
        word.id === currentAyah.words[index].id
      );
      
      setCorrectOrder(isCorrect);
      setGameComplete(true);
      
      if (isCorrect) {
        setScore(score + 50);
        toast({
          title: "Excellent!",
          description: "You arranged the ayah correctly.",
          variant: "default"
        });
      } else {
        toast({
          title: "Almost there!",
          description: "The words aren't in the correct order.",
          variant: "destructive"
        });
      }
    }
  };

  // Reset current selection
  const resetSelection = () => {
    setSelectedWords([]);
  };

  // Move to next level
  const handleNextLevel = () => {
    setLevel(level + 1);
  };

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Ayah Breakdown</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Break down Qur'anic verses word by word to understand their meanings.
          </p>
        </div>
        
        <div className="flex flex-col gap-8">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <Badge variant="outline" className="px-3 py-1 text-base">
                Level: {level}
              </Badge>
              <Badge variant="outline" className="px-3 py-1 text-base">
                Score: {score}
              </Badge>
            </div>
            
            {currentAyah && (
              <>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-bold">{currentAyah.surah} {currentAyah.ayahNumber}</h2>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowTranslation(!showTranslation)}
                    >
                      {showTranslation ? "Hide" : "Show"} Translation
                    </Button>
                  </div>
                  
                  {showTranslation && (
                    <p className="italic text-muted-foreground mb-4">{currentAyah.translation}</p>
                  )}
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-2xl text-right mb-2 font-arabic">{currentAyah.arabic}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Arrange the words in order:</h3>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {shuffledWords.map((word) => (
                      <Button
                        key={word.id}
                        variant="outline"
                        onClick={() => handleWordSelect(word)}
                        disabled={selectedWords.some(w => w.id === word.id) || gameComplete}
                        className="font-arabic text-lg"
                      >
                        {word.arabic}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg min-h-16 flex flex-wrap gap-2 items-center">
                    {selectedWords.map((word, index) => (
                      <div 
                        key={index} 
                        className="bg-white px-3 py-2 rounded font-arabic text-lg"
                      >
                        {word.arabic}
                      </div>
                    ))}
                    
                    {selectedWords.length === 0 && (
                      <p className="text-muted-foreground">Select words to build the ayah</p>
                    )}
                  </div>
                  
                  {selectedWords.length > 0 && !gameComplete && (
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={resetSelection}
                    >
                      Reset
                    </Button>
                  )}
                </div>
                
                {gameComplete && (
                  <div className={`p-4 rounded-lg mb-6 ${correctOrder ? 'bg-green-100' : 'bg-red-100'}`}>
                    <h3 className="font-bold mb-2">
                      {correctOrder ? "Correct! Well done!" : "Not quite right."}
                    </h3>
                    <p>Here's the correct word-by-word breakdown:</p>
                    
                    <div className="mt-4 space-y-3">
                      {currentAyah.words.map((word, index) => (
                        <div key={index} className="bg-white p-3 rounded shadow-sm">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-xl font-arabic">{word.arabic}</span>
                            <span className="text-sm text-muted-foreground">{word.transliteration}</span>
                          </div>
                          <p className="text-muted-foreground">{word.meaning}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 flex justify-center">
                      <Button onClick={handleNextLevel}>Next Ayah</Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Book className="mr-2 h-5 w-5" />
              Word-by-Word Understanding
            </h2>
            <p className="mb-4">
              Breaking down Qur'anic verses word by word helps deepen your understanding of the 
              Arabic language and the messages of the Qur'an. Each word has its own meaning and 
              grammatical function that contributes to the overall message.
            </p>
            <p>
              As you practice with more verses, you'll begin to recognize patterns and common 
              words, making your Qur'an study more meaningful and enriching.
            </p>
          </Card>
          
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">How to Play</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Arrange the Arabic words in the correct order to form the complete ayah</li>
              <li>Learn the meaning of each word in the ayah</li>
              <li>Complete the arrangement to advance to the next level</li>
              <li>Use the "Show Translation" button if you need help</li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AyahBreakdown;
