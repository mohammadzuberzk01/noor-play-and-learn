
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Shield, Book, AlertCircle, Check, X, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FiqhScenario {
  id: number;
  scenario: string;
  question: string;
  options: string[];
  answers: {
    hanafi: number;
    maliki: number;
    shafi: number;
    hanbali: number;
  };
  explanation: {
    hanafi: string;
    maliki: string;
    shafi: string;
    hanbali: string;
  };
}

const scenarios: FiqhScenario[] = [
  {
    id: 1,
    scenario: "Abdul is traveling from Jeddah to Riyadh, a distance of about 900 km.",
    question: "Should Abdul shorten his prayers during his journey?",
    options: [
      "Yes, he should shorten his prayers.",
      "No, he should pray the full prayer.",
      "He can choose to shorten or pray in full.",
      "He should combine but not shorten."
    ],
    answers: {
      hanafi: 0,
      maliki: 0,
      shafi: 0,
      hanbali: 0
    },
    explanation: {
      hanafi: "According to the Hanafi madhhab, a traveler should shorten the obligatory prayers of Zuhr, Asr, and Isha from four to two rak'ahs during a journey of approximately 78 km or more.",
      maliki: "The Maliki madhhab holds that one should shorten prayers when traveling a distance that takes at least a full day's journey (approximately 80 km).",
      shafi: "In the Shafi'i school, a traveler should shorten prayers when traveling a distance of approximately 81 km or more.",
      hanbali: "The Hanbali madhhab states that travelers should shorten prayers when traveling a distance of approximately 80 km or more."
    }
  },
  {
    id: 2,
    scenario: "Fatima forgot to make wudu before praying Asr. After finishing the prayer, she remembers.",
    question: "What should Fatima do?",
    options: [
      "Repeat the prayer with wudu.",
      "Her prayer is valid as long as she didn't know during the prayer.",
      "Make wudu now and continue with her day.",
      "Make wudu and perform two prostrations of forgetfulness."
    ],
    answers: {
      hanafi: 0,
      maliki: 0,
      shafi: 0,
      hanbali: 0
    },
    explanation: {
      hanafi: "According to the Hanafi madhhab, the prayer performed without wudu is invalid, and Fatima must repeat the prayer after making proper wudu.",
      maliki: "In the Maliki school, ritual purity is a prerequisite for prayer, so Fatima must repeat her prayer with wudu.",
      shafi: "The Shafi'i madhhab holds that wudu is a necessary condition for the validity of prayer, so Fatima must repeat her prayer with wudu.",
      hanbali: "According to the Hanbali school, prayers performed without wudu are invalid and must be repeated with proper wudu."
    }
  },
  {
    id: 3,
    scenario: "Ahmad finds a small spot of blood on his clothes, about the size of a dirham (an old coin, approximately 2-3 cm in diameter).",
    question: "Can Ahmad pray in these clothes without washing the blood stain?",
    options: [
      "Yes, the amount is small enough to be excused.",
      "No, he must wash the blood stain before praying.",
      "He can pray but it's better to wash it.",
      "It depends on the source of the blood."
    ],
    answers: {
      hanafi: 0,
      maliki: 2,
      shafi: 1,
      hanbali: 1
    },
    explanation: {
      hanafi: "According to the Hanafi madhhab, a blood stain the size of a dirham or less is excused. Ahmad can pray without washing it.",
      maliki: "The Maliki school considers that a small amount of blood doesn't nullify the prayer, but it's recommended to remove it if possible.",
      shafi: "In the Shafi'i madhhab, blood is considered impure regardless of amount, so Ahmad must wash the stain before praying.",
      hanbali: "The Hanbali school generally considers blood to be impure, so Ahmad should wash the stain before praying."
    }
  },
  {
    id: 4,
    scenario: "Layla joins congregational prayer during the last rak'ah when the imam is in ruku (bowing).",
    question: "Has Layla caught this rak'ah?",
    options: [
      "Yes, she has caught the rak'ah.",
      "No, she has missed this rak'ah and must make it up.",
      "She has caught it only if she managed to say 'Subhana Rabbi al-'Adheem' once.",
      "She has caught it only if she joined before the imam lifted from ruku."
    ],
    answers: {
      hanafi: 0,
      maliki: 3,
      shafi: 0,
      hanbali: 0
    },
    explanation: {
      hanafi: "In the Hanafi madhhab, if Layla joins the prayer and performs the ruku with the imam (even if she only catches the end of it), she has caught that rak'ah.",
      maliki: "According to the Maliki school, Layla must join before the imam starts to lift from ruku in order to have caught the rak'ah.",
      shafi: "The Shafi'i madhhab states that if a person joins the congregation and completes the ruku with the imam, they have caught that rak'ah.",
      hanbali: "In the Hanbali school, joining the imam in ruku, even at the last moment, means that Layla has caught that rak'ah."
    }
  },
  {
    id: 5,
    scenario: "Yusuf is praying Dhuhr and is uncertain whether he has prayed 2 or 3 rak'ahs.",
    question: "What should Yusuf do?",
    options: [
      "Assume he has prayed 2 rak'ahs and continue.",
      "Assume he has prayed 3 rak'ahs and complete one more.",
      "Build on certainty (2 rak'ahs) and perform one more.",
      "Restart the prayer to be safe."
    ],
    answers: {
      hanafi: 2,
      maliki: 2,
      shafi: 2,
      hanbali: 2
    },
    explanation: {
      hanafi: "The Hanafi madhhab teaches that when in doubt, one should build upon what they are certain of. Since Yusuf is certain about 2 rak'ahs, he should perform one more rak'ah and then do sujud al-sahw (prostration of forgetfulness).",
      maliki: "According to the Maliki school, when unsure between two numbers, one should act on the lesser number. Yusuf should continue as if he has prayed 2 rak'ahs, perform the 3rd, and then do sujud al-sahw after the tasleem.",
      shafi: "The Shafi'i madhhab advises that one should build upon certainty. Yusuf should assume he has prayed 2 rak'ahs, complete the prayer, and perform sujud al-sahw before the tasleem.",
      hanbali: "In the Hanbali school, the principle is to act upon certainty. Yusuf should assume he has prayed 2 rak'ahs and complete the prayer accordingly, then perform sujud al-sahw."
    }
  },
  {
    id: 6,
    scenario: "Ibrahim wants to perform wudu but can't find water. He's in a desert area traveling.",
    question: "What should Ibrahim do to prepare for prayer?",
    options: [
      "Delay the prayer until water is found.",
      "Perform tayammum (dry ablution) with clean earth.",
      "Pray without wudu in this exceptional circumstance.",
      "Perform a symbolic wudu without water."
    ],
    answers: {
      hanafi: 1,
      maliki: 1,
      shafi: 1,
      hanbali: 1
    },
    explanation: {
      hanafi: "According to the Hanafi madhhab, when water is not available or its use would cause harm, tayammum becomes permissible as a substitute for wudu.",
      maliki: "The Maliki school allows tayammum when water is unavailable, or its use would be harmful, or when the search for water would cause one to miss the prayer time.",
      shafi: "In the Shafi'i madhhab, tayammum is permitted when one cannot find water after searching, or when using water would cause harm.",
      hanbali: "The Hanbali madhhab permits tayammum when water is not available, or its use would cause harm or illness."
    }
  },
  {
    id: 7,
    scenario: "Aisha has a chronic condition that causes small amounts of urine to leak occasionally.",
    question: "How should Aisha perform her prayers with this condition?",
    options: [
      "She is excused from prayer until the condition resolves.",
      "She should make wudu for each prayer, even if leakage occurs afterward.",
      "She can pray without wudu as this is an ongoing condition.",
      "She should combine all her prayers at one time with one wudu."
    ],
    answers: {
      hanafi: 1,
      maliki: 1,
      shafi: 1,
      hanbali: 1
    },
    explanation: {
      hanafi: "In the Hanafi madhhab, Aisha's condition would be classified as 'udhir (excuse). She should make wudu for each prayer time, and her prayer would be valid even if the condition continues during prayer.",
      maliki: "The Maliki school considers this a continuous excuse ('udhir). Aisha should make wudu for each prayer time, and the invalidation of wudu by her condition is temporarily suspended until the end of the prayer time.",
      shafi: "According to the Shafi'i madhhab, this is classified as a continuous hadath (ritual impurity). Aisha should make a new wudu for each obligatory prayer after the time for that prayer has begun.",
      hanbali: "The Hanbali school regards this as a continuous excuse. Aisha should make wudu for each prayer after its time begins, and may perform as many voluntary prayers as she wishes with that wudu until the next prayer time."
    }
  },
  {
    id: 8,
    scenario: "Hassan is traveling and doesn't have access to water or earth for purification.",
    question: "How should Hassan perform his prayers?",
    options: [
      "He is temporarily exempted from prayer until purification means are available.",
      "He should perform the motions of prayer without purification and repeat them later.",
      "He should purify himself with whatever is available, even if not ideal.",
      "He must pray without purification and is not required to repeat later."
    ],
    answers: {
      hanafi: 3,
      maliki: 3,
      shafi: 3,
      hanbali: 3
    },
    explanation: {
      hanafi: "According to the Hanafi madhhab, if both water and soil for tayammum are unavailable, Hassan should still perform his prayer in its time without purification, and he is not required to repeat it later.",
      maliki: "The Maliki school holds that when both water and soil are completely unavailable, Hassan should still pray on time without purification and does not need to repeat the prayer later.",
      shafi: "In the Shafi'i madhhab, if someone cannot find water or soil, they should still pray on time according to their condition, and they do not need to make up the prayer later.",
      hanbali: "The Hanbali school teaches that if both water and earth are unavailable, Hassan should pray without purification, and the prayer is valid without need for repetition."
    }
  },
  {
    id: 9,
    scenario: "Noor has a cast on her arm due to a fracture. She needs to perform wudu.",
    question: "How should Noor handle the cast area during wudu?",
    options: [
      "Wipe over the cast with wet hands.",
      "The cast area is exempted from wudu completely.",
      "She must perform tayammum instead of wudu.",
      "She should remove the cast temporarily for wudu if possible."
    ],
    answers: {
      hanafi: 0,
      maliki: 0,
      shafi: 0,
      hanbali: 0
    },
    explanation: {
      hanafi: "The Hanafi madhhab allows wiping over splints or casts. Noor should wipe over the cast with wet hands during wudu.",
      maliki: "According to the Maliki school, Noor should wipe over the cast during wudu, and this wiping takes the place of washing the covered limb.",
      shafi: "The Shafi'i madhhab permits wiping over casts or bandages that are applied out of necessity, as long as they don't cover more area than needed.",
      hanbali: "In the Hanbali school, wiping over splints or casts is permitted when washing would be harmful, and the wiping should cover the entire cast."
    }
  },
  {
    id: 10,
    scenario: "Omar performs the Fajr prayer, and after finishing, he realizes there was an impurity on his clothes that he wasn't aware of.",
    question: "Is Omar's prayer valid?",
    options: [
      "Yes, the prayer is valid since he was unaware of the impurity.",
      "No, he must repeat the prayer after purifying his clothes.",
      "The prayer is valid but makruh (disliked).",
      "He should perform an extra prayer as compensation."
    ],
    answers: {
      hanafi: 0,
      maliki: 0,
      shafi: 0,
      hanbali: 0
    },
    explanation: {
      hanafi: "According to the Hanafi madhhab, if Omar was unaware of the impurity on his clothes during prayer, and only discovered it after completing the prayer, his prayer is valid and he does not need to repeat it.",
      maliki: "The Maliki school holds that if Omar didn't know about the impurity until after completing the prayer, his prayer is valid and doesn't need to be repeated.",
      shafi: "In the Shafi'i madhhab, if Omar was unaware of the impurity and had no reason to suspect it, his prayer is valid and doesn't need to be repeated.",
      hanbali: "The Hanbali school considers that if Omar was unaware of the impurity and couldn't have reasonably known about it, his prayer is valid."
    }
  }
];

