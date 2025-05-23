
import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Volume, Award, Clock, Sun, Sunrise, Sunset } from 'lucide-react';

interface SalahTime {
  id: number;
  name: string;
  arabicName: string;
  icon: React.ElementType;
  audioUrl: string;
  matched: boolean;
  selected: boolean;
}

const SoundSalah = () => {
  const [salahTimes, setSalahTimes] = useState<SalahTime[]>([]);
  const [selectedSalah, setSelectedSalah] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const salahData: SalahTime[] = [
    {
      id: 1,
      name: "Fajr",
      arabicName: "الفجر",
      icon: Sunrise,
      audioUrl: "https://islamic-audio-library.com/audio/adhans/fajr_adhan.mp3",
      matched: false,
      selected: false
    },
    {
      id: 2,
      name: "Dhuhr",
      arabicName: "الظهر",
      icon: Sun,
      audioUrl: "https://islamic-audio-library.com/audio/adhans/standard_adhan.mp3",
      matched: false,
      selected: false
    },
    {
      id: 3,
      name: "Asr",
      arabicName: "العصر",
      icon: Sun,
      audioUrl: "https://islamic-audio-library.com/audio/adhans/standard_adhan.mp3",
      matched: false,
      selected: false
    },
    {
      id: 4,
      name: "Maghrib",
      arabicName: "المغرب",
      icon: Sunset,
      audioUrl: "https://islamic-audio-library.com/audio/adhans/standard_adhan.mp3",
      matched: false,
      selected: false
    },
    {
      id: 5,
      name: "Isha",
      arabicName: "العشاء",
      icon: Sunset,
      audioUrl: "https://islamic-audio-library.com/audio/adhans/standard_adhan.mp3",
      matched: false,
      selected: false
    }
  ];

  // Use publicly available adhan audio if the custom URLs fail
  const fallbackAudioUrl = "https://islamcan.com/audio/adhan/azan1.mp3";
  
  useEffect(() => {
    if (isPlaying) {
      const shuffled = [...salahData]
        .map(s => ({ ...s, matched: false, selected: false }))
        .sort(() => Math.random() - 0.5);
      
      setSalahTimes(shuffled);
      setSelectedSalah(null);
      setScore(0);
      setRound(1);
      setTimeLeft(60);
      setGameOver(false);
    }

    // Cleanup any playing audio when component unmounts
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }
    };
  }, [isPlaying]);
  
  useEffect(() => {
    if (timeLeft > 0 && isPlaying && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isPlaying) {
      setGameOver(true);
      setIsPlaying(false);
      toast({
        title: "Time's up!",
        description: `Final score: ${score}`,
      });
    }
  }, [timeLeft, isPlaying, gameOver, score]);
  
  const playAudio = (url: string) => {
    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
    }
    
    // Create and play new audio
    const audio = new Audio(url);
    
    // Add error handling
    audio.onerror = () => {
      console.error(`Error playing audio from URL: ${url}`);
      toast({
        title: "Audio Error",
        description: "Could not play the audio. Trying alternative source...",
        variant: "destructive"
      });
      
      // Try fallback URL if original fails
      const fallbackAudio = new Audio(fallbackAudioUrl);
      fallbackAudio.play().catch(err => {
        console.error("Fallback audio also failed:", err);
        toast({
          title: "Audio Error",
          description: "Audio playback failed. Please check your connection.",
          variant: "destructive"
        });
      });
      
      setCurrentAudio(fallbackAudio);
    };
    
    // Play the audio
    audio.play().catch(err => {
      console.error("Audio playback failed:", err);
      audio.onerror(new ErrorEvent('error'));
    });
    
    setCurrentAudio(audio);
  };
  
  const handleSalahSelect = (id: number) => {
    if (gameOver || salahTimes.find(s => s.id === id)?.matched) {
      return;
    }
    
    if (selectedSalah !== null) {
      if (selectedSalah === id) {
        return;
      }
      
      setSalahTimes(prev => 
        prev.map(s => 
          s.id === id ? { ...s, selected: true } : s
        )
      );
      
      const currentSalah = salahTimes.find(s => s.id === selectedSalah);
      const selectedSalahTime = salahTimes.find(s => s.id === id);
      
      if (currentSalah && selectedSalahTime) {
        if (currentSalah.name === selectedSalahTime.name) {
          setSalahTimes(prev => 
            prev.map(s => 
              (s.id === selectedSalah || s.id === id) 
                ? { ...s, matched: true, selected: false } 
                : s
            )
          );
          
          setScore(score + 10);
          toast({
            title: "Correct!",
            description: `That's the adhan for ${selectedSalahTime.name} prayer time.`,
            variant: "default"
          });
          
          const allMatched = salahTimes.every(s => 
            s.matched || s.id === selectedSalah || s.id === id
          );
          
          if (allMatched) {
            if (round < 3) {
              setTimeout(() => {
                setRound(round + 1);
                const shuffled = [...salahData]
                  .map(s => ({ ...s, matched: false, selected: false }))
                  .sort(() => Math.random() - 0.5);
                setSalahTimes(shuffled);
                setSelectedSalah(null);
                setTimeLeft(60);
                
                toast({
                  title: "Round Complete!",
                  description: `Moving to round ${round + 1}`,
                });
              }, 1500);
            } else {
              setGameOver(true);
              setIsPlaying(false);
              toast({
                title: "Game Complete!",
                description: `Final score: ${score + 10}`,
              });
            }
          }
        } else {
          toast({
            title: "Incorrect match",
            description: "That's not the right prayer time for this Adhan",
            variant: "destructive"
          });
          
          setTimeout(() => {
            setSalahTimes(prev => 
              prev.map(s => 
                (s.id === selectedSalah || s.id === id) 
                  ? { ...s, selected: false } 
                  : s
              )
            );
          }, 1000);
        }
        
        setSelectedSalah(null);
      }
    } else {
      setSelectedSalah(id);
      setSalahTimes(prev => 
        prev.map(s => 
          s.id === id ? { ...s, selected: true } : s
        )
      );
      
      const salah = salahTimes.find(s => s.id === id);
      if (salah) {
        playAudio(salah.audioUrl);
      }
    }
  };
  
  const startGame = () => {
    setIsPlaying(true);
  };
  
  const restartGame = () => {
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Sound & Salah</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Match prayer times with their Adhan melodies
          </p>
        </div>
        
        <audio ref={audioRef} className="hidden" />
        
        {!isPlaying && !gameOver ? (
          <div className="max-w-lg mx-auto text-center p-8 bg-card rounded-lg shadow-md">
            <Volume className="h-16 w-16 mx-auto mb-4 text-islamic-primary" />
            <h2 className="text-2xl font-bold mb-4">Adhan & Prayer Time Challenge</h2>
            <p className="mb-6">Listen to the Adhan (call to prayer) and match it with the correct prayer time. Test your knowledge of Islamic prayer times.</p>
            <Button size="lg" onClick={startGame}>
              Start Game
            </Button>
          </div>
        ) : gameOver ? (
          <div className="max-w-lg mx-auto text-center p-8 bg-card rounded-lg shadow-md">
            <Award className="h-16 w-16 mx-auto mb-4 text-islamic-primary" />
            <h2 className="text-2xl font-bold mb-4">Game Complete!</h2>
            <p className="text-xl mb-6">Your final score: {score}</p>
            <Button size="lg" onClick={restartGame}>
              Play Again
            </Button>
          </div>
        ) : (
          <>
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
                className={`text-lg px-4 py-2 flex items-center gap-2 ${timeLeft < 20 ? 'bg-red-100 text-red-800' : ''}`}
              >
                <Clock className="h-5 w-5" />
                <span>Time: {timeLeft}s</span>
              </Badge>
            </div>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">Match the Adhan with its Prayer Time</h2>
              <p className="text-muted-foreground">Click on a prayer time to hear its Adhan, then match it with another prayer time</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {salahTimes.map(salah => {
                const Icon = salah.icon;
                return (
                  <Card 
                    key={salah.id}
                    className={`p-6 cursor-pointer transition-all ${
                      salah.matched ? 'bg-green-100 border-green-500' : 
                      salah.selected ? 'bg-islamic-primary/10 border-islamic-primary' : 
                      'hover:border-islamic-primary'
                    }`}
                    onClick={() => handleSalahSelect(salah.id)}
                  >
                    <div className="text-center">
                      <Icon className="h-12 w-12 mx-auto mb-3 text-islamic-primary" />
                      <h3 className="text-xl font-bold mb-1">{salah.name}</h3>
                      <p className="text-lg font-arabic">{salah.arabicName}</p>
                      
                      {salah.selected && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="mt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            playAudio(salah.audioUrl);
                          }}
                        >
                          <Volume className="h-4 w-4 mr-1" /> Play Adhan
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}
        
        <div className="mt-8 bg-muted p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">How to Play</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Click on a prayer time to hear its Adhan</li>
            <li>Match it with the same prayer time to create a pair</li>
            <li>Complete all matches before time runs out</li>
            <li>Each correct match earns 10 points</li>
          </ul>
        </div>
        
        <div className="mt-4 bg-muted p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">About the Five Daily Prayers</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li><strong>Fajr:</strong> Dawn prayer, performed before sunrise</li>
            <li><strong>Dhuhr:</strong> Midday prayer, performed after the sun passes its zenith</li>
            <li><strong>Asr:</strong> Afternoon prayer, performed in the late afternoon</li>
            <li><strong>Maghrib:</strong> Sunset prayer, performed just after sunset</li>
            <li><strong>Isha:</strong> Night prayer, performed in the evening when it's dark</li>
          </ul>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SoundSalah;
