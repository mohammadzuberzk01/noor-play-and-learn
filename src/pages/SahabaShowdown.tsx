
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Star, BookOpen, Lightbulb, AlertCircle, Heart } from 'lucide-react';
import { toast } from 'sonner';

interface SahabiInfo {
  name: string;
  title?: string;
  clues: string[];
  facts: string[];
  significance: string;
}

const sahabaData: SahabiInfo[] = [
  {
    name: "Abu Bakr As-Siddiq",
    title: "The Truthful",
    clues: [
      "I was the first adult male to accept Islam",
      "I was the Prophet's closest friend and companion",
      "I accompanied the Prophet during the Hijrah",
      "I was known for my truthfulness",
      "I became the first Caliph after the Prophet's death"
    ],
    facts: [
      "My full name was Abdullah ibn Abi Quhafah",
      "I freed many slaves including Bilal ibn Rabah",
      "I spent most of my wealth for the sake of Islam",
      "I fought against those who refused to pay Zakat",
      "My caliphate lasted for approximately 2 years"
    ],
    significance: "Known for his unwavering faith and loyalty to the Prophet Muhammad (PBUH), Abu Bakr was instrumental in preserving Islam after the Prophet's death and beginning the compilation of the Quran."
  },
  {
    name: "Umar ibn Al-Khattab",
    title: "Al-Farooq",
    clues: [
      "I was initially one of the strongest opponents of Islam",
      "My conversion was a significant victory for Muslims",
      "I was known for my strong sense of justice",
      "I suggested collecting the Quran in one book",
      "I was the second Caliph after Abu Bakr"
    ],
    facts: [
      "I was given the title 'Al-Farooq' (the one who distinguishes between right and wrong)",
      "Under my caliphate, the Islamic empire expanded greatly",
      "I established the Islamic calendar (Hijri)",
      "I introduced the system of night patrols",
      "My caliphate lasted for about ten years"
    ],
    significance: "Umar's strong leadership expanded the Islamic empire significantly. He was known for his justice, simplicity, and administrative innovations that became the foundation of Islamic governance."
  },
  {
    name: "Uthman ibn Affan",
    title: "Dhun-Nurayn",
    clues: [
      "I was known for my modesty and generosity",
      "I was married to two of the Prophet's daughters (though not simultaneously)",
      "I purchased the Well of Rumah and donated it to Muslims",
      "I financed the expedition of hardship (Tabuk)",
      "I was the third Caliph of Islam"
    ],
    facts: [
      "I was nicknamed 'Dhun-Nurayn' (Possessor of Two Lights)",
      "I was one of the wealthy merchants of Mecca",
      "I standardized the text of the Quran",
      "I expanded the Prophet's Mosque in Medina",
      "My caliphate lasted for approximately 12 years"
    ],
    significance: "Uthman is best known for standardizing the Quran and distributing it across the Islamic world, ensuring its preservation in its original form. His generosity in supporting the Muslim community financially was unmatched."
  },
  {
    name: "Ali ibn Abi Talib",
    title: "Asadullah",
    clues: [
      "I was raised in the household of the Prophet",
      "I was the first youth to accept Islam",
      "I slept in the Prophet's bed during the night of Hijrah",
      "I was known for my knowledge and wisdom",
      "I was the fourth Caliph and final of the Rightly Guided Caliphs"
    ],
    facts: [
      "I was the cousin and son-in-law of the Prophet Muhammad",
      "I was married to Fatimah, the Prophet's daughter",
      "I was given the title 'Asadullah' (Lion of Allah)",
      "I was known for my eloquence and judicial knowledge",
      "I am the father of Hassan and Hussein"
    ],
    significance: "Ali was renowned for his deep knowledge of Islam, bravery in battle, and wisdom in judgment. His sermons and sayings are collected in Nahj al-Balagha, and he is revered in both Sunni and Shia Islam."
  },
  {
    name: "Bilal ibn Rabah",
    clues: [
      "I was a former slave of Abyssinian descent",
      "I was severely tortured for my faith but remained steadfast",
      "I was freed by Abu Bakr",
      "I had a beautiful voice",
      "I was the first muezzin of Islam"
    ],
    facts: [
      "I was among the early converts to Islam",
      "I called the first Adhan in Islamic history",
      "I participated in the battles of Badr and Uhud",
      "After the Prophet's death, I stopped giving the adhan regularly",
      "I later moved to Syria"
    ],
    significance: "Bilal's story represents the Islamic principle of equality regardless of race or social status. His perseverance under torture demonstrates unwavering faith, and his selection as the first muezzin shows the Prophet's stance against racism."
  },
  {
    name: "Salman Al-Farisi",
    clues: [
      "I was originally from Persia",
      "I went through many hardships searching for the truth",
      "I was a slave before the Prophet helped free me",
      "I suggested digging a trench around Medina",
      "I was known for my wisdom and knowledge"
    ],
    facts: [
      "I was born into a Zoroastrian family",
      "I traveled extensively in search of the true religion",
      "I was sold into slavery multiple times",
      "The Prophet and his companions helped pay for my freedom",
      "I was appointed as the governor of Madain during Umar's caliphate"
    ],
    significance: "Salman's journey to Islam represents the universal nature of the religion. His strategic suggestion to dig a trench saved Medina during the Battle of the Trench, and he became a symbol of Persian Muslims."
  },
  {
    name: "Aisha bint Abu Bakr",
    clues: [
      "I was the daughter of Abu Bakr",
      "I was known for my intelligence and sharp memory",
      "I narrated over 2,000 hadiths",
      "I was young when I married the Prophet",
      "I was called the Mother of the Believers"
    ],
    facts: [
      "I had a deep understanding of Islamic law",
      "I was the Prophet's beloved wife",
      "I taught many companions after the Prophet's death",
      "I was involved in the Battle of the Camel",
      "My narrations are a significant source of Islamic law and practice"
    ],
    significance: "Aisha's contributions to Islamic knowledge are immense. Her narrations form a significant portion of hadith literature, and her insights into the Prophet's private life and personal habits provide invaluable guidance for Muslims."
  },
  {
    name: "Khalid ibn Al-Walid",
    title: "Saifullah",
    clues: [
      "I was initially against Islam and fought against Muslims",
      "I converted to Islam after the Treaty of Hudaybiyyah",
      "I never lost a battle in my military career",
      "I was called 'The Drawn Sword of Allah'",
      "I commanded many crucial victories for the Islamic state"
    ],
    facts: [
      "I led the Muslim armies to victory in the Ridda Wars",
      "I conquered Syria and parts of the Byzantine Empire",
      "I was removed from military command by Umar",
      "I developed innovative military tactics",
      "I participated in the battles of Mu'tah and Yarmouk"
    ],
    significance: "Khalid's military genius was instrumental in the early Islamic conquests. His conversion was a significant gain for Muslims, and his undefeated record earned him the title 'Sword of Allah' from the Prophet himself."
  }
];