const FiqhMastermind: React.FC = () => {
  const [selectedMadhhab, setSelectedMadhhab] = useState<string>("");
  const [currentScenario, setCurrentScenario] = useState<FiqhScenario | null>(null);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [availableScenarios, setAvailableScenarios] = useState<FiqhScenario[]>([]);

  const startGame = (madhhab: string) => {
    setSelectedMadhhab(madhhab);
    setAvailableScenarios([...scenarios]);
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setRound(1);
    setShowExplanation(false);
    newRound();
    toast(`Game started with ${madhhab} madhhab!`);
  };

  const newRound = () => {
    if (availableScenarios.length === 0) {
      endGame();
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableScenarios.length);
    const selectedScenario = availableScenarios[randomIndex];
    
    // Remove the selected scenario from available list
    setAvailableScenarios(prev => prev.filter((_, index) => index !== randomIndex));
    
    setCurrentScenario(selectedScenario);
    setSelectedAnswer(null);
    setCorrectAnswer(null);
    setShowExplanation(false);
  };

  const checkAnswer = (answerIndex: number) => {
    if (!currentScenario || selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    
    const correctAnswerIndex = currentScenario.answers[selectedMadhhab as keyof typeof currentScenario.answers];
    setCorrectAnswer(correctAnswerIndex);
    
    if (answerIndex === correctAnswerIndex) {
      setScore(prev => prev + 100);
      toast.success("Correct! +100 points");
    } else {
      toast.error("Incorrect answer");
    }
    
    setTimeout(() => {
      setShowExplanation(true);
    }, 1000);
  };

  const handleNextRound = () => {
    if (round < 5) { // Play 5 rounds
      setRound(prev => prev + 1);
      newRound();
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setGameOver(true);
    let message = "";
    
    if (score >= 400) {
      message = "Excellent! You're a Fiqh expert!";
    } else if (score >= 300) {
      message = "Great job! You know your madhhab well!";
    } else if (score >= 200) {
      message = "Good effort! Keep learning about Islamic jurisprudence!";
    } else {
      message = "Keep studying! Fiqh is a deep and rewarding field of knowledge!";
    }
    
    toast(message);
  };

  const getScoreColor = () => {
    if (score >= 400) return "text-green-600";
    if (score >= 300) return "text-blue-600";
    if (score >= 200) return "text-amber-600";
    return "text-slate-600";
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setSelectedMadhhab("");
  };

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Fiqh Mastermind</h1>
          <p className="text-lg text-muted-foreground">Test your knowledge of Islamic jurisprudence through real-life scenarios</p>
        </div>
        
        {!gameStarted && !gameOver && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Welcome to Fiqh Mastermind</CardTitle>
              <CardDescription>
                Choose a madhhab (school of Islamic jurisprudence) and test your knowledge of its rulings on various scenarios.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-islamic-primary" />
                <p>Learn practical fiqh rulings</p>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-islamic-primary" />
                <p>Understand differences between madhhabs</p>
              </div>
              <div className="flex items-center gap-2">
                <Book className="h-5 w-5 text-islamic-primary" />
                <p>5 rounds of challenging scenarios</p>
              </div>
              
              <div className="mt-4">
                <p className="mb-2 font-medium">Select a Madhhab:</p>
                <Select onValueChange={(value) => startGame(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a school of thought" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Madhhabs</SelectLabel>
                      <SelectItem value="hanafi">Hanafi</SelectItem>
                      <SelectItem value="maliki">Maliki</SelectItem>
                      <SelectItem value="shafi">Shafi'i</SelectItem>
                      <SelectItem value="hanbali">Hanbali</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}
        
        {gameStarted && !gameOver && currentScenario && (
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <Badge variant="outline" className="text-sm px-3 py-1">
                Round: {round}/5
              </Badge>
              <Badge className="bg-amber-500 text-white">
                Score: {score}
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1 capitalize">
                {selectedMadhhab} Madhhab
              </Badge>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{currentScenario.scenario}</CardTitle>
                <CardDescription className="text-base font-medium mt-2">
                  {currentScenario.question}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!showExplanation ? (
                  <div className="grid grid-cols-1 gap-3">
                    {currentScenario.options.map((option, index) => (
                      <Button
                        key={index}
                        variant={selectedAnswer === null 
                          ? "outline" 
                          : selectedAnswer === index 
                            ? index === correctAnswer 
                              ? "default" 
                              : "destructive" 
                            : index === correctAnswer && selectedAnswer !== null 
                              ? "default" 
                              : "outline"
                        }
                        className={`p-4 h-auto text-left justify-start ${
                          selectedAnswer === null 
                            ? "hover:bg-islamic-primary/10" 
                            : selectedAnswer === index 
                              ? index === correctAnswer 
                                ? "bg-green-500 hover:bg-green-500 text-white" 
                                : "bg-red-500 hover:bg-red-500 text-white" 
                              : index === correctAnswer && selectedAnswer !== null 
                                ? "bg-green-500 hover:bg-green-500 text-white" 
                                : ""
                        }`}
                        onClick={() => checkAnswer(index)}
                        disabled={selectedAnswer !== null}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-2 p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-amber-800 mb-1">According to the {selectedMadhhab.charAt(0).toUpperCase() + selectedMadhhab.slice(1)} madhhab:</p>
                        <p className="text-amber-700">{currentScenario.explanation[selectedMadhhab as keyof typeof currentScenario.explanation]}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 items-center">
                      {selectedAnswer === correctAnswer ? (
                        <>
                          <Check className="h-5 w-5 text-green-500" />
                          <p className="text-green-700 font-medium">Your answer was correct!</p>
                        </>
                      ) : (
                        <>
                          <X className="h-5 w-5 text-red-500" />
                          <p className="text-red-700 font-medium">
                            The correct answer was: {currentScenario.options[correctAnswer as number]}
                          </p>
                        </>
                      )}
                    </div>
                    
                    <Button 
                      onClick={handleNextRound}
                      className="w-full mt-4 bg-islamic-primary hover:bg-islamic-primary/90"
                    >
                      {round < 5 ? "Next Scenario" : "Finish Game"}
                    </Button>
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
                Your knowledge of {selectedMadhhab.charAt(0).toUpperCase() + selectedMadhhab.slice(1)} fiqh rulings
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-center">
              <div className="flex items-center justify-center mb-4">
                <Brain className="h-8 w-8 text-amber-500 mr-2" />
                <span className={`text-3xl font-bold ${getScoreColor()}`}>{score}</span>
                <span className="text-xl ml-2">points</span>
              </div>
              
              <p className="text-lg">
                {score >= 400
                  ? "Excellent! You're a Fiqh expert!"
                  : score >= 300
                  ? "Great job! You know your madhhab well!"
                  : score >= 200
                  ? "Good effort! Keep learning about Islamic jurisprudence!"
                  : "Keep studying! Fiqh is a deep and rewarding field of knowledge!"}
              </p>
              
              <div className="flex items-center justify-center mt-2">
                <Book className="h-5 w-5 text-islamic-primary mr-2" />
                <p className="text-muted-foreground">
                  The diversity of opinions in Islamic jurisprudence is a mercy for the ummah.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button
                onClick={() => startGame(selectedMadhhab)}
                className="w-full bg-islamic-primary hover:bg-islamic-primary/90"
              >
                Play Again with {selectedMadhhab.charAt(0).toUpperCase() + selectedMadhhab.slice(1)} Madhhab
              </Button>
              <Button
                onClick={resetGame}
                variant="outline"
                className="w-full"
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Choose Different Madhhab
              </Button>
            </CardFooter>
          </Card>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default FiqhMastermind;
