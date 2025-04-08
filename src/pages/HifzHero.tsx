
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Star, Brain, Award, Play, Pause, RotateCcw, Volume, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

interface Surah {
  name: string;
  translation: string;
  verses: {
    arabic: string;
    translation: string;
  }[];
}

const surahs: Surah[] = [
  {
    name: "سُورَةُ الْفَاتِحَة",
    translation: "Al-Fatihah (The Opening)",
    verses: [
      {
        arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful."
      },
      {
        arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        translation: "All praise is due to Allah, Lord of the worlds."
      },
      {
        arabic: "الرَّحْمَٰنِ الرَّحِيمِ",
        translation: "The Entirely Merciful, the Especially Merciful."
      },
      {
        arabic: "مَالِكِ يَوْمِ الدِّينِ",
        translation: "Sovereign of the Day of Recompense."
      },
      {
        arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
        translation: "It is You we worship and You we ask for help."
      },
      {
        arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
        translation: "Guide us to the straight path."
      },
      {
        arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
        translation: "The path of those upon whom You have bestowed favor, not of those who have earned [Your] anger or of those who are astray."
      }
    ]
  },
  {
    name: "سورة الإخلاص",
    translation: "Al-Ikhlas (Sincerity)",
    verses: [
      {
        arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful."
      },
      {
        arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
        translation: "Say, 'He is Allah, [who is] One.'"
      },
      {
        arabic: "اللَّهُ الصَّمَدُ",
        translation: "Allah, the Eternal Refuge."
      },
      {
        arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
        translation: "He neither begets nor is born."
      },
      {
        arabic: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
        translation: "Nor is there to Him any equivalent.'"
      }
    ]
  },
  {
    name: "سورة الفلق",
    translation: "Al-Falaq (The Daybreak)",
    verses: [
      {
        arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful."
      },
      {
        arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
        translation: "Say, 'I seek refuge in the Lord of daybreak.'"
      },
      {
        arabic: "مِن شَرِّ مَا خَلَقَ",
        translation: "From the evil of that which He created."
      },
      {
        arabic: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
        translation: "And from the evil of darkness when it settles."
      },
      {
        arabic: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ",
        translation: "And from the evil of the blowers in knots."
      },
      {
        arabic: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
        translation: "And from the evil of an envier when he envies.'"
      }
    ]
  },
  {
    name: "سورة الناس",
    translation: "An-Nas (Mankind)",
    verses: [
      {
        arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful."
      },
      {
        arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
        translation: "Say, 'I seek refuge in the Lord of mankind.'"
      },
      {
        arabic: "مَلِكِ النَّاسِ",
        translation: "The Sovereign of mankind."
      },
      {
        arabic: "إِلَٰهِ النَّاسِ",
        translation: "The God of mankind."
      },
      {
        arabic: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
        translation: "From the evil of the retreating whisperer."
      },
      {
        arabic: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ",
        translation: "Who whispers [evil] into the breasts of mankind."
      },
      {
        arabic: "مِنَ الْجِنَّةِ وَالنَّاسِ",
        translation: "From among the jinn and mankind.'"
      }
    ]
  }
];

