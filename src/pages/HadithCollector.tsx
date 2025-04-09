
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Book, PlusCircle, Check } from 'lucide-react';

interface HadithData {
  id: number;
  category: string;
  arabic: string;
  translation: string;
  source: string;
}

const HadithCollector = () => {
  const [hadiths, setHadiths] = useState<HadithData[]>([]);
  const [newHadith, setNewHadith] = useState<Omit<HadithData, 'id'>>({
    category: '',
    arabic: '',
    translation: '',
    source: ''
  });
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [score, setScore] = useState(0);
  const [hadithsCollected, setHadithsCollected] = useState(0);
  const [showForm, setShowForm] = useState(false);

  // Sample Hadith data
  const sampleHadiths: HadithData[] = [
    {
      id: 1,
      category: "Purity",
      arabic: "الطُّهُورُ شَطْرُ الْإِيمَانِ",
      translation: "Purity is half of faith.",
      source: "Sahih Muslim"
    },
    {
      id: 2,
      category: "Knowledge",
      arabic: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ",
      translation: "Whoever takes a path upon which to obtain knowledge, Allah makes the path to Paradise easy for him.",
      source: "Sahih Muslim"
    },
    {
      id: 3,
      category: "Kindness",
      arabic: "مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ",
      translation: "Charity does not decrease wealth.",
      source: "Sahih Muslim"
    },
    {
      id: 4,
      category: "Prayer",
      arabic: "إِذَا سَمِعْتُمُ الْمُؤَذِّنَ فَقُولُوا مِثْلَ مَا يَقُولُ",
      translation: "When you hear the Mu'adhdhin, repeat what he says.",
      source: "Sahih al-Bukhari"
    },
    {
      id: 5,
      category: "Fasting",
      arabic: "مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ",
      translation: "Whoever fasts in Ramadan out of faith and in the hope of reward, his previous sins will be forgiven.",
      source: "Sahih al-Bukhari"
    }
  ];

  // Initialize or load hadiths
  useEffect(() => {
    // In a real app, this would be loaded from local storage or a database
    setHadiths(sampleHadiths);
    setHadithsCollected(sampleHadiths.length);
  }, []);

  // Handle input change for new hadith form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewHadith(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new hadith to collection
  const addHadith = () => {
    if (!newHadith.category || !newHadith.arabic || !newHadith.translation || !newHadith.source) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all fields to add a new hadith.",
        variant: "destructive"
      });
      return;
    }

    const newId = hadiths.length > 0 ? Math.max(...hadiths.map(h => h.id)) + 1 : 1;
    const hadithToAdd = { id: newId, ...newHadith };
    setHadiths([...hadiths, hadithToAdd]);
    setHadithsCollected(hadithsCollected + 1);
    setScore(score + 15);
    setNewHadith({
      category: '',
      arabic: '',
      translation: '',
      source: ''
    });
    setShowForm(false);
    toast({
      title: "Hadith Collected!",
      description: `You've added a new hadith to your collection on ${hadithToAdd.category}`,
      variant: "default"
    });
  };

  // Filter hadiths by category
  const filteredHadiths = categoryFilter === 'All'
    ? hadiths
    : hadiths.filter(hadith => hadith.category === categoryFilter);

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Hadith Collector</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Collect authentic hadiths across various themes and build your knowledge.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-3/5">
            <Card className="p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <Badge variant="outline" className="px-3 py-1 text-base">
                  Score: {score}
                </Badge>
                <Badge variant="outline" className="px-3 py-1 text-base">
                  Hadiths: {hadithsCollected}
                </Badge>
              </div>

              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Hadith Collection</h2>
                <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)}>
                  {showForm ? "Hide Form" : "Add Hadith"}
                  <PlusCircle className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {showForm && (
                <div className="mb-4">
                  <Input
                    type="text"
                    name="category"
                    placeholder="Category (e.g., Prayer, Fasting)"
                    value={newHadith.category}
                    onChange={handleInputChange}
                    className="mb-2"
                  />
                  <Textarea
                    name="arabic"
                    placeholder="Arabic Text"
                    value={newHadith.arabic}
                    onChange={handleInputChange}
                    className="mb-2 font-arabic text-xl"
                    dir="rtl"
                  />
                  <Textarea
                    name="translation"
                    placeholder="Translation"
                    value={newHadith.translation}
                    onChange={handleInputChange}
                    className="mb-2"
                  />
                  <Input
                    type="text"
                    name="source"
                    placeholder="Source (e.g., Sahih al-Bukhari)"
                    value={newHadith.source}
                    onChange={handleInputChange}
                    className="mb-2"
                  />
                  <Button onClick={addHadith}>Add to Collection</Button>
                </div>
              )}

              <div className="space-y-3">
                {filteredHadiths.map(hadith => (
                  <Card key={hadith.id} className="p-4 bg-muted">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{hadith.category}</h3>
                        <p className="text-right font-arabic text-xl">{hadith.arabic}</p>
                      </div>
                      <Check className="h-5 w-5 text-islamic-primary" />
                    </div>
                    <p className="mb-1">{hadith.translation}</p>
                    <p className="text-sm text-muted-foreground">Source: {hadith.source}</p>
                  </Card>
                ))}
                {filteredHadiths.length === 0 && (
                  <p className="text-muted-foreground">No hadiths found in this category.</p>
                )}
              </div>
            </Card>
          </div>

          <div className="md:w-2/5">
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Filter by Category</h2>
              <div className="space-y-2">
                {['All', 'Purity', 'Knowledge', 'Kindness', 'Prayer', 'Fasting'].map(category => (
                  <Button
                    key={category}
                    variant={categoryFilter === category ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setCategoryFilter(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Book className="mr-2 h-5 w-5" />
                Why Collect Hadiths?
              </h2>
              <p className="mb-4">
                Collecting hadiths is a way to preserve the teachings and practices of Prophet Muhammad (peace be upon him).
                Each hadith provides guidance on various aspects of life, from worship to ethics.
              </p>
              <p>
                By collecting and studying hadiths, you deepen your understanding of Islam and strengthen your connection
                with the Prophet's wisdom.
              </p>
            </Card>
          </div>
        </div>

        <div className="mt-8 bg-muted p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">How to Play</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Collect hadiths by adding them to your collection</li>
            <li>Filter hadiths by category to focus on specific themes</li>
            <li>Earn points for each hadith you collect</li>
            <li>Study the hadiths to deepen your understanding of Islam</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HadithCollector;
