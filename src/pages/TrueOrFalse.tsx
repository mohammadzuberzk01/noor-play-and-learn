
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Shuffle, Timer } from 'lucide-react';
import { toast } from 'sonner';

interface Question {
  id: number;
  text: string;
  isTrue: boolean;
  explanation: string;
}

const TrueOrFalse = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  
  const questionsData: Question[] = [
    {
      id: 1,
      text: "Friday prayer (Jumu'ah) is obligatory for all Muslims, including women and children.",
      isTrue: false,
      explanation: "Friday prayer is obligatory for adult male Muslims who are not sick, traveling, or have valid excuses. It is not obligatory for women, children, travelers, or the sick, though they may attend."
    },
    {
      id: 2,
      text: "The Quran has 114 surahs (chapters).",
      isTrue: true,
      explanation: "The Quran consists of 114 surahs (chapters) of varying lengths."
    },
    {
      id: 3,
      text: "Zakat (obligatory charity) is always 2.5% of one's wealth regardless of the type of wealth.",
      isTrue: false,
      explanation: "The zakat rate varies based on the type of wealth. While 2.5% applies to money and trade goods, agricultural produce has different rates (5-10%), and livestock has its own calculation system."
    },
    {
      id: 4,
      text: "Zamzam water comes from a well located in Madinah.",
      isTrue: false,
      explanation: "Zamzam water comes from a well located in Makkah near the Kaaba, not in Madinah."
    },
    {
      id: 5,
      text: "The Islamic calendar is a lunar calendar with 12 months.",
      isTrue: true,
      explanation: "The Islamic (Hijri) calendar is based on lunar months and consists of 12 months in a year."
    },
    {
      id: 6,
      text: "The first revelation of the Quran to Prophet Muhammad (PBUH) happened in the cave of Thawr.",
      isTrue: false,
      explanation: "The first revelation came to Prophet Muhammad (PBUH) in the cave of Hira (not Thawr) on Mount Nur, near Makkah."
    },
    {
      id: 7,
      text: "Muslims are required to make Hajj (pilgrimage) every year if they are able.",
      isTrue: false,
      explanation: "Hajj is obligatory only once in a lifetime for Muslims who are physically and financially able to perform it."
    },
    {
      id: 8,
      text: "The Quran was revealed over a period of approximately 23 years.",
      isTrue: true,
      explanation: "The Quran was revealed gradually over approximately 23 years of Prophet Muhammad's (PBUH) prophethood."
    },
    {
      id: 9,
      text: "All angels in Islam have free will, similar to humans.",
      isTrue: false,
      explanation: "According to Islamic belief, angels do not have free will. They obey Allah's commands without question."
    },
    {
      id: 10,
      text: "The five daily prayers became obligatory after the Prophet's Night Journey (Isra and Mi'raj).",
      isTrue: true,
      explanation: "The five daily prayers were made obligatory for Muslims during the Prophet's Night Journey (Isra and Mi'raj)."
    }
  ];
  
  useEffect(() => {
    // Shuffle questions and set initial state
    const shuffled = [...questionsData].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
  }, []);
  
  useEffect(() => {
    // Set current question when questions are loaded or index changes
    if (questions.length > 0 && questionIndex < questions.length) {
      setCurrentQuestion(questions[questionIndex]);
    }
  }, [questions, questionIndex]);
  
  useEffect(() => {
    // Timer logic
    let timer: number | undefined;
    
    if (gameActive && timeLeft > 0 && !showExplanation && !gameOver) {
      timer = window.setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (gameActive && timeLeft === 0 && !showExplanation) {
      // Time's up
      handleAnswer(null);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [gameActive, timeLeft, showExplanation, gameOver]);
  
  const startGame = () => {
    setScore(0);
    setQuestionIndex(0);
    setShowExplanation(false);
    setAnswer(null);
    setGameActive(true);
    setGameOver(false);
    setTimeLeft(15);
    
    // Re-shuffle questions
    const shuffled = [...questionsData].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
  };
  
  const handleAnswer = (userAnswer: boolean | null) => {
    if (!currentQuestion || showExplanation || gameOver) return;
    
    setAnswer(userAnswer);
    setShowExplanation(true);
    
    // If ran out of time or answered incorrectly
    if (userAnswer === null) {
      toast.error("Time's up!");
    } else if (userAnswer === currentQuestion.isTrue) {
      setScore(score + 1);
      toast.success("Correct answer!");
    } else {
      toast.error("Incorrect answer!");
    }
  };
  
  const nextQuestion = () => {
    // If this was the last question, end the game
    if (questionIndex >= questions.length - 1) {
      setGameOver(true);
      setGameActive(false);
      return;
    }
    
    // Move to next question
    setQuestionIndex(questionIndex + 1);
    setAnswer(null);
    setShowExplanation(false);
    setTimeLeft(15);
  };
  
  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Islamic True or False</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Test your knowledge of Islamic facts in this fast-paced myth-busting game.
          </p>
        </div>
        
        {!gameActive && !gameOver && (
          <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">How to Play</h2>
            <ul className="text-left mb-6 space-y-2">
              <li>• You'll have 15 seconds to answer each question</li>
              <li>• Choose True or False for each statement</li>
              <li>• Learn the correct answer with an explanation</li>
              <li>• Try to get as many correct answers as possible</li>
            </ul>
            <Button onClick={startGame} size="lg" className="mt-4">
              Start Game
            </Button>
          </div>
        )}
        
        {gameActive && currentQuestion && (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-islamic-primary text-white p-6">
              <div className="flex justify-between items-center mb-4">
                <Badge variant="outline" className="bg-white text-islamic-primary border-white">
                  Question {questionIndex + 1} of {questions.length}
                </Badge>
                <Badge variant="outline" className="bg-white text-islamic-primary border-white flex items-center gap-1">
                  <Timer className="h-4 w-4" />
                  {timeLeft} seconds
                </Badge>
              </div>
              
              <h2 className="text-xl font-semibold">{currentQuestion.text}</h2>
            </div>
            
            <div className="p-6">
              {!showExplanation ? (
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    onClick={() => handleAnswer(true)}
                    variant="outline"
                    className="py-8 text-lg border-2 hover:bg-green-50 hover:border-green-500 hover:text-green-700 flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="h-6 w-6" />
                    True
                  </Button>
                  
                  <Button 
                    onClick={() => handleAnswer(false)}
                    variant="outline"
                    className="py-8 text-lg border-2 hover:bg-red-50 hover:border-red-500 hover:text-red-700 flex items-center justify-center gap-2"
                  >
                    <XCircle className="h-6 w-6" />
                    False
                  </Button>
                </div>
              ) : (
                <div>
                  <div className={`p-4 rounded-lg mb-6 ${
                    currentQuestion.isTrue ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5" />
                      <h3 className="font-bold">
                        This statement is {currentQuestion.isTrue ? 'TRUE' : 'FALSE'}
                      </h3>
                    </div>
                    <p>{currentQuestion.explanation}</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Badge className={
                      answer === currentQuestion.isTrue 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : 'bg-red-100 text-red-800 border-red-200'
                    }>
                      {answer === null ? "Time's up!" : answer === currentQuestion.isTrue ? "Correct!" : "Incorrect!"}
                    </Badge>
                    
                    <Button onClick={nextQuestion}>
                      {questionIndex >= questions.length - 1 ? 'Finish Game' : 'Next Question'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {gameOver && (
          <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
            
            <div className="mb-6">
              <p className="text-lg mb-2">Your final score:</p>
              <p className="text-4xl font-bold text-islamic-primary">{score} / {questions.length}</p>
              <p className="text-sm mt-2 text-muted-foreground">
                ({Math.round((score / questions.length) * 100)}% correct)
              </p>
            </div>
            
            <Button 
              onClick={startGame} 
              size="lg" 
              className="flex items-center gap-2"
            >
              <Shuffle className="h-4 w-4" />
              Play Again
            </Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default TrueOrFalse;
