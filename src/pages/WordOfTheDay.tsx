
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Book, Calendar, Check, X } from 'lucide-react';

interface WordData {
  id: number;
  word: string;
  transliteration: string;
  meaning: string;
  rootLetters: string;
  example: {
    arabic: string;
    translation: string;
    reference: string;
  };
  quiz: {
    question: string;
    options: string[];
    answer: number;
  };
  usagePrompt: string;
}

const WordOfTheDay = () => {
  const [currentWord, setCurrentWord] = useState<WordData | null>(null);
  const [streak, setStreak] = useState(0);
  const [lastCompletedDate, setLastCompletedDate] = useState<string | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userSentence, setUserSentence] = useState('');
  const [sentenceSubmitted, setSentenceSubmitted] = useState(false);
  
  // Sample Qur'anic words data
  const quranicWords: WordData[] = [
    {
      id: 1,
      word: "تَقْوَى",
      transliteration: "taqwa",
      meaning: "God-consciousness, piety",
      rootLetters: "و-ق-ي",
      example: {
        arabic: "إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ",
        translation: "Indeed, the most noble of you in the sight of Allah is the most righteous of you.",
        reference: "Surah Al-Hujurat 49:13"
      },
      quiz: {
        question: "What is the root meaning of taqwa?",
        options: [
          "To fear",
          "To protect oneself",
          "To worship",
          "To know"
        ],
        answer: 1
      },
      usagePrompt: "Write a sentence using the concept of taqwa in your daily life."
    },
    {
      id: 2,
      word: "صَبْر",
      transliteration: "sabr",
      meaning: "Patience, perseverance",
      rootLetters: "ص-ب-ر",
      example: {
        arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ",
        translation: "O you who have believed, seek help through patience and prayer.",
        reference: "Surah Al-Baqarah 2:153"
      },
      quiz: {
        question: "In Islamic context, sabr refers to:",
        options: [
          "Being lazy",
          "Giving up easily",
          "Enduring difficulties with acceptance",
          "Complaining about hardships"
        ],
        answer: 2
      },
      usagePrompt: "Describe a situation where you needed to practice sabr."
    },
    {
      id: 3,
      word: "شُكْر",
      transliteration: "shukr",
      meaning: "Gratitude, thankfulness",
      rootLetters: "ش-ك-ر",
      example: {
        arabic: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
        translation: "If you are grateful, I will surely increase you [in favor].",
        reference: "Surah Ibrahim 14:7"
      },
      quiz: {
        question: "The opposite of shukr in the Qur'an is:",
        options: [
          "Kufr (disbelief/ingratitude)",
          "Sabr (patience)",
          "Taqwa (God-consciousness)",
          "Ihsan (excellence)"
        ],
        answer: 0
      },
      usagePrompt: "Write about something you are grateful for today using the concept of shukr."
    },
    {
      id: 4,
      word: "رَحْمَة",
      transliteration: "rahmah",
      meaning: "Mercy, compassion",
      rootLetters: "ر-ح-م",
      example: {
        arabic: "وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ",
        translation: "And We have not sent you, [O Muhammad], except as a mercy to the worlds.",
        reference: "Surah Al-Anbya 21:107"
      },
      quiz: {
        question: "Which of Allah's names are derived from the same root as 'rahmah'?",
        options: [
          "Al-Alim and Al-Hakim",
          "Al-Rahman and Al-Rahim",
          "Al-Aziz and Al-Jabbar",
          "Al-Malik and Al-Quddus"
        ],
        answer: 1
      },
      usagePrompt: "Describe how you can show rahmah (mercy) to others in your community."
    },
    {
      id: 5,
      word: "هُدَى",
      transliteration: "huda",
      meaning: "Guidance",
      rootLetters: "ه-د-ي",
      example: {
        arabic: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ",
        translation: "This is the Book about which there is no doubt, a guidance for those conscious of Allah.",
        reference: "Surah Al-Baqarah 2:2"
      },
      quiz: {
        question: "In the Qur'an, what is described as the primary source of huda (guidance)?",
        options: [
          "Human intellect",
          "Cultural traditions",
          "The Qur'an itself",
          "Historical precedents"
        ],
        answer: 2
      },
      usagePrompt: "Reflect on a time when you felt you received guidance (huda) in making an important decision."
    }
  ];

  // Get the current date as a string
  const getCurrentDateString = () => {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  };

  // Initialize or load user data
  useEffect(() => {
    // In a real app, this would be loaded from storage
    const storedDate = localStorage.getItem('lastCompletedDate');
    const storedStreak = localStorage.getItem('wordStreak');
    
    if (storedDate) {
      setLastCompletedDate(storedDate);
    }
    
    if (storedStreak) {
      setStreak(parseInt(storedStreak, 10));
    }
    
    // Check if we need a new word for today
    const today = getCurrentDateString();
    if (storedDate !== today) {
      // Select a word based on the current date
      const date = new Date();
      const wordIndex = date.getDate() % quranicWords.length;
      setCurrentWord(quranicWords[wordIndex]);
      setQuizCompleted(false);
      setSentenceSubmitted(false);
    } else {
      // User already completed today's word
      const wordIndex = new Date().getDate() % quranicWords.length;
      setCurrentWord(quranicWords[wordIndex]);
      setQuizCompleted(true);
      setSentenceSubmitted(true);
    }
  }, []);

  // Handle option selection in quiz
  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
  };

  // Submit quiz answer
  const submitQuizAnswer = () => {
    if (selectedOption === null || !currentWord) return;
    
    const isCorrect = selectedOption === currentWord.quiz.answer;
    
    if (isCorrect) {
      toast({
        title: "Correct!",
        description: "You've selected the right answer.",
        variant: "default"
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer is: ${currentWord.quiz.options[currentWord.quiz.answer]}`,
        variant: "destructive"
      });
    }
    
    setQuizCompleted(true);
  };

  // Submit user sentence
  const submitSentence = () => {
    if (!userSentence.trim() || !currentWord) return;
    
    setSentenceSubmitted(true);
    
    // Update streak and completion date
    const today = getCurrentDateString();
    setLastCompletedDate(today);
    
    if (lastCompletedDate) {
      // Check if the last completion was yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;
      
      if (lastCompletedDate === yesterdayString) {
        // Maintain streak
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem('wordStreak', newStreak.toString());
      } else if (lastCompletedDate !== today) {
        // Reset streak if not yesterday and not today
        setStreak(1);
        localStorage.setItem('wordStreak', '1');
      }
    } else {
      // First time
      setStreak(1);
      localStorage.setItem('wordStreak', '1');
    }
    
    localStorage.setItem('lastCompletedDate', today);
    
    toast({
      title: "Challenge Complete!",
      description: `You've completed today's word challenge. Streak: ${lastCompletedDate && lastCompletedDate !== today ? streak + 1 : 1} days.`,
      variant: "default"
    });
  };

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Word of the Day Challenge</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn one new Qur'anic word each day and complete challenges to build your vocabulary.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-3/5">
            {currentWord && (
              <Card className="p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <Badge variant="outline" className="px-3 py-1 text-base flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Today's Word
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1 text-base">
                    Streak: {streak} days
                  </Badge>
                </div>
                
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold mb-1 font-arabic">{currentWord.word}</h2>
                  <p className="text-lg text-muted-foreground mb-2">{currentWord.transliteration}</p>
                  <div className="text-xl font-medium">{currentWord.meaning}</div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Root letters: {currentWord.rootLetters}
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-lg mb-6">
                  <h3 className="font-semibold mb-2">Example from Qur'an:</h3>
                  <p className="text-xl text-right mb-2 font-arabic">{currentWord.example.arabic}</p>
                  <p className="italic mb-1">{currentWord.example.translation}</p>
                  <p className="text-sm text-muted-foreground">{currentWord.example.reference}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Quiz: Test Your Knowledge</h3>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="mb-3">{currentWord.quiz.question}</p>
                    
                    <div className="space-y-2">
                      {currentWord.quiz.options.map((option, index) => (
                        <div 
                          key={index}
                          className={`p-3 rounded-md border cursor-pointer ${
                            quizCompleted 
                              ? index === currentWord.quiz.answer 
                                ? 'border-green-500 bg-green-50'
                                : selectedOption === index
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-gray-200'
                              : selectedOption === index
                                ? 'border-islamic-primary bg-islamic-primary/10'
                                : 'border-gray-200 hover:border-islamic-primary/50'
                          }`}
                          onClick={() => !quizCompleted && handleOptionSelect(index)}
                        >
                          <div className="flex justify-between items-center">
                            <span>{option}</span>
                            {quizCompleted && index === currentWord.quiz.answer && (
                              <Check className="h-5 w-5 text-green-600" />
                            )}
                            {quizCompleted && selectedOption === index && index !== currentWord.quiz.answer && (
                              <X className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {!quizCompleted && (
                      <Button 
                        className="mt-4 w-full"
                        onClick={submitQuizAnswer}
                        disabled={selectedOption === null}
                      >
                        Check Answer
                      </Button>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Usage Challenge</h3>
                  <p className="mb-3">{currentWord.usagePrompt}</p>
                  
                  <div className="mb-4">
                    <Input
                      value={userSentence}
                      onChange={(e) => setUserSentence(e.target.value)}
                      placeholder="Write your response here..."
                      disabled={sentenceSubmitted}
                      className="mb-2"
                    />
                    
                    <Button 
                      onClick={submitSentence}
                      disabled={!userSentence.trim() || sentenceSubmitted || !quizCompleted}
                      className="w-full"
                    >
                      Submit Response
                    </Button>
                  </div>
                  
                  {sentenceSubmitted && (
                    <div className="p-3 bg-green-100 text-green-800 rounded-md">
                      <Check className="inline-block h-5 w-5 mr-1" />
                      <span>Challenge completed! Come back tomorrow for a new word.</span>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
          
          <div className="md:w-2/5">
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Book className="mr-2 h-5 w-5" />
                Why Learn Qur'anic Vocabulary?
              </h2>
              <p className="mb-4">
                The Qur'an contains approximately 77,430 words, but the unique word count is 
                much smaller. Learning just 300 words can help you understand about 70% of the 
                Qur'an's frequently used words!
              </p>
              <p>
                By learning one new word each day, within a year you'll have a strong foundation 
                for understanding the Qur'an in its original language. This daily practice helps 
                build a deeper connection with the divine text.
              </p>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Your Progress</h2>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-muted-foreground">Current Streak</p>
                  <p className="text-2xl font-bold">{streak} days</p>
                </div>
                
                <div>
                  <p className="font-medium text-muted-foreground">Today's Status</p>
                  <p className="font-medium">
                    {lastCompletedDate === getCurrentDateString() 
                      ? "Completed" 
                      : "Not yet completed"}
                  </p>
                </div>
                
                <div className="pt-2">
                  <p className="text-muted-foreground mb-2">Completion Status:</p>
                  <div className="flex gap-2 mb-1">
                    <Badge variant={quizCompleted ? "default" : "outline"} className="flex-1 justify-center">
                      Quiz {quizCompleted ? "✓" : "○"}
                    </Badge>
                    <Badge variant={sentenceSubmitted ? "default" : "outline"} className="flex-1 justify-center">
                      Usage {sentenceSubmitted ? "✓" : "○"}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        <div className="mt-8 bg-muted p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">How It Works</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Each day you'll get a new Qur'anic word to learn</li>
            <li>Complete the quiz to test your understanding</li>
            <li>Write a sentence or reflection using the word</li>
            <li>Build a streak by completing the challenge daily</li>
            <li>Review previously learned words to reinforce your vocabulary</li>
          </ul>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WordOfTheDay;
