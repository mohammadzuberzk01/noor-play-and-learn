import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface Verse {
  id: number;
  arabic: string;
  translation: string;
  surahName: string;
  verseNumber: string;
}

const VerseMatch = () => {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  
  // Sample verse data
  const verseData: Verse[] = [
    {
      id: 1,
      arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      translation: "In the name of Allah, the Most Gracious, the Most Merciful",
      surahName: "Al-Fatihah",
      verseNumber: "1:1"
    },
    {
      id: 2,
      arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      translation: "Praise be to Allah, Lord of the worlds",
      surahName: "Al-Fatihah",
      verseNumber: "1:2"
    },
    {
      id: 3,
      arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
      translation: "Say, 'He is Allah, [who is] One'",
      surahName: "Al-Ikhlas",
      verseNumber: "112:1"
    },
    {
      id: 4,
      arabic: "اللَّهُ الصَّمَدُ",
      translation: "Allah, the Eternal Refuge",
      surahName: "Al-Ikhlas",
      verseNumber: "112:2"
    },
    {
      id: 5,
      arabic: "وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ",
      translation: "And I did not create the jinn and mankind except to worship Me",
      surahName: "Adh-Dhariyat",
      verseNumber: "51:56"
    },
    {
      id: 6,
      arabic: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ",
      translation: "Indeed, We have granted you, [O Muhammad], al-Kawthar",
      surahName: "Al-Kawthar",
      verseNumber: "108:1"
    }
  ];
  
  // Initialize or shuffle verses
  useEffect(() => {
    const shuffled = [...verseData].sort(() => Math.random() - 0.5);
    setVerses(shuffled);
  }, [round]);
  
  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameOver) {
      setGameOver(true);
      toast({
        title: "Time's up!",
        description: `Final score: ${score}`,
      });
    }
  }, [timeLeft, gameOver, score]);
  
  const handleVerseClick = (id: number) => {
    if (selectedVerse === null) {
      setSelectedVerse(id);
    }
  };
  
  const handleSurahClick = (id: number) => {
    if (selectedSurah === null) {
      setSelectedSurah(id);
      
      // Check if match is correct
      if (selectedVerse !== null) {
        const verse = verses.find(v => v.id === selectedVerse);
        const surah = verses.find(v => v.id === id);
        
        if (verse && surah && verse.surahName === surah.surahName) {
          setScore(score + 10);
          toast({
            title: "Correct match!",
            description: "+10 points",
            variant: "default"
          });
          
          // Remove matched pair from the board
          setVerses(verses.filter(v => v.id !== selectedVerse && v.id !== id));
        } else {
          toast({
            title: "Incorrect match",
            description: "Try again!",
            variant: "destructive"
          });
        }
        
        // Reset selections
        setSelectedVerse(null);
        setSelectedSurah(null);
        
        // Check if round is complete
        if (verses.length <= 2) {
          if (round < 3) {
            setRound(round + 1);
            setTimeLeft(60);
            toast({
              title: "Round complete!",
              description: `Moving to round ${round + 1}`,
            });
          } else {
            setGameOver(true);
            toast({
              title: "Game complete!",
              description: `Final score: ${score}`,
            });
          }
        }
      }
    }
  };
  
  const resetGame = () => {
    setScore(0);
    setRound(1);
    setGameOver(false);
    setTimeLeft(60);
    setSelectedVerse(null);
    setSelectedSurah(null);
    const shuffled = [...verseData].sort(() => Math.random() - 0.5);
    setVerses(shuffled);
  };

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Verse Matchmaker</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Match Quranic verses with their correct Surah names
          </p>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-lg px-4 py-2">
              Score: {score}
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              Round: {round}/3
            </Badge>
          </div>
          <Badge 
            variant="outline" 
            className={`text-lg px-4 py-2 ${timeLeft < 10 ? 'bg-red-100 text-red-800' : ''}`}
          >
            Time: {timeLeft}s
          </Badge>
        </div>
        
        {gameOver ? (
          <div className="text-center p-8 bg-card rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Game Over</h2>
            <p className="text-xl mb-6">Your final score: {score}</p>
            <Button size="lg" onClick={resetGame}>
              Play Again
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Verses</h3>
              <div className="space-y-4">
                {verses.slice(0, 3).map(verse => (
                  <Card 
                    key={`verse-${verse.id}`}
                    className={`p-4 cursor-pointer transition-all ${selectedVerse === verse.id ? 'border-2 border-islamic-primary' : 'hover:border-islamic-primary/50'}`}
                    onClick={() => handleVerseClick(verse.id)}
                  >
                    <p className="text-xl text-right mb-2">{verse.arabic}</p>
                    <p className="text-sm">{verse.translation}</p>
                  </Card>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Surah Names</h3>
              <div className="space-y-4">
                {verses.slice(0, 3).map(verse => (
                  <Card 
                    key={`surah-${verse.id}`}
                    className={`p-4 cursor-pointer transition-all ${selectedSurah === verse.id ? 'border-2 border-islamic-primary' : 'hover:border-islamic-primary/50'}`}
                    onClick={() => handleSurahClick(verse.id)}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-medium">{verse.surahName}</p>
                      <Badge variant="outline">{verse.verseNumber}</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 bg-muted p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">How to Play</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Click on a verse, then click on its matching Surah name</li>
            <li>Earn 10 points for each correct match</li>
            <li>Complete 3 rounds before time runs out</li>
          </ul>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VerseMatch;
