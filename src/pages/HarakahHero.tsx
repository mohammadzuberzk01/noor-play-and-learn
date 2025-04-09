
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Book, AlertCircle, Check } from 'lucide-react';

interface WordData {
  id: number;
  word: string;
  correctHarakah: string[];
  meaning: string;
  hint: string;
  ayah?: {
    arabic: string;
    translation: string;
    reference: string;
  };
}

const HarakahHero = () => {
  const [currentWord, setCurrentWord] = useState<WordData | null>(null);
  const [wordWithHarakah, setWordWithHarakah] = useState<string[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [showAyah, setShowAyah] = useState(false);
  
  // Harakah options
  const harakahOptions = [
    { symbol: 'َ', name: 'Fatha', transliteration: 'a' },
    { symbol: 'ِ', name: 'Kasra', transliteration: 'i' },
    { symbol: 'ُ', name: 'Damma', transliteration: 'u' },
    { symbol: 'ْ', name: 'Sukoon', transliteration: 'silent' },
    { symbol: 'ّ', name: 'Shadda', transliteration: 'double' }
  ];

  // Sample Word data for the game
  const wordData: WordData[] = [
    {
      id: 1,
      word: "كتب",
      correctHarakah: ['َ', 'َ', 'َ'], // kataba
      meaning: "He wrote",
      hint: "Past tense verb with fatha on all letters",
      ayah: {
        arabic: "كَتَبَ اللَّهُ لَأَغْلِبَنَّ أَنَا وَرُسُلِي",
        translation: "Allah has decreed: 'It is I and My messengers who will prevail'",
        reference: "Surah Al-Mujadila 58:21"
      }
    },
    {
      id: 2,
      word: "علم",
      correctHarakah: ['ِ', 'ْ', 'ٌ'], // 'ilmun
      meaning: "Knowledge",
      hint: "Noun with kasra on first letter, sukoon on second, and double damma at the end",
      ayah: {
        arabic: "وَمَا أُوتِيتُم مِّنَ الْعِلْمِ إِلَّا قَلِيلًا",
        translation: "And mankind has not been given of knowledge except a little",
        reference: "Surah Al-Isra 17:85"
      }
    },
    {
      id: 3,
      word: "قلب",
      correctHarakah: ['َ', 'ْ', 'ٌ'], // qalbun
      meaning: "Heart",
      hint: "Noun with fatha on first letter, sukoon on second",
      ayah: {
        arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
        translation: "Unquestionably, by the remembrance of Allah hearts are assured",
        reference: "Surah Ar-Ra'd 13:28"
      }
    },
    {
      id: 4,
      word: "حمد",
      correctHarakah: ['َ', 'ْ', 'ٌ'], // Hamdun
      meaning: "Praise",
      hint: "Noun with fatha on first letter, sukoon on second",
      ayah: {
        arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        translation: "Praise be to Allah, Lord of the worlds",
        reference: "Surah Al-Fatihah 1:2"
      }
    },
    {
      id: 5,
      word: "نصر",
      correctHarakah: ['َ', 'َ', 'َ'], // nasara
      meaning: "He helped",
      hint: "Past tense verb with fatha on all letters",
      ayah: {
        arabic: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ",
        translation: "When the victory of Allah has come and the conquest",
        reference: "Surah An-Nasr 110:1"
      }
    },
    {
      id: 6,
      word: "مسلم",
      correctHarakah: ['ُ', 'ْ', 'ِ', 'ٌ'], // muslimun
      meaning: "Muslim (one who submits)",
      hint: "Noun with damma on first letter, sukoon on second, kasra on third",
      ayah: {
        arabic: "إِنَّ الْمُسْلِمِينَ وَالْمُسْلِمَاتِ",
        translation: "Indeed, the Muslim men and Muslim women",
        reference: "Surah Al-Ahzab 33:35"
      }
    },
    {
      id: 7,
      word: "يكتب",
      correctHarakah: ['َ', 'ْ', 'ُ', 'ُ'], // yaktubu
      meaning: "He writes",
      hint: "Present tense verb with fatha on first letter, sukoon on second, damma on third",
      ayah: {
        arabic: "وَلَا يَكْتُبَ كَاتِبٌ أَن يَكْتُبَ كَمَا عَلَّمَهُ اللَّهُ",
        translation: "Let a scribe write it between you in justice",
        reference: "Surah Al-Baqarah 2:282"
      }
    }
  ];

  // Initialize or load new word
  const loadNewWord = () => {
    // Select a word based on the current level
    const wordPool = wordData.filter(word => 
      level === 1 ? word.correctHarakah.length <= 3 : true
    );
    
    const wordIndex = Math.floor(Math.random() * wordPool.length);
    const selectedWord = wordPool[wordIndex];
    
    setCurrentWord(selectedWord);
    setWordWithHarakah(Array(selectedWord.word.length).fill(''));
    setSelectedLetter(null);
    setShowAyah(false);
  };

  // Initialize game
  useEffect(() => {
    loadNewWord();
  }, [level]);

  // Handle letter selection
  const handleLetterClick = (index: number) => {
    setSelectedLetter(index);
  };

  // Handle harakah selection
  const handleHarakahClick = (harakah: string) => {
    if (selectedLetter === null || !currentWord) return;
    
    const newWordWithHarakah = [...wordWithHarakah];
    newWordWithHarakah[selectedLetter] = harakah;
    setWordWithHarakah(newWordWithHarakah);
    
    // Move selection to next letter automatically
    if (selectedLetter < currentWord.word.length - 1) {
      setSelectedLetter(selectedLetter + 1);
    } else {
      setSelectedLetter(null);
    }
    
    // Check if all letters have harakah
    if (!newWordWithHarakah.includes('')) {
      checkAnswer(newWordWithHarakah);
    }
  };

  // Check if answer is correct
  const checkAnswer = (answer: string[]) => {
    if (!currentWord) return;
    
    // Check if each harakah is correct
    const isCorrect = answer.every((harakah, index) => 
      harakah === currentWord.correctHarakah[index]
    );
    
    if (isCorrect) {
      // Calculate points (base score - penalty for hints used)
      const points = Math.max(10 - hintsUsed * 2, 3);
      setScore(score + points);
      setWordsCompleted(wordsCompleted + 1);
      
      toast({
        title: "Correct!",
        description: `Perfect! You earned ${points} points.`,
        variant: "default"
      });
      
      // Show ayah with this word
      setShowAyah(true);
      
      // After a delay, load next word
      setTimeout(() => {
        if (wordsCompleted + 1 >= 5 && level < 3) {
          // Level up after 5 words
          setLevel(level + 1);
          setWordsCompleted(0);
          toast({
            title: "Level Up!",
            description: `You've advanced to level ${level + 1}.`,
            variant: "default"
          });
        } else {
          loadNewWord();
        }
        setHintsUsed(0);
      }, 3000);
    } else {
      toast({
        title: "Not Quite Right",
        description: "Check the harakah on each letter and try again.",
        variant: "destructive"
      });
    }
  };

  // Show hint
  const showHint = () => {
    if (!currentWord) return;
    
    setHintsUsed(hintsUsed + 1);
    
    toast({
      title: "Hint",
      description: currentWord.hint,
    });
  };

  // Reset current word
  const resetWord = () => {
    if (!currentWord) return;
    
    setWordWithHarakah(Array(currentWord.word.length).fill(''));
    setSelectedLetter(null);
  };

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Harakah Hero</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Master the short vowels (fatha, kasra, damma) and other Arabic diacritics
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-3/5">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <Badge variant="outline" className="px-3 py-1 text-base">
                  Level: {level}/3
                </Badge>
                <Badge variant="outline" className="px-3 py-1 text-base">
                  Score: {score}
                </Badge>
                <Badge variant="outline" className="px-3 py-1 text-base">
                  Words: {wordsCompleted}/5
                </Badge>
              </div>
              
              {currentWord && (
                <>
                  <div className="text-center mb-8">
                    <div className="font-bold text-lg mb-4">Add the correct harakah to this word:</div>
                    
                    <div className="flex justify-center gap-4 mb-6">
                      {currentWord.word.split('').map((letter, index) => (
                        <div 
                          key={index}
                          className={`relative cursor-pointer ${
                            selectedLetter === index ? 'text-islamic-primary' : ''
                          }`}
                          onClick={() => handleLetterClick(index)}
                        >
                          <span className="text-4xl font-arabic">{letter}</span>
                          <span className="absolute text-red-500 text-2xl -top-4 right-0">
                            {wordWithHarakah[index]}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-lg mb-2">Meaning: <span className="font-medium">{currentWord.meaning}</span></div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg mb-6">
                    <h3 className="font-semibold mb-3">Select Harakah:</h3>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {harakahOptions.map((option, index) => (
                        <Button 
                          key={index}
                          variant="outline"
                          className="relative min-w-16"
                          onClick={() => handleHarakahClick(option.symbol)}
                          disabled={selectedLetter === null}
                        >
                          <span className="text-2xl text-red-500">{option.symbol}</span>
                          <span className="text-xs block mt-1">{option.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-3">
                    <Button variant="outline" onClick={resetWord}>
                      Reset
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={showHint}
                      className="flex items-center"
                    >
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Hint
                    </Button>
                  </div>
                  
                  {showAyah && currentWord.ayah && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
                      <h3 className="font-bold mb-2 flex items-center">
                        <Check className="h-4 w-4 mr-1 text-green-600" />
                        Example from Qur'an:
                      </h3>
                      <p className="text-lg text-right mb-2 font-arabic">{currentWord.ayah.arabic}</p>
                      <p className="italic mb-1">{currentWord.ayah.translation}</p>
                      <p className="text-sm text-muted-foreground">{currentWord.ayah.reference}</p>
                    </div>
                  )}
                </>
              )}
            </Card>
          </div>
          
          <div className="md:w-2/5">
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Book className="mr-2 h-5 w-5" />
                Understanding Harakah
              </h2>
              <p className="mb-4">
                Harakah (حَرَكة) or diacritics are marks placed above or below Arabic letters 
                to indicate short vowels and other pronunciation features. They're essential 
                for correct recitation of the Qur'an.
              </p>
              
              <div className="space-y-3 mt-4">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-bold">Fatha (فتحة)</span>
                    <span className="text-red-500 text-xl">َ</span>
                  </div>
                  <p className="text-sm">Pronounced as a short "a" sound as in "cat"</p>
                </div>
                
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-bold">Kasra (كسرة)</span>
                    <span className="text-red-500 text-xl">ِ</span>
                  </div>
                  <p className="text-sm">Pronounced as a short "i" sound as in "sit"</p>
                </div>
                
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-bold">Damma (ضمة)</span>
                    <span className="text-red-500 text-xl">ُ</span>
                  </div>
                  <p className="text-sm">Pronounced as a short "u" sound as in "put"</p>
                </div>
                
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-bold">Sukoon (سكون)</span>
                    <span className="text-red-500 text-xl">ْ</span>
                  </div>
                  <p className="text-sm">Indicates the absence of a vowel (makes the letter silent)</p>
                </div>
                
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-bold">Shadda (شدّة)</span>
                    <span className="text-red-500 text-xl">ّ</span>
                  </div>
                  <p className="text-sm">Indicates a doubled consonant</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Level Information</h2>
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  <h3 className="font-medium">Level 1</h3>
                  <p className="text-sm">Simple 2-3 letter words with basic harakah patterns</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <h3 className="font-medium">Level 2</h3>
                  <p className="text-sm">Longer words with more complex harakah combinations</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <h3 className="font-medium">Level 3</h3>
                  <p className="text-sm">Advanced words with challenging harakah patterns</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        <div className="mt-8 bg-muted p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">How to Play</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Click on a letter to select it</li>
            <li>Choose the correct harakah (vowel mark) for each letter</li>
            <li>Complete all letters to check your answer</li>
            <li>Use hints if you're stuck (but you'll earn fewer points)</li>
            <li>Complete 5 words to advance to the next level</li>
          </ul>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HarakahHero;
