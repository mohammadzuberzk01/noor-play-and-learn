
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calendar, Star, Check, X, BookOpen, Award, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface QuranicWord {
  word: string;
  transliteration: string;
  meaning: string;
  example: {
    arabic: string;
    transliteration: string;
    translation: string;
    reference: string;
  };
  rootLetters: string;
  difficulty: 'easy' | 'medium' | 'hard';
  additionalMeanings?: string[];
}

const QURAN_WORDS: QuranicWord[] = [
  {
    word: "رَحْمَة",
    transliteration: "rahmah",
    meaning: "mercy",
    example: {
      arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      transliteration: "Bismillāhi r-raḥmāni r-raḥīm",
      translation: "In the name of Allah, the Most Compassionate, the Most Merciful",
      reference: "Surah Al-Fatihah 1:1"
    },
    rootLetters: "ر ح م",
    difficulty: "easy",
    additionalMeanings: ["compassion", "kindness"]
  },
  {
    word: "عِلْم",
    transliteration: "ilm",
    meaning: "knowledge",
    example: {
      arabic: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
      transliteration: "Wa qur rabbi zidnee ilma",
      translation: "And say: My Lord, increase me in knowledge",
      reference: "Surah Ta-Ha 20:114"
    },
    rootLetters: "ع ل م",
    difficulty: "easy",
    additionalMeanings: ["understanding", "learning"]
  },
  {
    word: "صَبْر",
    transliteration: "sabr",
    meaning: "patience",
    example: {
      arabic: "وَاصْبِرْ ۚ إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ",
      transliteration: "Wasbir inna Allaha la yudeeAAu ajra almuhsineena",
      translation: "And be patient. Indeed, Allah does not allow to be lost the reward of those who do good",
      reference: "Surah Hud 11:115"
    },
    rootLetters: "ص ب ر",
    difficulty: "easy",
    additionalMeanings: ["perseverance", "endurance"]
  },
  {
    word: "تَقْوَى",
    transliteration: "taqwa",
    meaning: "God-consciousness",
    example: {
      arabic: "إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ",
      transliteration: "Inna akramakum inda Allahi atqakum",
      translation: "Indeed, the most noble of you in the sight of Allah is the most righteous of you",
      reference: "Surah Al-Hujurat 49:13"
    },
    rootLetters: "و ق ي",
    difficulty: "medium",
    additionalMeanings: ["piety", "righteousness", "fear of Allah"]
  },
  {
    word: "إِحْسَان",
    transliteration: "ihsan",
    meaning: "excellence",
    example: {
      arabic: "إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ",
      transliteration: "Inna Allaha yamuru bialAAadli waalihsani",
      translation: "Indeed, Allah orders justice and good conduct",
      reference: "Surah An-Nahl 16:90"
    },
    rootLetters: "ح س ن",
    difficulty: "medium",
    additionalMeanings: ["goodness", "perfection"]
  },
  {
    word: "تَوَكُّل",
    transliteration: "tawakkul",
    meaning: "reliance on Allah",
    example: {
      arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
      transliteration: "Waman yatawakkal AAala Allahi fahuwa hasbuhu",
      translation: "And whoever relies upon Allah – then He is sufficient for him",
      reference: "Surah At-Talaq 65:3"
    },
    rootLetters: "و ك ل",
    difficulty: "medium",
    additionalMeanings: ["trust", "dependence"]
  },
  {
    word: "شُكْر",
    transliteration: "shukr",
    meaning: "gratitude",
    example: {
      arabic: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
      transliteration: "Lain shakartum laazeedannakum",
      translation: "If you are grateful, I will surely increase you [in favor]",
      reference: "Surah Ibrahim 14:7"
    },
    rootLetters: "ش ك ر",
    difficulty: "easy",
    additionalMeanings: ["thankfulness", "appreciation"]
  }
];

// Questions for quizzes
interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  wordId: number;
}

