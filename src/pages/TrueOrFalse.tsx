
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Shuffle, Timer } from 'lucide-react';
import { toast } from 'sonner';
import { trueOrFalseService } from '@/services/api';
import { useQuery } from '@tanstack/react-query';

interface Question {
  _id: string;
  text: string;
  isTrue: boolean;
  explanation: string;
  difficulty: string;
}

const TrueOrFalse = () => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState<string | undefined>(undefined);
  
  // Fetch questions from API
  const { data: questionsData, isLoading, error, refetch } = useQuery({
    queryKey: ['trueOrFalseQuestions', difficulty],
    queryFn: () => trueOrFalseService.getRandomQuestions(10, difficulty),
    enabled: false, // Don't fetch automatically
  });
  
  const questions = questionsData?.data || [];
  
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
  
  const startGame = async (selectedDifficulty?: string) => {
    setScore(0);
    setQuestionIndex(0);
    setShowExplanation(false);
    setAnswer(null);
    setGameActive(true);
    setGameOver(false);
    setTimeLeft(15);
    setDifficulty(selectedDifficulty);
    
    // Fetch new questions
    try {
      await refetch();
    } catch (error) {
      toast.error("Failed to load questions. Please try again.");
      setGameActive(false);
    }
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
            
            <div className="space-y-3">
              <h3 className="font-semibold">Select Difficulty</h3>
              <div className="flex justify-center gap-3 mb-4">
                <Button onClick={() => startGame('easy')} variant="outline" size="sm">Easy</Button>
                <Button onClick={() => startGame('medium')} variant="outline" size="sm">Medium</Button>
                <Button onClick={() => startGame('hard')} variant="outline" size="sm">Hard</Button>
                <Button onClick={() => startGame()} size="sm">Random</Button>
              </div>
            </div>
          </div>
        )}
        
        {isLoading && gameActive && (
          <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
            <p>Loading questions...</p>
          </div>
        )}
        
        {error && (
          <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
            <p>Failed to load questions. Please try again.</p>
            <Button onClick={() => startGame(difficulty)} size="sm" className="mt-4">
              Retry
            </Button>
          </div>
        )}
        
        {gameActive && currentQuestion && !isLoading && (
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
              onClick={() => startGame(difficulty)} 
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
