
import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Play, Volume2, Award, Heart, ArrowRight } from 'lucide-react';

interface Ayah {
  id: number;
  arabic: string;
  translation: string;
  audioUrl: string;
  surah: string;
  ayahNumber: string;
  options: string[];
}

const AyahAudio = () => {
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Sample ayah data
  const ayahData: Ayah[] = [
    {
      id: 1,
      arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      translation: "In the name of Allah, the Most Gracious, the Most Merciful",
      audioUrl: "https://www.islamcan.com/audio/quran/verse/001-001.mp3",
      surah: "Al-Fatihah",
      ayahNumber: "1:1",
      options: [
        "In the name of Allah, the Most Gracious, the Most Merciful",
        "All praise is due to Allah, Lord of the worlds",
        "The Most Gracious, the Most Merciful",
        "Master of the Day of Judgment"
      ]
    },
    {
      id: 2,
      arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      translation: "All praise is due to Allah, Lord of the worlds",
      audioUrl: "https://www.islamcan.com/audio/quran/verse/001-002.mp3",
      surah: "Al-Fatihah",
      ayahNumber: "1:2",
      options: [
        "The Most Gracious, the Most Merciful",
        "All praise is due to Allah, Lord of the worlds",
        "In the name of Allah, the Most Gracious, the Most Merciful",
        "It is You we worship and You we ask for help"
      ]
    },
    {
      id: 3,
      arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
      translation: "Say, 'He is Allah, [who is] One'",
      audioUrl: "https://www.islamcan.com/audio/quran/verse/112-001.mp3",
      surah: "Al-Ikhlas",
      ayahNumber: "112:1",
      options: [
        "Say, 'He is Allah, [who is] One'",
        "Allah, the Eternal Refuge",
        "He neither begets nor is born",
        "Nor is there to Him any equivalent"
      ]
    },
    {
      id: 4,
      arabic: "اللَّهُ الصَّمَدُ",
      translation: "Allah, the Eternal Refuge",
      audioUrl: "https://www.islamcan.com/audio/quran/verse/112-002.mp3",
      surah: "Al-Ikhlas",
      ayahNumber: "112:2",
      options: [
        "Nor is there to Him any equivalent",
        "He neither begets nor is born",
        "Allah, the Eternal Refuge",
        "Say, 'He is Allah, [who is] One'"
      ]
    },
    {
      id: 5,
      arabic: "وَالْعَصْرِ",
      translation: "By time",
      audioUrl: "https://www.islamcan.com/audio/quran/verse/103-001.mp3",
      surah: "Al-Asr",
      ayahNumber: "103:1",
      options: [
        "By time",
        "Indeed, mankind is in loss",
        "Except for those who have believed",
        "And enjoin upon each other patience"
      ]
    }
  ];
  
  useEffect(() => {
    if (isPlaying) {
      const shuffled = [...ayahData].sort(() => Math.random() - 0.5);
      setAyahs(shuffled);
      setCurrentAyahIndex(0);
      setScore(0);
      setLives(3);
      setGameOver(false);
      setSelectedOption(null);
    }
  }, [isPlaying]);
  
  useEffect(() => {
    if (lives <= 0 && isPlaying) {
      setGameOver(true);
      setIsPlaying(false);
      toast({
        title: "Game Over",
        description: `Your final score: ${score}`,
      });
    }
  }, [lives, isPlaying, score]);
  
  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };
  
  const checkAnswer = (option: string) => {
    setSelectedOption(option);
    
    if (option === ayahs[currentAyahIndex].translation) {
      setScore(score + 10);
      toast({
        title: "Correct!",
        description: "+10 points",
        variant: "success"
      });
      
      // Move to next ayah after a short delay
      setTimeout(() => {
        if (currentAyahIndex < ayahs.length - 1) {
          setCurrentAyahIndex(currentAyahIndex + 1);
          setSelectedOption(null);
        } else {
          toast({
            title: "Game Complete!",
            description: `Your final score: ${score + 10}`,
          });
          setGameOver(true);
          setIsPlaying(false);
        }
      }, 1000);
      
    } else {
      setLives(lives - 1);
      toast({
        title: "Incorrect",
        description: `Correct answer: ${ayahs[currentAyahIndex].translation}`,
        variant: "destructive"
      });
      
      // Move to next ayah after a short delay
      setTimeout(() => {
        if (currentAyahIndex < ayahs.length - 1 && lives > 1) {
          setCurrentAyahIndex(currentAyahIndex + 1);
          setSelectedOption(null);
        } else if (lives <= 1) {
          setGameOver(true);
          setIsPlaying(false);
        }
      }, 2000);
    }
  };
  
  const startGame = () => {
    setIsPlaying(true);
  };
  
  const restartGame = () => {
    setIsPlaying(true);
  };
  
  const currentAyah = ayahs[currentAyahIndex];

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Ayah Audio Puzzle</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Listen to Quranic verses and match them with the correct translations
          </p>
        </div>
        
        {!isPlaying && !gameOver ? (
          <div className="max-w-lg mx-auto text-center p-8 bg-card rounded-lg shadow-md">
            <Volume2 className="h-16 w-16 mx-auto mb-4 text-islamic-primary" />
            <h2 className="text-2xl font-bold mb-4">Ayah Audio Challenge</h2>
            <p className="mb-6">Listen carefully to Quranic verses and select the correct translation. Improve your understanding of the Quran through audio recognition.</p>
            <Button size="lg" onClick={startGame}>
              Start Game
            </Button>
          </div>
        ) : gameOver ? (
          <div className="max-w-lg mx-auto text-center p-8 bg-card rounded-lg shadow-md">
            <Award className="h-16 w-16 mx-auto mb-4 text-islamic-primary" />
            <h2 className="text-2xl font-bold mb-4">Game Over</h2>
            <p className="text-xl mb-6">Your final score: {score}</p>
            <Button size="lg" onClick={restartGame}>
              Play Again
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <Badge variant="outline" className="text-lg px-4 py-2">
                Score: {score}
              </Badge>
              <div className="flex items-center gap-1">
                {[...Array(lives)].map((_, i) => (
                  <Heart key={i} className="h-6 w-6 text-islamic-primary fill-islamic-primary" />
                ))}
                {[...Array(3 - lives)].map((_, i) => (
                  <Heart key={i + lives} className="h-6 w-6 text-muted-foreground" />
                ))}
              </div>
            </div>
            
            <Card className="p-6 mb-6">
              <div className="text-center">
                <p className="text-2xl text-right mb-4">{currentAyah?.arabic}</p>
                <audio ref={audioRef} src={currentAyah?.audioUrl} className="hidden" />
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="mx-auto flex items-center gap-2"
                  onClick={playAudio}
                >
                  <Play className="h-5 w-5" />
                  <span>Play Audio</span>
                </Button>
              </div>
            </Card>
            
            <div className="space-y-4 mb-8">
              <h3 className="text-xl font-semibold">Select the correct translation:</h3>
              {currentAyah?.options.map((option, index) => (
                <Card 
                  key={index}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedOption === option 
                      ? option === currentAyah.translation 
                        ? 'bg-green-100 border-green-500' 
                        : 'bg-red-100 border-red-500'
                      : 'hover:border-islamic-primary'
                  }`}
                  onClick={() => !selectedOption && checkAnswer(option)}
                >
                  <p className="text-lg">{option}</p>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-between items-center">
              <Badge variant="outline">
                Surah: {currentAyah?.surah} ({currentAyah?.ayahNumber})
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <span>Verse {currentAyahIndex + 1} of {ayahs.length}</span>
                <ArrowRight className="h-4 w-4" />
              </Badge>
            </div>
          </>
        )}
        
        <div className="mt-8 bg-muted p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">How to Play</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Listen carefully to the audio of the Quranic verse</li>
            <li>Select the correct translation from the options provided</li>
            <li>Earn 10 points for each correct answer</li>
            <li>You have 3 lives - be careful not to lose them all!</li>
          </ul>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AyahAudio;
