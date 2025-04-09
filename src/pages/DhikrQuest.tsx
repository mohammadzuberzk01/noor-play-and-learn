import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { Heart, Check, Star, Award, Calendar, BookOpen } from 'lucide-react';

interface Dhikr {
  id: number;
  arabic: string;
  transliteration: string;
  translation: string;
  virtue: string;
  count: number;
  target: number;
  category: string;
}

const DhikrQuest = () => {
  const [dhikrs, setDhikrs] = useState<Dhikr[]>([]);
  const [activeCategory, setActiveCategory] = useState('morning');
  const [streakDays, setStreakDays] = useState(0);
  const [dailyProgress, setDailyProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  const STORAGE_KEY_DHIKRS = 'islamic-games-dhikr-quest-dhikrs';
  const STORAGE_KEY_STREAK = 'islamic-games-dhikr-quest-streak';
  const STORAGE_KEY_LAST_COMPLETED = 'islamic-games-dhikr-quest-last-completed';
  
  const dhikrData: Dhikr[] = [
    {
      id: 1,
      arabic: "سُبْحَانَ اللَّهِ",
      transliteration: "Subhan Allah",
      translation: "Glory be to Allah",
      virtue: "Saying 'Subhan Allah' 100 times a day will be forgiven 1000 sins",
      count: 0,
      target: 33,
      category: "morning"
    },
    {
      id: 2,
      arabic: "الْحَمْدُ لِلَّهِ",
      transliteration: "Alhamdulillah",
      translation: "All praise is due to Allah",
      virtue: "Saying 'Alhamdulillah' fills the scales of good deeds",
      count: 0,
      target: 33,
      category: "morning"
    },
    {
      id: 3,
      arabic: "اللَّهُ أَكْبَرُ",
      transliteration: "Allahu Akbar",
      translation: "Allah is the Greatest",
      virtue: "Saying 'Allahu Akbar' 34 times after each prayer is rewarded greatly",
      count: 0,
      target: 34,
      category: "morning"
    },
    {
      id: 4,
      arabic: "لَا إِلَهَ إِلَّا اللَّهُ",
      transliteration: "La ilaha illallah",
      translation: "There is no god but Allah",
      virtue: "The best thing I and the Prophets before me have said is 'La ilaha illallah'",
      count: 0,
      target: 100,
      category: "anytime"
    },
    {
      id: 5,
      arabic: "أَسْتَغْفِرُ اللَّهَ",
      transliteration: "Astaghfirullah",
      translation: "I seek forgiveness from Allah",
      virtue: "Whoever says 'Astaghfirullah' often, Allah will make a way out for him from every difficulty",
      count: 0,
      target: 100,
      category: "anytime"
    },
    {
      id: 6,
      arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
      transliteration: "La hawla wala quwwata illa billah",
      translation: "There is no might nor power except with Allah",
      virtue: "It is a treasure from the treasures of Paradise",
      count: 0,
      target: 10,
      category: "anytime"
    },
    {
      id: 7,
      arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ",
      transliteration: "Allahumma salli 'ala Muhammad",
      translation: "O Allah, send blessings upon Muhammad",
      virtue: "Whoever sends blessings on me once, Allah will send blessings on him ten times",
      count: 0,
      target: 10,
      category: "anytime"
    },
    {
      id: 8,
      arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
      transliteration: "A'udhu billahi minash shaytanir rajim",
      translation: "I seek refuge in Allah from the accursed Satan",
      virtue: "Protection from the whispers of Shaytan",
      count: 0,
      target: 7,
      category: "evening"
    },
    {
      id: 9,
      arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ",
      transliteration: "Allahumma inni as'alukal 'afwa wal 'afiyah",
      translation: "O Allah, I ask You for pardon and well-being",
      virtue: "Protection and well-being in this life and the next",
      count: 0,
      target: 3,
      category: "evening"
    },
    {
      id: 10,
      arabic: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا وَرَسُولًا",
      transliteration: "Raditu billahi rabban, wa bil-islami dinan, wa bi-Muhammadin nabiyyan wa rasula",
      translation: "I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad as my Prophet and Messenger",
      virtue: "Whoever says this in the morning, Allah has promised to please him on the Day of Resurrection",
      count: 0,
      target: 3,
      category: "morning"
    }
  ];
  
  useEffect(() => {
    const storedDhikrs = localStorage.getItem(STORAGE_KEY_DHIKRS);
    const storedStreak = localStorage.getItem(STORAGE_KEY_STREAK);
    const lastCompleted = localStorage.getItem(STORAGE_KEY_LAST_COMPLETED);
    
    if (lastCompleted && lastCompleted !== today) {
      setDhikrs(dhikrData.map(d => ({ ...d, count: 0 })));
      setIsComplete(false);
    } else if (storedDhikrs) {
      setDhikrs(JSON.parse(storedDhikrs));
      const storedDhikrsData = JSON.parse(storedDhikrs);
      const allComplete = storedDhikrsData.every((d: Dhikr) => d.count >= d.target);
      setIsComplete(allComplete);
    } else {
      setDhikrs(dhikrData);
    }
    
    if (storedStreak) {
      setStreakDays(parseInt(storedStreak, 10));
    }
    
    updateDailyProgress();
  }, []);
  
  useEffect(() => {
    if (dhikrs.length > 0) {
      localStorage.setItem(STORAGE_KEY_DHIKRS, JSON.stringify(dhikrs));
      updateDailyProgress();
      
      const allComplete = dhikrs.every(d => d.count >= d.target);
      
      if (allComplete && !isComplete) {
        setIsComplete(true);
        const today = new Date().toDateString();
        localStorage.setItem(STORAGE_KEY_LAST_COMPLETED, today);
        
        const newStreak = streakDays + 1;
        setStreakDays(newStreak);
        localStorage.setItem(STORAGE_KEY_STREAK, newStreak.toString());
        
        toast({
          title: "Daily Dhikr Complete!",
          description: `You've completed your daily dhikr. Current streak: ${newStreak} days!`,
          variant: "default"
        });
      }
    }
  }, [dhikrs, isComplete, streakDays]);
  
  const updateDailyProgress = () => {
    if (dhikrs.length === 0) return;
    
    const totalTargets = dhikrs.reduce((sum, d) => sum + d.target, 0);
    const totalCompleted = dhikrs.reduce((sum, d) => sum + Math.min(d.count, d.target), 0);
    const progress = Math.round((totalCompleted / totalTargets) * 100);
    
    setDailyProgress(progress);
  };
  
  const incrementDhikr = (id: number) => {
    setDhikrs(prev => 
      prev.map(d => 
        d.id === id 
          ? { ...d, count: d.count + 1 } 
          : d
      )
    );
    
    const dhikr = dhikrs.find(d => d.id === id);
    if (dhikr && dhikr.count + 1 === dhikr.target) {
      toast({
        title: "Target Reached!",
        description: `You've completed your target for "${dhikr.transliteration}"`,
        variant: "default"
      });
    }
  };
  
  const resetAllCounts = () => {
    setDhikrs(prev => prev.map(d => ({ ...d, count: 0 })));
    setIsComplete(false);
    toast({
      title: "Counts Reset",
      description: "All dhikr counts have been reset to zero",
    });
  };
  
  const resetStreak = () => {
    setStreakDays(0);
    localStorage.setItem(STORAGE_KEY_STREAK, '0');
    toast({
      title: "Streak Reset",
      description: "Your streak has been reset to zero days",
    });
  };
  
  const filteredDhikrs = dhikrs.filter(d => d.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Daily Dhikr Quest</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your daily remembrance of Allah and build a consistent routine
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <Card className="p-6 flex-1">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Calendar className="h-6 w-6 text-islamic-primary" />
                Daily Progress
              </h2>
              <Badge variant="outline" className={dailyProgress === 100 ? 'bg-green-100 text-green-800' : ''}>
                {dailyProgress}% Complete
              </Badge>
            </div>
            <Progress value={dailyProgress} className="h-2 mb-4" />
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Daily dhikr progress</p>
              </div>
              {isComplete && (
                <Badge className="bg-islamic-primary">Completed Today</Badge>
              )}
            </div>
          </Card>
          
          <Card className="p-6 flex-1">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Award className="h-6 w-6 text-islamic-primary" />
                Dhikr Streak
              </h2>
              <Badge variant={streakDays > 0 ? 'default' : 'outline'} className="text-lg">
                {streakDays} {streakDays === 1 ? 'day' : 'days'}
              </Badge>
            </div>
            <div className="flex items-center gap-1 mb-4">
              {[...Array(7)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-5 w-5 ${i < (streakDays % 7) ? 'text-islamic-gold fill-islamic-gold' : 'text-muted-foreground'}`} 
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">Complete all dhikr daily to build your streak</p>
          </Card>
        </div>
        
        <div className="mb-6">
          <div className="flex space-x-2 mb-4">
            <Button 
              variant={activeCategory === 'morning' ? 'default' : 'outline'} 
              onClick={() => setActiveCategory('morning')}
            >
              Morning Adhkar
            </Button>
            <Button 
              variant={activeCategory === 'evening' ? 'default' : 'outline'} 
              onClick={() => setActiveCategory('evening')}
            >
              Evening Adhkar
            </Button>
            <Button 
              variant={activeCategory === 'anytime' ? 'default' : 'outline'} 
              onClick={() => setActiveCategory('anytime')}
            >
              Anytime Dhikr
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {filteredDhikrs.map(dhikr => (
            <Card key={dhikr.id} className="p-6">
              <div className="flex flex-col h-full">
                <div className="mb-3">
                  <p className="text-xl text-right font-arabic mb-1">{dhikr.arabic}</p>
                  <p className="text-sm italic">{dhikr.transliteration}</p>
                  <p className="text-sm text-muted-foreground">{dhikr.translation}</p>
                </div>
                
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground italic">{dhikr.virtue}</p>
                </div>
                
                <div className="mt-4 pt-3 border-t flex items-center justify-between">
                  <div>
                    <Badge 
                      className={dhikr.count >= dhikr.target ? 'bg-green-100 text-green-800 flex items-center gap-1' : ''}
                    >
                      {dhikr.count >= dhikr.target && <Check className="h-3 w-3" />}
                      {dhikr.count}/{dhikr.target}
                    </Badge>
                  </div>
                  
                  <Button 
                    size="sm" 
                    onClick={() => incrementDhikr(dhikr.id)}
                    disabled={isComplete}
                    className="flex items-center gap-1"
                  >
                    <Heart className="h-4 w-4" />
                    <span>Record</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-center gap-3 mb-8">
          <Button variant="outline" onClick={resetAllCounts}>
            Reset Today's Counts
          </Button>
          <Button variant="outline" onClick={resetStreak}>
            Reset Streak
          </Button>
        </div>
        
        <div className="bg-muted p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <BookOpen className="h-6 w-6 text-islamic-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-2">About Dhikr (Remembrance)</h3>
              <p className="text-muted-foreground mb-2">
                The Messenger of Allah ﷺ said: "The example of the one who remembers his Lord and the one who does not remember his Lord is like the example of the living and the dead." (Bukhari)
              </p>
              <p className="text-muted-foreground mb-2">
                Regular dhikr (remembrance of Allah) brings peace to the heart, as Allah says in the Quran: "Verily, in the remembrance of Allah do hearts find rest." (13:28)
              </p>
              <p className="text-muted-foreground">
                Use this tool to develop a consistent habit of dhikr throughout your day.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DhikrQuest;