const WordOfTheDay: React.FC = () => {
  const [todaysWord, setTodaysWord] = useState<QuranicWord | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [lastCompleted, setLastCompleted] = useState<string | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  
  useEffect(() => {
    // Load user data from localStorage
    const loadUserData = () => {
      const streakData = localStorage.getItem('wordOfDayStreak');
      const lastCompletedData = localStorage.getItem('wordOfDayLastCompleted');
      
      if (streakData) setStreak(parseInt(streakData));
      if (lastCompletedData) setLastCompleted(lastCompletedData);
    };
    
    loadUserData();
    determineWord();
  }, []);
  
  const determineWord = () => {
    // Get today's date to determine the word
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    
    // Check if user already completed today's challenge
    const completed = lastCompleted === dateString;
    
    // Use modulo to cycle through the words array
    const dayOfYear = getDayOfYear(today);
    const wordIndex = dayOfYear % QURAN_WORDS.length;
    
    setTodaysWord(QURAN_WORDS[wordIndex]);
    generateQuestions(wordIndex);
    
    // Update streak if it's a new day
    if (lastCompleted) {
      const lastDate = new Date(lastCompleted);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastDate.toISOString().split('T')[0] !== yesterday.toISOString().split('T')[0] && 
          lastDate.toISOString().split('T')[0] !== dateString) {
        // Streak broken
        setStreak(completed ? streak : 1);
        localStorage.setItem('wordOfDayStreak', completed ? streak.toString() : '1');
      }
    }
    
    // Check if quiz was already completed today
    if (completed) {
      setQuizCompleted(true);
    }
  };
  
  const getDayOfYear = (date: Date): number => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };
  
  const generateQuestions = (wordIndex: number) => {
    const word = QURAN_WORDS[wordIndex];
    const questions: Question[] = [
      {
        id: 1,
        text: `What does "${word.word}" mean?`,
        options: [
          word.meaning,
          ...getRandomMeanings(word.meaning, 3)
        ].sort(() => Math.random() - 0.5),
        correctAnswer: 0,
        wordId: wordIndex
      },
      {
        id: 2,
        text: `Which of these is the correct transliteration of "${word.word}"?`,
        options: [
          word.transliteration,
          ...getRandomTransliterations(word.transliteration, 3)
        ].sort(() => Math.random() - 0.5),
        correctAnswer: 0,
        wordId: wordIndex
      },
      {
        id: 3,
        text: `What are the root letters of "${word.word}"?`,
        options: [
          word.rootLetters,
          ...getRandomRootLetters(word.rootLetters, 3)
        ].sort(() => Math.random() - 0.5),
        correctAnswer: 0,
        wordId: wordIndex
      }
    ];
    
    // Find correct answer indices after shuffling
    questions.forEach(q => {
      if (q.id === 1) {
        q.correctAnswer = q.options.findIndex(o => o === word.meaning);
      } else if (q.id === 2) {
        q.correctAnswer = q.options.findIndex(o => o === word.transliteration);
      } else if (q.id === 3) {
        q.correctAnswer = q.options.findIndex(o => o === word.rootLetters);
      }
    });
    
    setQuizQuestions(questions);
  };
  
  const getRandomMeanings = (correctMeaning: string, count: number): string[] => {
    const allMeanings = QURAN_WORDS.flatMap(w => [w.meaning, ...(w.additionalMeanings || [])]);
    const filteredMeanings = allMeanings.filter(m => m !== correctMeaning);
    return getRandomElements(filteredMeanings, count);
  };
  
  const getRandomTransliterations = (correct: string, count: number): string[] => {
    const allTransliterations = QURAN_WORDS.map(w => w.transliteration);
    const filtered = allTransliterations.filter(t => t !== correct);
    return getRandomElements(filtered, count);
  };
  
  const getRandomRootLetters = (correct: string, count: number): string[] => {
    const allRoots = QURAN_WORDS.map(w => w.rootLetters);
    const filtered = allRoots.filter(r => r !== correct);
    return getRandomElements(filtered, count);
  };
  
  const getRandomElements = (array: string[], count: number): string[] => {
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };
  
  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
      toast({
        title: "Correct!",
        description: "Well done!",
        variant: "default",
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer is: ${quizQuestions[currentQuestionIndex].options[currentQuestion.correctAnswer]}`,
        variant: "destructive",
      });
    }
    
    // Move to next question after a delay
    setTimeout(() => {
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        completeQuiz();
      }
    }, 1500);
  };
  
  const completeQuiz = () => {
    setQuizCompleted(true);
    
    // Save completion to localStorage
    const today = new Date().toISOString().split('T')[0];
    setLastCompleted(today);
    localStorage.setItem('wordOfDayLastCompleted', today);
    
    // Update streak
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem('wordOfDayStreak', newStreak.toString());
    
    toast({
      title: "Quiz Completed!",
      description: `You scored ${score} out of ${quizQuestions.length}`,
      variant: "default",
    });
  };
  
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setQuizCompleted(false);
    setScore(0);
    determineWord();
  };
  
  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Word of the Day Challenge</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Learn one new Qur'anic word daily and test your knowledge with quizzes.
          </p>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <Badge variant="outline" className="flex items-center gap-2 px-3 py-2 text-base">
            <Calendar className="h-5 w-5" />
            <span>Today's Word</span>
          </Badge>
          
          <Badge variant="outline" className="flex items-center gap-2 px-3 py-2 text-base">
            <Star className="h-5 w-5 text-amber-500" />
            <span>Streak: {streak} days</span>
          </Badge>
        </div>
        
        {todaysWord && (
          <Tabs defaultValue="learn" className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="learn">Learn</TabsTrigger>
              <TabsTrigger value="quiz" disabled={quizCompleted}>
                Quiz
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="learn">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Learn Today's Word</CardTitle>
                    <Badge>{todaysWord.difficulty}</Badge>
                  </div>
                  <CardDescription>
                    Expand your Qur'anic vocabulary one word at a time
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="bg-muted p-6 rounded-lg text-center">
                    <h2 className="text-3xl font-bold mb-2 font-arabic">{todaysWord.word}</h2>
                    <p className="text-xl mb-2">{todaysWord.transliteration}</p>
                    <p className="text-2xl text-islamic-primary font-medium">{todaysWord.meaning}</p>
                    
                    {todaysWord.additionalMeanings && todaysWord.additionalMeanings.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2 justify-center">
                        {todaysWord.additionalMeanings.map((meaning, index) => (
                          <Badge key={index} variant="outline">{meaning}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Root Letters</h3>
                    <div className="flex gap-3 justify-center">
                      {todaysWord.rootLetters.split(' ').map((letter, index) => (
                        <Badge key={index} className="text-xl px-3 py-2 bg-islamic-primary/20">{letter}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Example from Qur'an</h3>
                    <Alert>
                      <div className="text-center space-y-3">
                        <p className="text-xl font-arabic">{todaysWord.example.arabic}</p>
                        <p className="italic">{todaysWord.example.transliteration}</p>
                        <AlertDescription>
                          "{todaysWord.example.translation}"
                        </AlertDescription>
                        <AlertTitle className="text-sm text-muted-foreground">
                          {todaysWord.example.reference}
                        </AlertTitle>
                      </div>
                    </Alert>
                  </div>
                  
                  {!quizCompleted ? (
                    <Button 
                      className="w-full" 
                      onClick={() => document.querySelector('[value="quiz"]')?.dispatchEvent(new MouseEvent('click'))}
                    >
                      Take Quiz
                    </Button>
                  ) : (
                    <Alert className="bg-green-50 border-green-200">
                      <Check className="h-5 w-5 text-green-600" />
                      <AlertTitle>Completed!</AlertTitle>
                      <AlertDescription>
                        You've completed today's word challenge. Come back tomorrow for a new word!
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="quiz">
              {!quizCompleted ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Test Your Knowledge</CardTitle>
                      <Badge variant="outline">Question {currentQuestionIndex + 1}/{quizQuestions.length}</Badge>
                    </div>
                    <CardDescription>
                      Answer questions about today's word to strengthen your memory
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    {quizQuestions.length > 0 && (
                      <>
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold mb-4">
                            {quizQuestions[currentQuestionIndex].text}
                          </h3>
                          
                          <div className="grid gap-3">
                            {quizQuestions[currentQuestionIndex].options.map((option, index) => (
                              <Button
                                key={index}
                                variant={
                                  isAnswered
                                    ? index === quizQuestions[currentQuestionIndex].correctAnswer
                                      ? "default"
                                      : index === selectedOption
                                        ? "destructive"
                                        : "outline"
                                    : "outline"
                                }
                                className={`justify-start h-auto p-4 ${
                                  isAnswered 
                                    ? index === quizQuestions[currentQuestionIndex].correctAnswer
                                      ? "bg-green-500 hover:bg-green-500"
                                      : index === selectedOption
                                        ? "bg-red-500 hover:bg-red-500"
                                        : ""
                                    : "hover:bg-islamic-primary/10"
                                }`}
                                onClick={() => handleOptionSelect(index)}
                                disabled={isAnswered}
                              >
                                {option}
                                {isAnswered && index === quizQuestions[currentQuestionIndex].correctAnswer && (
                                  <Check className="ml-auto h-5 w-5" />
                                )}
                                {isAnswered && index === selectedOption && index !== quizQuestions[currentQuestionIndex].correctAnswer && (
                                  <X className="ml-auto h-5 w-5" />
                                )}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Quiz Completed!</CardTitle>
                    <CardDescription>
                      You've completed today's word challenge
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <h3 className="text-2xl font-bold mb-2">Your Score</h3>
                      <div className="text-4xl font-bold text-islamic-primary mb-4">
                        {score} / {quizQuestions.length}
                      </div>
                      
                      <div className="flex justify-center items-center gap-2">
                        <Star className="h-6 w-6 text-amber-500" />
                        <span className="text-xl font-semibold">Daily Streak: {streak}</span>
                        <Star className="h-6 w-6 text-amber-500" />
                      </div>
                    </div>
                    
                    <div className="flex gap-4 justify-center">
                      <Button
                        variant="outline"
                        onClick={resetQuiz}
                        className="flex items-center gap-2"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Practice Again
                      </Button>
                      
                      <Button
                        onClick={() => document.querySelector('[value="learn"]')?.dispatchEvent(new MouseEvent('click'))}
                        className="flex items-center gap-2"
                      >
                        <BookOpen className="h-4 w-4" />
                        Review Word
                      </Button>
                    </div>
                    
                    <Alert>
                      <Award className="h-5 w-5" />
                      <AlertTitle>Great job!</AlertTitle>
                      <AlertDescription>
                        Come back tomorrow for a new word to continue your learning streak!
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
        
        <div className="mt-8 bg-muted p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">About Word of the Day</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Each day features a new word from the Qur'an with its meaning and context</li>
            <li>Complete daily quizzes to test your understanding</li>
            <li>Build a streak by returning each day for a new word</li>
            <li>Learn the most common and important Qur'anic vocabulary</li>
            <li>See how the word is used in context with examples from the Qur'an</li>
          </ul>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WordOfTheDay;
