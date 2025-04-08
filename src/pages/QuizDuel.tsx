
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, Trophy, Award } from 'lucide-react';
import { toast } from 'sonner';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

const questions: Question[] = [
  {
    question: "What is the first pillar of Islam?",
    options: ["Shahadah", "Salah", "Zakah", "Sawm"],
    correctAnswer: 0
  },
  {
    question: "How many compulsory prayers are there in a day?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 2
  },
  {
    question: "Which of the following is not one of the 99 names of Allah?",
    options: ["Al-Rahman", "Al-Kareem", "Al-Muhsi", "Al-Mustafa"],
    correctAnswer: 3
  },
  {
    question: "Which prophet was known for his patience?",
    options: ["Prophet Ibrahim (AS)", "Prophet Musa (AS)", "Prophet Ayyub (AS)", "Prophet Nuh (AS)"],
    correctAnswer: 2
  },
  {
    question: "What is Laylatul Qadr?",
    options: ["The first day of Ramadan", "The Night of Power", "The first day of Eid", "The day of Arafah"],
    correctAnswer: 1
  },
  {
    question: "Which is the longest Surah in the Quran?",
    options: ["Surah Al-Baqarah", "Surah Al-Imran", "Surah An-Nisa", "Surah Al-Maidah"],
    correctAnswer: 0
  },
  {
    question: "Who was the first caliph after the Prophet Muhammad (PBUH)?",
    options: ["Abu Bakr (RA)", "Umar (RA)", "Uthman (RA)", "Ali (RA)"],
    correctAnswer: 0
  },
  {
    question: "Which battle is known as the 'Victory of Victories' in Islamic history?",
    options: ["Battle of Badr", "Battle of Uhud", "Battle of Khandaq", "Conquest of Makkah"],
    correctAnswer: 3
  },
  {
    question: "What is the Islamic term for charity?",
    options: ["Sawm", "Hajj", "Zakah", "Sabr"],
    correctAnswer: 2
  },
  {
    question: "Which prophet was thrown into the fire but Allah made it cool and safe for him?",
    options: ["Prophet Nuh (AS)", "Prophet Ibrahim (AS)", "Prophet Isa (AS)", "Prophet Musa (AS)"],
    correctAnswer: 1
  },
];

const QuizDuel: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [player1Score, setPlayer1Score] = useState<number>(0);
  const [player2Score, setPlayer2Score] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [currentPlayer, setCurrentPlayer] = useState<number>(1);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (gameStarted && !gameFinished && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleNextQuestion();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, gameStarted, gameFinished]);

  const startGame = () => {
    setGameStarted(true);
    setCurrentQuestion(0);
    setPlayer1Score(0);
    setPlayer2Score(0);
    setCurrentPlayer(1);
    setTimeLeft(15);
    setGameFinished(false);
    toast("Game started! Player 1's turn");
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      if (currentPlayer === 1) {
        setPlayer1Score(prev => prev + 1);
      } else {
        setPlayer2Score(prev => prev + 1);
      }
      toast.success("Correct answer!");
    } else {
      toast.error("Wrong answer!");
    }
    
    setTimeout(() => {
      handleNextQuestion();
    }, 1000);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setCurrentPlayer(prev => prev === 1 ? 2 : 1);
      setTimeLeft(15);
      toast.info(`Player ${currentPlayer === 1 ? 2 : 1}'s turn`);
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setGameFinished(true);
    let message = "";
    
    if (player1Score > player2Score) {
      message = "Player 1 wins!";
    } else if (player2Score > player1Score) {
      message = "Player 2 wins!";
    } else {
      message = "It's a tie!";
    }
    
    toast(message);
  };

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Islamic Quiz Duel</h1>
          <p className="text-lg text-muted-foreground">Challenge your friend to a test of Islamic knowledge!</p>
        </div>
        
        {!gameStarted && !gameFinished && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Welcome to Quiz Duel</CardTitle>
              <CardDescription>
                Two players take turns answering Islamic knowledge questions. The player with the most correct answers wins!
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-islamic-primary" />
                <p>2 players needed</p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-islamic-primary" />
                <p>15 seconds per question</p>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-islamic-primary" />
                <p>10 questions total</p>
              </div>
              <Button onClick={startGame} className="w-full mt-4 bg-islamic-primary hover:bg-islamic-primary/90">
                Start Game
              </Button>
            </CardContent>
          </Card>
        )}
        
        {gameStarted && !gameFinished && (
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Badge variant={currentPlayer === 1 ? "default" : "outline"} className="text-sm px-3 py-1">
                  Player 1: {player1Score}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-amber-500 text-white">Question {currentQuestion + 1}/{questions.length}</Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {timeLeft}s
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={currentPlayer === 2 ? "default" : "outline"} className="text-sm px-3 py-1">
                  Player 2: {player2Score}
                </Badge>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-center">
                  {questions[currentQuestion].question}
                </CardTitle>
                <CardDescription className="text-center">
                  Player {currentPlayer}'s turn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswer === null 
                        ? "outline" 
                        : selectedAnswer === index 
                          ? index === questions[currentQuestion].correctAnswer 
                            ? "default" 
                            : "destructive" 
                          : index === questions[currentQuestion].correctAnswer && selectedAnswer !== null 
                            ? "default" 
                            : "outline"
                      }
                      className={`p-4 h-auto text-left justify-start ${
                        selectedAnswer === null 
                          ? "hover:bg-islamic-primary/10" 
                          : selectedAnswer === index 
                            ? index === questions[currentQuestion].correctAnswer 
                              ? "bg-green-500 hover:bg-green-500 text-white" 
                              : "bg-red-500 hover:bg-red-500 text-white" 
                            : index === questions[currentQuestion].correctAnswer && selectedAnswer !== null 
                              ? "bg-green-500 hover:bg-green-500 text-white" 
                              : ""
                      }`}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={selectedAnswer !== null}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {gameFinished && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Game Over!</CardTitle>
              <CardDescription>
                Final Scores
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-lg">Player 1:</span>
                <Badge className="text-lg px-3 py-1">{player1Score}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg">Player 2:</span>
                <Badge className="text-lg px-3 py-1">{player2Score}</Badge>
              </div>
              
              <div className="flex items-center justify-center gap-2 mt-4">
                <Trophy className={`h-8 w-8 ${player1Score === player2Score ? 'text-amber-500' : player1Score > player2Score ? 'text-amber-500' : 'text-slate-500'}`} />
                <span className="text-xl font-bold">
                  {player1Score > player2Score
                    ? "Player 1 Wins!"
                    : player2Score > player1Score
                    ? "Player 2 Wins!"
                    : "It's a Tie!"}
                </span>
                <Trophy className={`h-8 w-8 ${player1Score === player2Score ? 'text-amber-500' : player2Score > player1Score ? 'text-amber-500' : 'text-slate-500'}`} />
              </div>
              
              <Button onClick={startGame} className="w-full mt-4 bg-islamic-primary hover:bg-islamic-primary/90">
                Play Again
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default QuizDuel;
