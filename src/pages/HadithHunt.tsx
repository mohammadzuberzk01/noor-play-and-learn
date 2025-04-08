
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Search, CheckCircle, Clock, Archive, Award } from 'lucide-react';
import { toast } from 'sonner';

interface Hadith {
  text: string;
  source: string;
  topic: string;
  narrator: string;
}

const hadiths: Hadith[] = [
  {
    text: "The best among you are those who learn the Quran and teach it to others.",
    source: "Sahih Al-Bukhari",
    topic: "Knowledge",
    narrator: "Uthman ibn Affan"
  },
  {
    text: "Actions are judged by intentions, and each person will be rewarded according to their intentions.",
    source: "Sahih Al-Bukhari & Sahih Muslim",
    topic: "Intention",
    narrator: "Umar ibn Al-Khattab"
  },
  {
    text: "Whoever believes in Allah and the Last Day should say what is good or keep silent.",
    source: "Sahih Al-Bukhari & Sahih Muslim",
    topic: "Speech",
    narrator: "Abu Hurairah"
  },
  {
    text: "None of you truly believes until he loves for his brother what he loves for himself.",
    source: "Sahih Al-Bukhari & Sahih Muslim",
    topic: "Brotherhood",
    narrator: "Anas ibn Malik"
  },
  {
    text: "The believer is not one who eats his fill while his neighbor goes hungry.",
    source: "Al-Adab Al-Mufrad",
    topic: "Charity",
    narrator: "Ibn Abbas"
  },
  {
    text: "Paradise lies under the feet of mothers.",
    source: "Sunan An-Nasa'i",
    topic: "Parents",
    narrator: "Abdullah ibn Amr"
  },
  {
    text: "The strong person is not the one who can wrestle someone else down. The strong person is the one who can control himself when he is angry.",
    source: "Sahih Al-Bukhari",
    topic: "Self-Control",
    narrator: "Abu Hurairah"
  },
  {
    text: "Making things easy for someone in difficulty will result in Allah making things easy for you in this life and in the Hereafter.",
    source: "Sahih Muslim",
    topic: "Kindness",
    narrator: "Abu Hurairah"
  },
  {
    text: "The most beloved of deeds to Allah are those that are consistent, even if they are small.",
    source: "Sahih Al-Bukhari & Sahih Muslim",
    topic: "Consistency",
    narrator: "Aisha"
  },
  {
    text: "A Muslim is the brother of a Muslim. He does not wrong him, abandon him or despise him.",
    source: "Sahih Muslim",
    topic: "Brotherhood",
    narrator: "Abu Hurairah"
  },
  {
    text: "Smiling in your brother's face is an act of charity.",
    source: "Jami at-Tirmidhi",
    topic: "Kindness",
    narrator: "Abu Dharr"
  },
  {
    text: "Allah does not look at your appearance or your wealth, but rather He looks at your hearts and your deeds.",
    source: "Sahih Muslim",
    topic: "Character",
    narrator: "Abu Hurairah"
  },
  {
    text: "Whoever relieves a believer's difficulty in this world, Allah will relieve his difficulties on the Day of Resurrection.",
    source: "Sahih Muslim",
    topic: "Charity",
    narrator: "Abu Hurairah"
  },
  {
    text: "The person who maintains ties of kinship is not the one who reciprocates, but the one who maintains ties when others cut them off.",
    source: "Sahih Al-Bukhari",
    topic: "Family",
    narrator: "Abdullah ibn Amr"
  },
  {
    text: "A good word is a charity.",
    source: "Sahih Al-Bukhari & Sahih Muslim",
    topic: "Speech",
    narrator: "Abu Hurairah"
  },
  {
    text: "There is no disease that Allah has created, except that He also has created its treatment.",
    source: "Sahih Al-Bukhari",
    topic: "Health",
    narrator: "Abu Hurairah"
  },
  {
    text: "Time spent in acquiring knowledge is better than time spent in worship.",
    source: "Sunan At-Tirmidhi",
    topic: "Knowledge",
    narrator: "Abu Hurairah"
  },
  {
    text: "The one who looks after a widow or a poor person is like a warrior who fights for Allah's cause.",
    source: "Sahih Al-Bukhari & Sahih Muslim",
    topic: "Charity",
    narrator: "Abu Hurairah"
  }
];

type GameMode = 'topic' | 'source' | 'narrator';

