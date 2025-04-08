
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Clock, Award, History } from 'lucide-react';
import { toast } from 'sonner';

interface Action {
  description: string;
  category: 'fard' | 'sunnah' | 'mustahab' | 'mubah' | 'makruh' | 'haram';
  explanation: string;
}

const actions: Action[] = [
  {
    description: "Praying the five daily prayers",
    category: "fard",
    explanation: "The five daily prayers (Salah) are obligatory upon every adult Muslim."
  },
  {
    description: "Fasting in the month of Ramadan",
    category: "fard",
    explanation: "Fasting during Ramadan is one of the five pillars of Islam and is obligatory."
  },
  {
    description: "Paying Zakat when you meet the threshold",
    category: "fard",
    explanation: "Zakat is obligatory charity for those who possess wealth above a certain threshold."
  },
  {
    description: "Performing Hajj once in a lifetime if able",
    category: "fard",
    explanation: "Hajj is obligatory once in a lifetime for those who are physically and financially able."
  },
  {
    description: "Covering the awrah (modest parts) in public",
    category: "fard",
    explanation: "Covering the awrah is obligatory for both men and women, though the extent differs."
  },
  {
    description: "Praying the Witr prayer",
    category: "sunnah",
    explanation: "Witr prayer is a strongly emphasized Sunnah but not obligatory."
  },
  {
    description: "Using miswak (tooth stick) for cleaning teeth",
    category: "sunnah",
    explanation: "Using miswak is a Sunnah practice encouraged by the Prophet Muhammad (PBUH)."
  },
  {
    description: "Fasting on Mondays and Thursdays",
    category: "sunnah",
    explanation: "The Prophet (PBUH) regularly fasted on Mondays and Thursdays, making it a Sunnah."
  },
  {
    description: "Saying 'Bismillah' before eating",
    category: "sunnah",
    explanation: "Starting a meal with 'Bismillah' is a Sunnah of the Prophet (PBUH)."
  },
  {
    description: "Praying two rakats before Fajr prayer",
    category: "sunnah",
    explanation: "These are part of the Sunnah prayers that accompany the obligatory prayers."
  },
  {
    description: "Giving extra voluntary charity beyond Zakat",
    category: "mustahab",
    explanation: "Voluntary charity (Sadaqah) is recommended and brings additional rewards."
  },
  {
    description: "Reciting more Quran than what's required in prayers",
    category: "mustahab",
    explanation: "Extra Quran recitation is encouraged and beneficial but not obligatory."
  },
  {
    description: "Visiting the sick",
    category: "mustahab",
    explanation: "Visiting the sick is a highly recommended act that brings rewards."
  },
  {
    description: "Performing additional voluntary prayers",
    category: "mustahab",
    explanation: "Nafl (voluntary) prayers beyond the obligatory and Sunnah are recommended."
  },
  {
    description: "Remembering Allah throughout the day",
    category: "mustahab",
    explanation: "Regular dhikr (remembrance of Allah) is highly encouraged."
  },
  {
    description: "Drinking water while sitting",
    category: "mubah",
    explanation: "While drinking standing is discouraged, drinking water is permissible in any position."
  },
  {
    description: "Using modern transportation",
    category: "mubah",
    explanation: "Using cars, planes, etc. is permissible and neutral in terms of religious value."
  },
  {
    description: "Eating various types of halal food",
    category: "mubah",
    explanation: "Eating any halal food is permissible and neither rewarded nor punished."
  },
  {
    description: "Wearing different colors of clothing (as long as modest)",
    category: "mubah",
    explanation: "The color of clothing is generally neutral in Islamic jurisprudence as long as modesty is maintained."
  },
  {
    description: "Getting married",
    category: "mubah",
    explanation: "Marriage is permissible and can become recommended or even obligatory in certain circumstances."
  },
  {
    description: "Eating with the left hand (without valid reason)",
    category: "makruh",
    explanation: "Eating with the left hand is discouraged unless there's a valid reason."
  },
  {
    description: "Wasting water during wudu",
    category: "makruh",
    explanation: "Using excessive water during ablution is discouraged, even by a flowing river."
  },
  {
    description: "Talking during the Friday sermon",
    category: "makruh",
    explanation: "Talking during the Khutbah (sermon) reduces the reward of Jumu'ah."
  },
  {
    description: "Fasting only on Fridays",
    category: "makruh",
    explanation: "Singling out Friday for fasting is discouraged unless it's part of a regular pattern."
  },
  {
    description: "Praying exactly at sunrise, midday zenith, or sunset",
    category: "makruh",
    explanation: "Prayers at these exact times are discouraged as they were times pagans worshipped the sun."
  },
  {
    description: "Consuming alcohol",
    category: "haram",
    explanation: "Alcohol consumption is strictly forbidden in Islam."
  },
  {
    description: "Backbiting or gossiping about others",
    category: "haram",
    explanation: "Speaking ill of others behind their backs is forbidden."
  },
  {
    description: "Consuming interest (riba)",
    category: "haram",
    explanation: "Dealing with interest in financial transactions is prohibited."
  },
  {
    description: "Neglecting the five daily prayers",
    category: "haram",
    explanation: "Deliberately missing obligatory prayers without valid reason is prohibited."
  },
  {
    description: "Lying",
    category: "haram",
    explanation: "Dishonesty is forbidden except in very specific circumstances to maintain peace."
  }
];