const SahabaShowdown: React.FC = () => {
  const [currentSahabi, setCurrentSahabi] = useState<SahabiInfo | null>(null);
  const [revealedClues, setRevealedClues] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [availableSahaba, setAvailableSahaba] = useState<SahabiInfo[]>([]);
  const [options, setOptions] = useState<string[]>([]);

  const startGame = () => {
    setAvailableSahaba([...sahabaData]);
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setRound(1);
    setShowAnswer(false);
    newRound();
  };

  const newRound = () => {
    if (availableSahaba.length === 0) {
      endGame();
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableSahaba.length);
    const selectedSahabi = availableSahaba[randomIndex];
    
    // Remove the selected Sahabi from available list
    setAvailableSahaba(prev => prev.filter((_, index) => index !== randomIndex));
    
    setCurrentSahabi(selectedSahabi);
    setRevealedClues(1); // Start with one clue
    setShowAnswer(false);

    // Generate answer options
    const incorrectOptions = sahabaData
      .filter(s => s.name !== selectedSahabi.name)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(s => s.name);
    
    const allOptions = [...incorrectOptions, selectedSahabi.name].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
  };

  const revealNextClue = () => {
    if (revealedClues < 5) {
      setRevealedClues(prev => prev + 1);
    }
  };

  const checkAnswer = (selectedName: string) => {
    if (currentSahabi && selectedName === currentSahabi.name) {
      // Calculate score based on how many clues were revealed
      const clueScore = 6 - revealedClues; // 5 for first clue, 1 for last clue
      const roundScore = clueScore * 20; // 100 points max per round
      
      setScore(prev => prev + roundScore);
      toast.success(`Correct! +${roundScore} points`);
      
      setTimeout(() => {
        setRound(prev => prev + 1);
        if (round < 5) { // Play 5 rounds
          newRound();
        } else {
          endGame();
        }
      }, 2000);
    } else {
      toast.error("Incorrect answer");
      setShowAnswer(true);
    }
  };

  const endGame = () => {
    setGameOver(true);
    let message = "";
    
    if (score >= 400) {
      message = "Excellent! You're a Sahaba expert!";
    } else if (score >= 300) {
      message = "Great job! You know your Islamic history well!";
    } else if (score >= 200) {
      message = "Good effort! Keep learning about the noble companions!";
    } else {
      message = "Keep learning! The lives of the Sahaba are fascinating!";
    }
    
    toast(message);
  };

  const getScoreColor = () => {
    if (score >= 400) return "text-green-600";
    if (score >= 300) return "text-blue-600";
    if (score >= 200) return "text-amber-600";
    return "text-slate-600";
  };

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Sahaba Showdown</h1>
          <p className="text-lg text-muted-foreground">Test your knowledge of the noble companions of Prophet Muhammad (PBUH)</p>
        </div>
        
        {!gameStarted && !gameOver && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Welcome to Sahaba Showdown</CardTitle>
              <CardDescription>
                Can you identify the companions of the Prophet Muhammad (PBUH) based on clues about their lives?
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-islamic-primary" />
                <p>Learn about the noble companions</p>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-islamic-primary" />
                <p>5 rounds of challenging questions</p>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-islamic-primary" />
                <p>The fewer clues you need, the higher your score!</p>
              </div>
              <Button onClick={startGame} className="w-full mt-4 bg-islamic-primary hover:bg-islamic-primary/90">
                Start Game
              </Button>
            </CardContent>
          </Card>
        )}
        
        {gameStarted && !gameOver && currentSahabi && (
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <Badge variant="outline" className="text-sm px-3 py-1">
                Round: {round}/5
              </Badge>
              <Badge className="bg-amber-500 text-white">
                Score: {score}
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">
                Clues: {revealedClues}/5
              </Badge>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-center">Who am I?</CardTitle>
                <CardDescription className="text-center">
                  Guess the Sahabi based on the clues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {currentSahabi.clues.slice(0, revealedClues).map((clue, index) => (
                    <div key={index} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex gap-2 items-start">
                      <AlertCircle className="h-5 w-5 text-islamic-primary mt-0.5" />
                      <p>{clue}</p>
                    </div>
                  ))}
                </div>
                
                {revealedClues < 5 && !showAnswer && (
                  <Button 
                    variant="outline" 
                    onClick={revealNextClue} 
                    className="w-full mb-4"
                  >
                    Reveal Next Clue
                  </Button>
                )}
                
                {showAnswer ? (
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <p className="text-lg font-medium mb-2">The correct answer is:</p>
                    <h3 className="text-xl font-bold text-islamic-primary mb-1">{currentSahabi.name}</h3>
                    {currentSahabi.title && <p className="italic mb-3">"{currentSahabi.title}"</p>}
                    <p className="text-sm text-muted-foreground">{currentSahabi.significance}</p>
                    
                    <Button 
                      onClick={() => {
                        setRound(prev => prev + 1);
                        if (round < 5) {
                          newRound();
                        } else {
                          endGame();
                        }
                      }} 
                      className="w-full mt-4 bg-islamic-primary hover:bg-islamic-primary/90"
                    >
                      Next Round
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {options.map((name, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="p-4 h-auto text-left justify-center hover:bg-islamic-primary/10"
                        onClick={() => checkAnswer(name)}
                      >
                        {name}
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
                How well do you know the companions of the Prophet Muhammad (PBUH)?
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-center">
              <div className="flex items-center justify-center mb-4">
                <Star className="h-8 w-8 text-amber-500 mr-2" />
                <span className={`text-3xl font-bold ${getScoreColor()}`}>{score}</span>
                <span className="text-xl ml-2">points</span>
              </div>
              
              <p className="text-lg">
                {score >= 400
                  ? "Excellent! You're a Sahaba expert!"
                  : score >= 300
                  ? "Great job! You know your Islamic history well!"
                  : score >= 200
                  ? "Good effort! Keep learning about the noble companions!"
                  : "Keep learning! The lives of the Sahaba are fascinating!"}
              </p>
              
              <div className="flex items-center justify-center mt-2">
                <Heart className="h-5 w-5 text-islamic-primary mr-2" />
                <p className="text-muted-foreground">
                  The companions of the Prophet Muhammad (PBUH) were extraordinary individuals who sacrificed everything for Islam.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={startGame} className="w-full mt-4 bg-islamic-primary hover:bg-islamic-primary/90">
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

export default SahabaShowdown;