const HifzHero: React.FC = () => {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [memorizationLevel, setMemorizationLevel] = useState<number>(1); // 1 to 5
  const [currentMode, setCurrentMode] = useState<'learn' | 'practice' | 'test'>('learn');
  const [hiddenVerses, setHiddenVerses] = useState<boolean[]>([]);
  const [practiceIndex, setPracticeIndex] = useState<number>(0);
  const [showTranslation, setShowTranslation] = useState<boolean>(true);
  const [score, setScore] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [testAnswer, setTestAnswer] = useState<string>('');
  const [testVerse, setTestVerse] = useState<{arabic: string, translation: string} | null>(null);
  const [testOptions, setTestOptions] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<{correct: number, total: number}>({correct: 0, total: 0});

  const selectSurah = (surah: Surah) => {
    setSelectedSurah(surah);
    setMemorizationLevel(1);
    setHiddenVerses(new Array(surah.verses.length).fill(false));
    setPracticeIndex(0);
    setCurrentMode('learn');
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
    setTestResults({correct: 0, total: 0});
    
    toast(`Selected: ${surah.translation}`);
  };

  const increaseMemorizationLevel = () => {
    if (memorizationLevel < 5) {
      setMemorizationLevel(prev => prev + 1);
      
      // Increase the difficulty by hiding more verses
      if (selectedSurah) {
        const newHidden = [...hiddenVerses];
        const totalVerses = selectedSurah.verses.length;
        const versesToHide = Math.ceil((memorizationLevel + 1) * totalVerses / 5);
        
        // Reset all to visible first
        for (let i = 0; i < newHidden.length; i++) {
          newHidden[i] = false;
        }
        
        // Then hide a percentage based on level
        const indices = Array.from({ length: totalVerses }, (_, i) => i);
        for (let i = 0; i < versesToHide; i++) {
          const randomIndex = Math.floor(Math.random() * indices.length);
          const verseIndex = indices.splice(randomIndex, 1)[0];
          newHidden[verseIndex] = true;
        }
        
        setHiddenVerses(newHidden);
      }
      
      toast(`Memorization level increased to ${memorizationLevel + 1}`);
    }
  };

  const decreaseMemorizationLevel = () => {
    if (memorizationLevel > 1) {
      setMemorizationLevel(prev => prev - 1);
      
      // Decrease the difficulty by showing more verses
      if (selectedSurah) {
        const newHidden = [...hiddenVerses];
        const totalVerses = selectedSurah.verses.length;
        const versesToHide = Math.ceil((memorizationLevel - 1) * totalVerses / 5);
        
        // Reset all to visible first
        for (let i = 0; i < newHidden.length; i++) {
          newHidden[i] = false;
        }
        
        // Then hide a percentage based on level
        const indices = Array.from({ length: totalVerses }, (_, i) => i);
        for (let i = 0; i < versesToHide; i++) {
          const randomIndex = Math.floor(Math.random() * indices.length);
          const verseIndex = indices.splice(randomIndex, 1)[0];
          newHidden[verseIndex] = true;
        }
        
        setHiddenVerses(newHidden);
      }
      
      toast(`Memorization level decreased to ${memorizationLevel - 1}`);
    }
  };

  const togglePracticeMode = () => {
    if (currentMode === 'practice') {
      setCurrentMode('learn');
      setPracticeIndex(0);
    } else {
      setCurrentMode('practice');
      setPracticeIndex(0);
      setIsPaused(false);
    }
  };

  const startTestMode = () => {
    if (!selectedSurah) return;
    
    setCurrentMode('test');
    setTestResults({correct: 0, total: 0});
    generateTestQuestion();
  };

  const generateTestQuestion = () => {
    if (!selectedSurah) return;
    
    // Select a random verse as the correct answer
    const correctIndex = Math.floor(Math.random() * selectedSurah.verses.length);
    const correctVerse = selectedSurah.verses[correctIndex];
    setTestVerse(correctVerse);
    
    // Generate wrong options from other surahs or other verses
    let wrongOptions: string[] = [];
    
    // Try to get verses from other surahs first
    const otherSurahs = surahs.filter(s => s.name !== selectedSurah.name);
    for (const surah of otherSurahs) {
      if (wrongOptions.length < 3) {
        const randomVerseIndex = Math.floor(Math.random() * surah.verses.length);
        wrongOptions.push(surah.verses[randomVerseIndex].arabic);
      }
    }
    
    // If we need more options, use other verses from the same surah
    while (wrongOptions.length < 3) {
      const randomVerseIndex = Math.floor(Math.random() * selectedSurah.verses.length);
      if (randomVerseIndex !== correctIndex) {
        wrongOptions.push(selectedSurah.verses[randomVerseIndex].arabic);
      }
    }
    
    // Shuffle and combine options
    const allOptions = [correctVerse.arabic, ...wrongOptions];
    setTestOptions(allOptions.sort(() => 0.5 - Math.random()));
  };

  const handleTestAnswer = (answer: string) => {
    if (!testVerse) return;
    
    const isCorrect = answer === testVerse.arabic;
    setTestAnswer(answer);
    
    setTimeout(() => {
      if (isCorrect) {
        setScore(prev => prev + 10);
        setTestResults(prev => ({ 
          correct: prev.correct + 1, 
          total: prev.total + 1 
        }));
        toast.success("Correct! Well done!");
      } else {
        setTestResults(prev => ({ 
          correct: prev.correct, 
          total: prev.total + 1 
        }));
        toast.error("Incorrect. Keep practicing!");
      }
      
      // Generate new question or end test
      if (testResults.total < 9) {
        setTestAnswer('');
        generateTestQuestion();
      } else {
        endGame();
      }
    }, 1500);
  };

  const nextPracticeVerse = () => {
    if (!selectedSurah) return;
    
    if (practiceIndex < selectedSurah.verses.length - 1) {
      setPracticeIndex(prev => prev + 1);
    } else {
      setPracticeIndex(0);
      setIsPaused(true);
      toast("Reached the end of the Surah. Starting from beginning.");
    }
  };

  const previousPracticeVerse = () => {
    if (!selectedSurah) return;
    
    if (practiceIndex > 0) {
      setPracticeIndex(prev => prev - 1);
    } else {
      setPracticeIndex(selectedSurah.verses.length - 1);
      toast("Moved to the last verse of the Surah.");
    }
  };

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  const resetPractice = () => {
    setPracticeIndex(0);
    setIsPaused(false);
    toast("Practice reset to beginning.");
  };

  const endGame = () => {
    setGameOver(true);
    
    const percentage = (testResults.correct / (testResults.total || 1)) * 100;
    
    let message = "";
    if (percentage >= 80) {
      message = "Excellent! You're on your way to becoming a Hafiz!";
    } else if (percentage >= 60) {
      message = "Great job! Keep practicing and you'll improve!";
    } else if (percentage >= 40) {
      message = "Good effort! Regular practice will help you memorize better!";
    } else {
      message = "Keep practicing! Memorization takes time and patience!";
    }
    
    toast(message);
  };

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Hifz Hero</h1>
          <p className="text-lg text-muted-foreground">Memorize the Quran with our interactive learning tools</p>
        </div>
        
        {!gameStarted && !gameOver && (
          <div className="max-w-4xl mx-auto">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Welcome to Hifz Hero</CardTitle>
                <CardDescription>
                  A memorization game to help you learn and remember short Surahs from the Quran
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 mb-6">
                  <div className="flex items-start gap-3">
                    <BookOpen className="h-6 w-6 text-islamic-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Learn Mode</h3>
                      <p className="text-muted-foreground">Read the Surah with gradually increasing difficulty as verses are hidden</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Play className="h-6 w-6 text-islamic-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Practice Mode</h3>
                      <p className="text-muted-foreground">Go through the Surah verse by verse at your own pace</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Brain className="h-6 w-6 text-islamic-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Test Mode</h3>
                      <p className="text-muted-foreground">Test your memorization by identifying the correct verses</p>
                    </div>
                  </div>
                </div>
                
                <h3 className="font-semibold mb-4">Select a Surah to memorize:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {surahs.map((surah, index) => (
                    <Card 
                      key={index} 
                      className="cursor-pointer hover:border-islamic-primary transition-colors"
                      onClick={() => selectSurah(surah)}
                    >
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg text-center">{surah.name}</CardTitle>
                        <CardDescription className="text-center">
                          {surah.translation}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 text-center">
                        <p className="text-sm text-muted-foreground">{surah.verses.length} verses</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {gameStarted && !gameOver && selectedSurah && currentMode === 'learn' && (
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <Button 
                variant="outline" 
                onClick={() => setGameStarted(false)}
                className="flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Choose Different Surah
              </Button>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  onClick={decreaseMemorizationLevel}
                  disabled={memorizationLevel === 1}
                >
                  Easier
                </Button>
                <Badge className="bg-islamic-primary">
                  Level {memorizationLevel}/5
                </Badge>
                <Button 
                  variant="outline" 
                  onClick={increaseMemorizationLevel}
                  disabled={memorizationLevel === 5}
                >
                  Harder
                </Button>
              </div>
            </div>
            
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{selectedSurah.name}</CardTitle>
                  <Badge variant="outline">{selectedSurah.translation}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedSurah.verses.map((verse, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <p className="text-right text-xl mb-2" dir="rtl">
                        {hiddenVerses[index] ? (
                          <Button 
                            variant="ghost" 
                            className="text-islamic-primary"
                            onClick={() => {
                              const newHidden = [...hiddenVerses];
                              newHidden[index] = false;
                              setHiddenVerses(newHidden);
                              setScore(prev => Math.max(0, prev - 5));
                              toast("Verse revealed! (-5 points)");
                            }}
                          >
                            Tap to reveal
                          </Button>
                        ) : (
                          verse.arabic
                        )}
                      </p>
                      {showTranslation && (
                        <p className="text-slate-700 text-sm">
                          {verse.translation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setShowTranslation(prev => !prev)}
                >
                  {showTranslation ? "Hide" : "Show"} Translation
                </Button>
                <div className="flex gap-2">
                  <Button onClick={togglePracticeMode}>
                    Practice Mode
                  </Button>
                  <Button 
                    onClick={startTestMode}
                    className="bg-islamic-primary hover:bg-islamic-primary/90"
                  >
                    Test Myself
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        )}
        
        {gameStarted && !gameOver && selectedSurah && currentMode === 'practice' && (
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <Button 
                variant="outline" 
                onClick={togglePracticeMode}
                className="flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Back to Learn Mode
              </Button>
              
              <Badge className="bg-islamic-primary">
                Verse {practiceIndex + 1}/{selectedSurah.verses.length}
              </Badge>
            </div>
            
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{selectedSurah.name}</CardTitle>
                  <Badge variant="outline">{selectedSurah.translation}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8">
                  <p className="text-center text-2xl mb-4" dir="rtl">
                    {selectedSurah.verses[practiceIndex].arabic}
                  </p>
                  {showTranslation && (
                    <p className="text-slate-700 text-center max-w-lg">
                      {selectedSurah.verses[practiceIndex].translation}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowTranslation(prev => !prev)}
                  >
                    {showTranslation ? "Hide" : "Show"} Translation
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={resetPractice}
                    className="flex items-center gap-1"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={previousPracticeVerse}
                    disabled={isPaused}
                  >
                    Previous
                  </Button>
                  
                  <Button 
                    variant={isPaused ? "default" : "outline"}
                    onClick={togglePause}
                    className="flex items-center gap-1"
                  >
                    {isPaused ? (
                      <>
                        <Play className="h-4 w-4" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Pause className="h-4 w-4" />
                        Pause
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={nextPracticeVerse}
                    disabled={isPaused}
                    className="bg-islamic-primary hover:bg-islamic-primary/90"
                  >
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            <div className="flex justify-center">
              <Button onClick={startTestMode} className="bg-amber-500 hover:bg-amber-600">
                <Brain className="h-4 w-4 mr-2" />
                Test My Memorization
              </Button>
            </div>
          </div>
        )}
        
        {gameStarted && !gameOver && selectedSurah && currentMode === 'test' && testVerse && (
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <Badge variant="outline">
                Score: {score}
              </Badge>
              
              <Badge className="bg-amber-500 text-white">
                Question {testResults.total + 1}/10
              </Badge>
              
              <Badge variant="outline" className={testResults.correct > 0 ? "bg-green-100 text-green-800" : ""}>
                Correct: {testResults.correct}
              </Badge>
            </div>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-center">Which verse matches this translation?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center p-4 bg-slate-50 rounded-lg border mb-6">
                  {testVerse.translation}
                </p>
                
                <div className="space-y-3">
                  {testOptions.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className={`w-full p-4 h-auto text-right justify-end text-lg ${
                        testAnswer === option
                          ? testAnswer === testVerse.arabic
                            ? "bg-green-100 border-green-300 hover:bg-green-100"
                            : "bg-red-100 border-red-300 hover:bg-red-100"
                          : testAnswer && option === testVerse.arabic
                          ? "bg-green-100 border-green-300 hover:bg-green-100"
                          : ""
                      }`}
                      onClick={() => testAnswer === '' && handleTestAnswer(option)}
                      dir="rtl"
                      disabled={testAnswer !== ''}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {gameOver && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Memorization Test Results</CardTitle>
              <CardDescription>
                How well have you memorized {selectedSurah?.translation}?
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-center">
              <div className="flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-amber-500 mr-2" />
                <span className="text-3xl font-bold">{score}</span>
                <span className="text-xl ml-2">points</span>
              </div>
              
              <div className="mb-4">
                <p className="font-semibold mb-2">Your Results:</p>
                <div className="flex justify-between items-center px-4 py-2 bg-slate-50 rounded-lg">
                  <span>Correct Answers:</span>
                  <Badge className="bg-green-500">{testResults.correct}/{testResults.total}</Badge>
                </div>
              </div>
              
              <p className="text-lg">
                {testResults.correct >= 8
                  ? "Excellent! You're on your way to becoming a Hafiz!"
                  : testResults.correct >= 6
                  ? "Great job! Keep practicing and you'll improve!"
                  : testResults.correct >= 4
                  ? "Good effort! Regular practice will help you memorize better!"
                  : "Keep practicing! Memorization takes time and patience!"}
              </p>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button 
                onClick={() => {
                  setCurrentMode('learn');
                  setGameOver(false);
                }} 
                className="w-full bg-islamic-primary hover:bg-islamic-primary/90"
              >
                Continue Learning
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setGameStarted(false)} 
                className="w-full"
              >
                Choose Different Surah
              </Button>
            </CardFooter>
          </Card>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default HifzHero;