const categoryInfo = {
  fard: {
    name: "Fard",
    description: "Obligatory - Must be performed, sinful if omitted",
    color: "bg-red-100 text-red-800 border-red-200"
  },
  sunnah: {
    name: "Sunnah",
    description: "Emphasized Practice - Following the Prophet's example, rewarded if done",
    color: "bg-green-100 text-green-800 border-green-200"
  },
  mustahab: {
    name: "Mustahab",
    description: "Recommended - Brings reward if done, no sin if omitted",
    color: "bg-blue-100 text-blue-800 border-blue-200"
  },
  mubah: {
    name: "Mubah",
    description: "Permissible - Neutral actions, neither rewarded nor punished",
    color: "bg-gray-100 text-gray-800 border-gray-200"
  },
  makruh: {
    name: "Makruh",
    description: "Disliked - Better to avoid, but not sinful",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200"
  },
  haram: {
    name: "Haram",
    description: "Forbidden - Sinful to perform, must be avoided",
    color: "bg-pink-100 text-pink-800 border-pink-200"
  }
};

const FardOrSunnah: React.FC = () => {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [totalRounds, setTotalRounds] = useState<number>(10);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [currentAction, setCurrentAction] = useState<Action | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [gameActions, setGameActions] = useState<Action[]>([]);

  const startGame = () => {
    // Shuffle and select actions for the game
    const shuffled = [...actions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, totalRounds);
    
    setGameActions(selected);
    setCurrentAction(selected[0]);
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setRound(1);
    setTimeLeft(15);
    setShowExplanation(false);
    setSelectedCategory(null);
    
    toast("Categorize Islamic actions correctly!");
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (gameStarted && !gameOver && timeLeft > 0 && !showExplanation) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !gameOver && !showExplanation) {
      handleAnswer('');  // Time's up, counted as wrong
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, gameStarted, gameOver, showExplanation]);

  const handleAnswer = (category: string) => {
    if (!currentAction) return;
    
    setSelectedCategory(category);
    setShowExplanation(true);
    
    const isCorrect = category === currentAction.category;
    
    if (isCorrect) {
      // More points for faster answers
      const timeBonus = Math.ceil((timeLeft / 15) * 50);
      const roundScore = 50 + timeBonus;
      setScore(prev => prev + roundScore);
      toast.success(`Correct! +${roundScore} points`);
    } else {
      toast.error(`Incorrect! This action is ${categoryInfo[currentAction.category].name}`);
    }
  };

  const nextRound = () => {
    if (round < totalRounds) {
      const nextRound = round + 1;
      setRound(nextRound);
      setCurrentAction(gameActions[nextRound - 1]);
      setTimeLeft(15);
      setShowExplanation(false);
      setSelectedCategory(null);
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setGameOver(true);
    
    const maxScore = totalRounds * 100;
    const percentage = (score / maxScore) * 100;
    
    let message = "";
    if (percentage >= 80) {
      message = "Excellent! You have a deep understanding of Islamic rulings!";
    } else if (percentage >= 60) {
      message = "Great job! You know many Islamic rulings well!";
    } else if (percentage >= 40) {
      message = "Good effort! Keep learning about Islamic jurisprudence!";
    } else {
      message = "Keep studying! Understanding Islamic rulings is important for every Muslim!";
    }
    
    toast(message);
  };

  const getCategoryBadgeClass = (category: string) => {
    if (!selectedCategory) return "bg-slate-100 text-slate-800 border-slate-200";
    
    if (selectedCategory === category) {
      if (currentAction && currentAction.category === category) {
        return "bg-green-100 text-green-800 border-green-200";
      } else {
        return "bg-red-100 text-red-800 border-red-200";
      }
    }
    
    if (currentAction && currentAction.category === category) {
      return "bg-green-100 text-green-800 border-green-200";
    }
    
    return "bg-slate-100 text-slate-800 border-slate-200";
  };

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Fard or Sunnah?</h1>
          <p className="text-lg text-muted-foreground">Categorize Islamic actions by their rulings in Fiqh</p>
        </div>
        
        {!gameStarted && !gameOver && (
          <div className="max-w-xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Welcome to Fard or Sunnah</CardTitle>
                <CardDescription>
                  Test your knowledge of Islamic rulings by categorizing actions as Fard, Sunnah, Mustahab, Mubah, Makruh, or Haram.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <h3 className="font-semibold">Categories:</h3>
                  {Object.entries(categoryInfo).map(([key, info]) => (
                    <div key={key} className={`p-3 rounded-lg border ${info.color}`}>
                      <p className="font-bold">{info.name}</p>
                      <p className="text-sm">{info.description}</p>
                    </div>
                  ))}
                </div>
                
                <Button onClick={startGame} className="w-full bg-islamic-primary hover:bg-islamic-primary/90">
                  Start Game
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
        
        {gameStarted && !gameOver && currentAction && (
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <Badge variant="outline" className="text-sm px-3 py-1">
                Round: {round}/{totalRounds}
              </Badge>
              <Badge className="bg-amber-500 text-white">
                Score: {score}
              </Badge>
              {!showExplanation && (
                <Badge variant="outline" className="text-sm px-3 py-1 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {timeLeft}s
                </Badge>
              )}
            </div>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Categorize This Action</CardTitle>
                <CardDescription>
                  Choose the correct Islamic ruling for the following action
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 mb-6">
                  <p className="text-lg text-center">{currentAction.description}</p>
                </div>
                
                {showExplanation ? (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg border ${categoryInfo[currentAction.category].color}`}>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-lg">{categoryInfo[currentAction.category].name}</h3>
                        {selectedCategory === currentAction.category ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <p>{currentAction.explanation}</p>
                    </div>
                    
                    <Button 
                      onClick={nextRound} 
                      className="w-full bg-islamic-primary hover:bg-islamic-primary/90"
                    >
                      {round < totalRounds ? "Next Question" : "See Results"}
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(categoryInfo).map(([key, info]) => (
                      <Button
                        key={key}
                        variant="outline"
                        className={`p-3 h-auto text-center justify-center ${info.color}`}
                        onClick={() => handleAnswer(key)}
                      >
                        {info.name}
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
        
        {gameOver && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Game Over!</CardTitle>
              <CardDescription>
                Your knowledge of Islamic rulings
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-center">
              <div className="flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-amber-500 mr-2" />
                <span className="text-3xl font-bold">{score}</span>
                <span className="text-xl ml-2">points</span>
              </div>
              
              <p className="text-lg">
                {score >= 800
                  ? "Excellent! You have a deep understanding of Islamic rulings!"
                  : score >= 600
                  ? "Great job! You know many Islamic rulings well!"
                  : score >= 400
                  ? "Good effort! Keep learning about Islamic jurisprudence!"
                  : "Keep studying! Understanding Islamic rulings is important for every Muslim!"}
              </p>
              
              <div className="flex items-center justify-center mt-2">
                <History className="h-5 w-5 text-islamic-primary mr-2" />
                <p className="text-muted-foreground">
                  Understanding the different categories of actions in Islam helps us prioritize our worship and daily activities.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={startGame} className="w-full bg-islamic-primary hover:bg-islamic-primary/90">
                Play Again
              </Button>
            </CardFooter>
          </Card>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default FardOrSunnah;