const HadithHunt: React.FC = () => {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [hadithsToMatch, setHadithsToMatch] = useState<Hadith[]>([]);
  const [selectedHadith, setSelectedHadith] = useState<Hadith | null>(null);
  const [matchOptions, setMatchOptions] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<string>('');
  const [gameMode, setGameMode] = useState<GameMode>('topic');
  const [totalRounds, setTotalRounds] = useState<number>(10);

  const startGame = (mode: GameMode) => {
    setGameMode(mode);
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setRound(1);
    
    // Shuffle hadiths and pick some for the game
    const shuffledHadiths = [...hadiths].sort(() => 0.5 - Math.random());
    setHadithsToMatch(shuffledHadiths.slice(0, totalRounds));
    
    newRound(mode, shuffledHadiths[0], 1);
    
    toast(`Match each hadith with its correct ${mode}!`);
  };

  const newRound = (mode: GameMode, hadith: Hadith, roundNumber: number) => {
    setSelectedHadith(hadith);
    setTimeLeft(30);
    
    // Set the correct answer based on game mode
    let correct = '';
    if (mode === 'topic') correct = hadith.topic;
    else if (mode === 'source') correct = hadith.source;
    else correct = hadith.narrator;
    
    setCorrectAnswer(correct);
    
    // Generate options: 1 correct + 3 wrong
    let allOptions: string[] = [];
    if (mode === 'topic') {
      allOptions = [...new Set(hadiths.map(h => h.topic))];
    } else if (mode === 'source') {
      allOptions = [...new Set(hadiths.map(h => h.source))];
    } else {
      allOptions = [...new Set(hadiths.map(h => h.narrator))];
    }
    
    // Remove correct answer from options
    const wrongOptions = allOptions.filter(option => option !== correct);
    
    // Randomly select 3 wrong options
    const selectedWrongs = wrongOptions
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    // Combine and shuffle
    const options = [correct, ...selectedWrongs].sort(() => 0.5 - Math.random());
    setMatchOptions(options);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (gameStarted && !gameOver && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !gameOver) {
      handleAnswer('');  // Wrong answer due to time out
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, gameStarted, gameOver]);

  const handleAnswer = (selectedOption: string) => {
    const isCorrect = selectedOption === correctAnswer;
    
    if (isCorrect) {
      // Score based on time left
      const roundScore = Math.max(10, Math.ceil((timeLeft / 30) * 100));
      setScore(prev => prev + roundScore);
      toast.success(`Correct! +${roundScore} points`);
    } else {
      toast.error(`Incorrect! The correct ${gameMode} was: ${correctAnswer}`);
    }
    
    // Move to next round or end game
    if (round < totalRounds) {
      const nextRound = round + 1;
      setRound(nextRound);
      newRound(gameMode, hadithsToMatch[nextRound - 1], nextRound);
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setGameOver(true);
    let message = "";
    
    const maxScore = totalRounds * 100;
    const percentage = Math.round((score / maxScore) * 100);
    
    if (percentage >= 80) {
      message = "Excellent! You're a Hadith expert!";
    } else if (percentage >= 60) {
      message = "Great job! You know your Hadiths well!";
    } else if (percentage >= 40) {
      message = "Good effort! Keep learning about the noble traditions!";
    } else {
      message = "Keep learning! The teachings of the Prophet (PBUH) are precious knowledge!";
    }
    
    toast(message);
  };

  const getModeLabel = (mode: GameMode) => {
    switch (mode) {
      case 'topic': return 'Topics';
      case 'source': return 'Sources';
      case 'narrator': return 'Narrators';
    }
  };

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Hadith Hunt</h1>
          <p className="text-lg text-muted-foreground">Match authentic Hadiths to their topics, sources, or narrators</p>
        </div>
        
        {!gameStarted && !gameOver && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Welcome to Hadith Hunt</CardTitle>
                <CardDescription>
                  Test your knowledge of the Prophet Muhammad's (PBUH) sayings by matching Hadiths to the correct information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-6">Choose a game mode to begin:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="cursor-pointer hover:border-islamic-primary transition-colors" onClick={() => startGame('topic')}>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg flex items-center">
                        <BookOpen className="h-5 w-5 mr-2 text-islamic-primary" />
                        Match Topics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground">Match each Hadith with its correct topic or subject matter.</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:border-islamic-primary transition-colors" onClick={() => startGame('source')}>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg flex items-center">
                        <Archive className="h-5 w-5 mr-2 text-islamic-primary" />
                        Match Sources
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground">Match each Hadith with its correct source book (e.g., Bukhari, Muslim).</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:border-islamic-primary transition-colors" onClick={() => startGame('narrator')}>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg flex items-center">
                        <Search className="h-5 w-5 mr-2 text-islamic-primary" />
                        Match Narrators
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground">Match each Hadith with the companion who narrated it.</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {gameStarted && !gameOver && selectedHadith && (
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <Badge variant="outline" className="text-sm px-3 py-1">
                Round: {round}/{totalRounds}
              </Badge>
              <Badge className="bg-amber-500 text-white">
                Score: {score}
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1 flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {timeLeft}s
              </Badge>
            </div>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">The Hadith</CardTitle>
                <CardDescription>
                  Match this hadith with its correct {gameMode}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg italic border-l-4 border-islamic-primary pl-4 py-2 bg-slate-50 rounded-sm">
                  "{selectedHadith.text}"
                </p>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 gap-3">
              {matchOptions.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="p-4 h-auto text-left justify-start hover:bg-islamic-primary/10"
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {gameOver && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Game Over!</CardTitle>
              <CardDescription>
                Your knowledge of {getModeLabel(gameMode).toLowerCase()} in Hadith
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
                  ? "Excellent! You're a Hadith expert!"
                  : score >= 600
                  ? "Great job! You know your Hadiths well!"
                  : score >= 400
                  ? "Good effort! Keep learning about the noble traditions!"
                  : "Keep learning! The teachings of the Prophet (PBUH) are precious knowledge!"}
              </p>
              
              <div className="flex items-center justify-center mt-2">
                <CheckCircle className="h-5 w-5 text-islamic-primary mr-2" />
                <p className="text-muted-foreground">
                  Learning and implementing Hadiths in our daily lives brings us closer to the Sunnah of our beloved Prophet Muhammad (PBUH).
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button onClick={() => startGame(gameMode)} className="w-full bg-islamic-primary hover:bg-islamic-primary/90">
                Play Again ({getModeLabel(gameMode)})
              </Button>
              <Button variant="outline" onClick={() => setGameStarted(false)} className="w-full">
                Choose Different Mode
              </Button>
            </CardFooter>
          </Card>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default HadithHunt;
