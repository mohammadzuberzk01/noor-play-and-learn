
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { BookOpen, Award, Clock } from 'lucide-react';

interface Hadith {
  id: number;
  text: string;
  source: string;
  narrator: string;
  theme: string;
  collected: boolean;
}

const HadithCollector = () => {
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [collectionsCount, setCollectionsCount] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const [timeLeft, setTimeLeft] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Sample hadith data
  const hadithData: Hadith[] = [
    {
      id: 1,
      text: "None of you truly believes until he loves for his brother what he loves for himself.",
      source: "Bukhari & Muslim",
      narrator: "Anas ibn Malik",
      theme: "brotherhood",
      collected: false
    },
    {
      id: 2,
      text: "The most beloved actions to Allah are those performed consistently, even if they are small.",
      source: "Bukhari & Muslim",
      narrator: "Aisha",
      theme: "devotion",
      collected: false
    },
    {
      id: 3,
      text: "Whoever believes in Allah and the Last Day should speak a good word or remain silent.",
      source: "Bukhari & Muslim",
      narrator: "Abu Hurairah",
      theme: "speech",
      collected: false
    },
    {
      id: 4,
      text: "The strong person is not the one who overcomes people through his strength. The strong person is the one who controls himself while in anger.",
      source: "Bukhari",
      narrator: "Abu Hurairah",
      theme: "self-control",
      collected: false
    },
    {
      id: 5,
      text: "A Muslim is the one from whose tongue and hands the Muslims are safe.",
      source: "Bukhari",
      narrator: "Abdullah ibn Amr",
      theme: "character",
      collected: false
    },
    {
      id: 6,
      text: "Verily, the reward of deeds depends upon the intention.",
      source: "Bukhari & Muslim",
      narrator: "Umar ibn Al-Khattab",
      theme: "intention",
      collected: false
    },
    {
      id: 7,
      text: "Seeking knowledge is an obligation upon every Muslim.",
      source: "Ibn Majah",
      narrator: "Anas ibn Malik",
      theme: "knowledge",
      collected: false
    },
    {
      id: 8,
      text: "The believer does not slander, curse, or speak in an obscene or foul manner.",
      source: "Tirmidhi",
      narrator: "Abdullah ibn Masud",
      theme: "speech",
      collected: false
    },
    {
      id: 9,
      text: "Kindness is not found in anything except that it adds to its beauty, and it is not withdrawn from anything except that it makes it defective.",
      source: "Muslim",
      narrator: "Aisha",
      theme: "kindness",
      collected: false
    },
    {
      id: 10,
      text: "Make things easy and do not make them difficult, cheer people up and do not repel them.",
      source: "Bukhari",
      narrator: "Anas ibn Malik",
      theme: "kindness",
      collected: false
    }
  ];
  
  // Initialize or shuffle hadiths
  useEffect(() => {
    if (!isPlaying) return;
    
    const shuffled = [...hadithData]
      .sort(() => Math.random() - 0.5)
      .map(h => ({ ...h, collected: false }));
    
    setHadiths(shuffled);
    setCollectionsCount(0);
  }, [isPlaying]);
  
  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && isPlaying) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isPlaying) {
      endGame();
    }
  }, [timeLeft, isPlaying]);
  
  const collectHadith = (id: number) => {
    setHadiths(hadiths.map(h => 
      h.id === id ? { ...h, collected: true } : h
    ));
    
    setCollectionsCount(collectionsCount + 1);
    
    toast({
      title: "Hadith Collected!",
      description: `${collectionsCount + 1} of ${hadiths.length} collected`,
    });
    
    // Check if all hadiths are collected
    if (collectionsCount + 1 === hadiths.length) {
      toast({
        title: "Mashallah!",
        description: "You have collected all the hadiths!",
        variant: "success"
      });
      endGame();
    }
  };
  
  const startGame = () => {
    setIsPlaying(true);
    setTimeLeft(120);
  };
  
  const endGame = () => {
    setIsPlaying(false);
    
    const percentage = Math.round((collectionsCount / hadiths.length) * 100);
    
    toast({
      title: "Game Over!",
      description: `You collected ${collectionsCount} of ${hadiths.length} hadiths (${percentage}%)`,
    });
  };
  
  const filteredHadiths = hadiths.filter(hadith => {
    if (activeTab === 'all') return true;
    if (activeTab === 'collected') return hadith.collected;
    if (activeTab === 'uncollected') return !hadith.collected;
    return hadith.theme === activeTab;
  });

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Hadith Collector</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Collect authentic hadiths across different themes and narrators
          </p>
        </div>
        
        {!isPlaying ? (
          <div className="max-w-lg mx-auto text-center p-8 bg-card rounded-lg shadow-md">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-islamic-primary" />
            <h2 className="text-2xl font-bold mb-4">Hadith Collection Challenge</h2>
            <p className="mb-6">Explore and collect authentic hadiths within the time limit. Learn from the wisdom of the Prophet Muhammad ﷺ.</p>
            <Button size="lg" onClick={startGame}>
              Start Collection
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-lg px-4 py-2 flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  <span>Collected: {collectionsCount}/{hadiths.length}</span>
                </Badge>
              </div>
              <Badge 
                variant="outline" 
                className={`text-lg px-4 py-2 flex items-center gap-2 ${timeLeft < 30 ? 'bg-red-100 text-red-800' : ''}`}
              >
                <Clock className="h-5 w-5" />
                <span>Time: {timeLeft}s</span>
              </Badge>
            </div>
            
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="brotherhood">Brotherhood</TabsTrigger>
                <TabsTrigger value="character">Character</TabsTrigger>
                <TabsTrigger value="speech">Speech</TabsTrigger>
                <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
                <TabsTrigger value="collected">Collected</TabsTrigger>
                <TabsTrigger value="uncollected">Uncollected</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredHadiths.map(hadith => (
                    <Card 
                      key={hadith.id}
                      className={`p-6 transition-all ${hadith.collected ? 'bg-islamic-primary/10 border-islamic-primary' : ''}`}
                    >
                      <p className="text-lg mb-4">{hadith.text}</p>
                      <div className="flex justify-between items-center mt-4">
                        <div>
                          <p className="text-sm font-medium">{hadith.narrator}</p>
                          <p className="text-xs text-muted-foreground">{hadith.source}</p>
                        </div>
                        <div>
                          {hadith.collected ? (
                            <Badge className="bg-islamic-primary">Collected</Badge>
                          ) : (
                            <Button size="sm" onClick={() => collectHadith(hadith.id)}>
                              Collect
                            </Button>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline" className="mt-3">{hadith.theme}</Badge>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
        
        <div className="mt-8 bg-muted p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">How to Play</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Read through the hadiths and click "Collect" to add them to your collection</li>
            <li>Try to collect all hadiths before time runs out</li>
            <li>Use the tabs to filter hadiths by theme</li>
            <li>Learn and reflect on the wisdom in each hadith</li>
          </ul>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HadithCollector;
