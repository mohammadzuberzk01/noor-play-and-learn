
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CheckCircle, XCircle, HelpCircle, ArrowRight } from 'lucide-react';

interface TriviaQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

const Trivia = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(true);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [category, setCategory] = useState<string>('all');
  const [quizStarted, setQuizStarted] = useState(false);

  const triviaQuestions: TriviaQuestion[] = [
    {
      question: 'What is the first pillar of Islam?',
      options: ['Salah (Prayer)', 'Shahada (Faith)', 'Sawm (Fasting)', 'Zakat (Charity)'],
      correctAnswer: 'Shahada (Faith)',
      explanation: 'The Shahada, or declaration of faith, is the first pillar of Islam. It is the sincere recitation of "There is no god but Allah, and Muhammad is the messenger of Allah."',
      difficulty: 'easy',
      category: 'pillars'
    },
    {
      question: 'Which month in the Islamic calendar is Ramadan?',
      options: ['8th month', '9th month', '10th month', '12th month'],
      correctAnswer: '9th month',
      explanation: 'Ramadan is the ninth month of the Islamic calendar and is observed by Muslims worldwide as a month of fasting, prayer, reflection and community.',
      difficulty: 'easy',
      category: 'calendar'
    },
    {
      question: 'Where was Prophet Muhammad (PBUH) born?',
      options: ['Medina', 'Jerusalem', 'Mecca', 'Damascus'],
      correctAnswer: 'Mecca',
      explanation: 'Prophet Muhammad (PBUH) was born in Mecca, in present-day Saudi Arabia, around the year 570 CE.',
      difficulty: 'easy',
      category: 'prophets'
    },
    {
      question: 'What is the name of the night during Ramadan when the Quran was first revealed?',
      options: ['Laylat al-Qadr', 'Laylat al-Miraj', 'Laylat al-Isra', 'Laylat al-Baraat'],
      correctAnswer: 'Laylat al-Qadr',
      explanation: 'Laylat al-Qadr, or the "Night of Power," is considered the holiest night of the year in Islam. It is the night when the Quran was first revealed to Prophet Muhammad (PBUH).',
      difficulty: 'medium',
      category: 'quran'
    },
    {
      question: 'Who was the first Caliph after Prophet Muhammad (PBUH)?',
      options: ['Umar ibn al-Khattab', 'Abu Bakr al-Siddiq', 'Uthman ibn Affan', 'Ali ibn Abi Talib'],
      correctAnswer: 'Abu Bakr al-Siddiq',
      explanation: 'Abu Bakr al-Siddiq was the first Caliph after Prophet Muhammad (PBUH). He was one of the earliest converts to Islam and the Prophet\'s closest companion.',
      difficulty: 'medium',
      category: 'history'
    },
    {
      question: 'What is the Hijri year that marks the beginning of the Islamic calendar?',
      options: ['610 CE', '622 CE', '630 CE', '632 CE'],
      correctAnswer: '622 CE',
      explanation: 'The Islamic calendar, known as the Hijri calendar, begins with the year of the Hijra (migration) of Prophet Muhammad (PBUH) from Mecca to Medina in 622 CE.',
      difficulty: 'medium',
      category: 'calendar'
    },
    {
      question: 'Which surah in the Quran is considered the "heart of the Quran"?',
      options: ['Surah Al-Fatiha', 'Surah Ya-Sin', 'Surah Al-Ikhlas', 'Surah Al-Baqarah'],
      correctAnswer: 'Surah Ya-Sin',
      explanation: 'Surah Ya-Sin is often referred to as the "heart of the Quran" due to its powerful message and importance. The Prophet Muhammad (PBUH) said that it has been called the heart of the Quran.',
      difficulty: 'hard',
      category: 'quran'
    },
    {
      question: 'During which battle did Muslims first use the trench as a defensive strategy?',
      options: ['Battle of Badr', 'Battle of Uhud', 'Battle of Khaybar', 'Battle of the Trench (Khandaq)'],
      correctAnswer: 'Battle of the Trench (Khandaq)',
      explanation: 'The Battle of the Trench (Khandaq) took place in 627 CE. The Muslims, on the suggestion of Salman Al-Farsi, dug a trench around Medina to prevent the Meccan cavalry from entering the city.',
      difficulty: 'hard',
      category: 'history'
    }
  ];

  const filteredQuestions = triviaQuestions.filter(q => 
    (category === 'all' || q.category === category) && 
    q.difficulty === difficulty
  );

  useEffect(() => {
    if (quizStarted && timerActive && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswerChecked && quizStarted) {
      handleCheckAnswer();
    }
  }, [timeLeft, timerActive, isAnswerChecked, quizStarted]);

  const handleAnswerSelect = (answer: string) => {
    if (!isAnswerChecked) {
      setSelectedAnswer(answer);
    }
  };

  const handleCheckAnswer = () => {
    setTimerActive(false);
    setIsAnswerChecked(true);
    
    const currentQuestion = filteredQuestions[currentQuestionIndex];
    
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
      toast.success('Correct answer!');
    } else {
      toast.error('Incorrect answer.');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
      setTimeLeft(30);
      setTimerActive(true);
    } else {
      setQuizComplete(true);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    setQuizComplete(false);
    setTimeLeft(30);
    setTimerActive(true);
  };

  const restartQuiz = () => {
    startQuiz();
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Islamic Trivia</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            Test your knowledge of Islam with these trivia questions.
          </p>
        </div>
        
        {!quizStarted ? (
          <Card className="max-w-2xl mx-auto p-6">
            <CardHeader>
              <CardTitle>Start Islamic Trivia Quiz</CardTitle>
              <CardDescription>Select difficulty level and category to begin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Difficulty</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge 
                      variant="outline" 
                      className={`cursor-pointer px-4 py-2 ${difficulty === 'easy' ? 'bg-green-100 text-green-800' : ''}`}
                      onClick={() => setDifficulty('easy')}
                    >
                      Easy
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`cursor-pointer px-4 py-2 ${difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : ''}`}
                      onClick={() => setDifficulty('medium')}
                    >
                      Medium
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`cursor-pointer px-4 py-2 ${difficulty === 'hard' ? 'bg-red-100 text-red-800' : ''}`}
                      onClick={() => setDifficulty('hard')}
                    >
                      Hard
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Category</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge 
                      variant="outline" 
                      className={`cursor-pointer px-4 py-2 ${category === 'all' ? 'bg-islamic-primary text-white' : ''}`}
                      onClick={() => setCategory('all')}
                    >
                      All Categories
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`cursor-pointer px-4 py-2 ${category === 'pillars' ? 'bg-islamic-primary text-white' : ''}`}
                      onClick={() => setCategory('pillars')}
                    >
                      Pillars of Islam
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`cursor-pointer px-4 py-2 ${category === 'prophets' ? 'bg-islamic-primary text-white' : ''}`}
                      onClick={() => setCategory('prophets')}
                    >
                      Prophets
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`cursor-pointer px-4 py-2 ${category === 'quran' ? 'bg-islamic-primary text-white' : ''}`}
                      onClick={() => setCategory('quran')}
                    >
                      Quran
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`cursor-pointer px-4 py-2 ${category === 'history' ? 'bg-islamic-primary text-white' : ''}`}
                      onClick={() => setCategory('history')}
                    >
                      Islamic History
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`cursor-pointer px-4 py-2 ${category === 'calendar' ? 'bg-islamic-primary text-white' : ''}`}
                      onClick={() => setCategory('calendar')}
                    >
                      Islamic Calendar
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={startQuiz}
                disabled={filteredQuestions.length === 0}
                className="w-full"
              >
                Start Quiz
              </Button>
              {filteredQuestions.length === 0 && (
                <p className="text-red-500 mt-2">No questions available for the selected criteria.</p>
              )}
            </CardFooter>
          </Card>
        ) : (
          <>
            {!quizComplete ? (
              <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <Badge className="px-4 py-2">
                    Question {currentQuestionIndex + 1}/{filteredQuestions.length}
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    Score: {score}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`px-4 py-2 ${timeLeft < 10 ? 'animate-pulse bg-red-100 text-red-800' : ''}`}
                  >
                    Time: {timeLeft}s
                  </Badge>
                </div>
                
                <Card className="mb-8">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <Badge 
                        variant="outline" 
                        className={`${getDifficultyColor(filteredQuestions[currentQuestionIndex].difficulty)}`}
                      >
                        {filteredQuestions[currentQuestionIndex].difficulty.charAt(0).toUpperCase() + 
                         filteredQuestions[currentQuestionIndex].difficulty.slice(1)}
                      </Badge>
                      <Badge variant="outline">
                        {filteredQuestions[currentQuestionIndex].category.charAt(0).toUpperCase() + 
                         filteredQuestions[currentQuestionIndex].category.slice(1)}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl mt-4">
                      <HelpCircle className="inline-block mr-2 h-6 w-6 text-islamic-primary" />
                      {filteredQuestions[currentQuestionIndex].question}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      {filteredQuestions[currentQuestionIndex].options.map((option, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            selectedAnswer === option
                              ? 'border-islamic-primary bg-islamic-primary/10'
                              : 'border-gray-200 hover:border-islamic-primary/50 hover:bg-islamic-primary/5'
                          } ${
                            isAnswerChecked && option === filteredQuestions[currentQuestionIndex].correctAnswer
                              ? 'border-green-500 bg-green-100'
                              : ''
                          } ${
                            isAnswerChecked && selectedAnswer === option && 
                            option !== filteredQuestions[currentQuestionIndex].correctAnswer
                              ? 'border-red-500 bg-red-100'
                              : ''
                          }`}
                          onClick={() => handleAnswerSelect(option)}
                        >
                          <div className="flex items-center">
                            <div className="mr-2">
                              {isAnswerChecked && option === filteredQuestions[currentQuestionIndex].correctAnswer ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : isAnswerChecked && selectedAnswer === option && 
                                 option !== filteredQuestions[currentQuestionIndex].correctAnswer ? (
                                <XCircle className="h-5 w-5 text-red-600" />
                              ) : (
                                <div className={`h-5 w-5 rounded-full border ${
                                  selectedAnswer === option 
                                    ? 'border-islamic-primary bg-islamic-primary' 
                                    : 'border-gray-300'
                                }`} />
                              )}
                            </div>
                            <span>{option}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {isAnswerChecked && (
                      <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                        <h4 className="font-medium mb-2">Explanation:</h4>
                        <p>{filteredQuestions[currentQuestionIndex].explanation}</p>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="flex justify-between">
                    {!isAnswerChecked ? (
                      <Button 
                        onClick={handleCheckAnswer}
                        disabled={!selectedAnswer}
                        className="w-full"
                      >
                        Check Answer
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleNextQuestion}
                        className="w-full"
                      >
                        {currentQuestionIndex < filteredQuestions.length - 1 ? (
                          <>
                            Next Question
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        ) : (
                          'Complete Quiz'
                        )}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </div>
            ) : (
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
                  <CardDescription>
                    You scored {score} out of {filteredQuestions.length}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex justify-center py-4">
                    <div className="h-32 w-32 rounded-full bg-islamic-primary flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">
                        {Math.round((score / filteredQuestions.length) * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-2">
                    {score === filteredQuestions.length && (
                      <p className="text-center text-green-600 font-bold">Perfect Score! Excellent knowledge!</p>
                    )}
                    {score >= filteredQuestions.length * 0.75 && score < filteredQuestions.length && (
                      <p className="text-center text-green-600 font-bold">Great job! You have excellent knowledge!</p>
                    )}
                    {score >= filteredQuestions.length * 0.5 && score < filteredQuestions.length * 0.75 && (
                      <p className="text-center text-amber-600 font-bold">Good effort! You're on the right track!</p>
                    )}
                    {score < filteredQuestions.length * 0.5 && (
                      <p className="text-center text-amber-600 font-bold">Keep learning! Practice makes perfect!</p>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-center gap-4">
                  <Button onClick={restartQuiz}>
                    Try Again
                  </Button>
                </CardFooter>
              </Card>
            )}
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Trivia;
