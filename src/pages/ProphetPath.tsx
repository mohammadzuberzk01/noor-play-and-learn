
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, History, Calendar as CalendarIcon, Star, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface Event {
  year: string;
  age: number;
  event: string;
  details: string;
}

const timelineEvents: Event[] = [
  {
    year: "570 CE",
    age: 0,
    event: "Birth of Prophet Muhammad (PBUH)",
    details: "Born in Mecca in the Year of the Elephant. His father Abdullah had passed away before his birth."
  },
  {
    year: "576 CE",
    age: 6,
    event: "Death of his mother Aminah",
    details: "After his mother's death, he went to live with his grandfather Abdul Muttalib."
  },
  {
    year: "578 CE",
    age: 8,
    event: "Death of his grandfather",
    details: "After Abdul Muttalib's death, his uncle Abu Talib took care of him."
  },
  {
    year: "582 CE",
    age: 12,
    event: "First journey to Syria",
    details: "Accompanied his uncle Abu Talib on a trading journey to Syria where the Christian monk Bahira recognized signs of prophethood in him."
  },
  {
    year: "595 CE",
    age: 25,
    event: "Marriage to Khadijah",
    details: "Married Khadijah bint Khuwaylid, a 40-year-old wealthy merchant and his employer. She was the first to believe in his prophethood."
  },
  {
    year: "605 CE",
    age: 35,
    event: "Placement of the Black Stone",
    details: "Arbitrated in a dispute over who would place the Black Stone in the rebuilt Kaaba, suggesting a solution that satisfied all tribes."
  },
  {
    year: "610 CE",
    age: 40,
    event: "First Revelation",
    details: "Received the first revelation of the Quran from Angel Jibreel in the Cave of Hira during the month of Ramadan."
  },
  {
    year: "613 CE",
    age: 43,
    event: "Public Preaching Begins",
    details: "After three years of private preaching, he began to preach Islam publicly in Mecca."
  },
  {
    year: "615 CE",
    age: 45,
    event: "First Migration to Abyssinia",
    details: "Some Muslims migrated to Abyssinia to escape persecution in Mecca, finding protection under the Christian king Negus."
  },
  {
    year: "619 CE",
    age: 49,
    event: "Year of Sorrow",
    details: "His beloved wife Khadijah and his uncle/protector Abu Talib both died in this year, greatly increasing his hardship."
  },
  {
    year: "620 CE",
    age: 50,
    event: "Night Journey and Ascension",
    details: "Isra and Mi'raj: Miraculous night journey from Mecca to Jerusalem and then ascension through the heavens where the five daily prayers were prescribed."
  },
  {
    year: "621 CE",
    age: 51,
    event: "First Pledge of Aqaba",
    details: "Twelve men from Yathrib (later Medina) pledged allegiance to the Prophet, marking the beginning of Islam in Medina."
  },
  {
    year: "622 CE",
    age: 52,
    event: "Hijrah to Medina",
    details: "Migration from Mecca to Medina with Abu Bakr, marking the beginning of the Islamic calendar."
  },
  {
    year: "624 CE",
    age: 54,
    event: "Battle of Badr",
    details: "First major battle between Muslims and Meccans, resulting in a decisive Muslim victory despite being outnumbered."
  },
  {
    year: "625 CE",
    age: 55,
    event: "Battle of Uhud",
    details: "Muslims initially had the upper hand but suffered losses when archers left their positions against orders."
  },
  {
    year: "627 CE",
    age: 57,
    event: "Battle of the Trench",
    details: "Muslims dug a trench around Medina to defend against a coalition of Meccan forces and their allies."
  },
  {
    year: "628 CE",
    age: 58,
    event: "Treaty of Hudaybiyyah",
    details: "A peace treaty with the Meccans that allowed Muslims to perform pilgrimage the following year and brought a temporary peace."
  },
  {
    year: "630 CE",
    age: 60,
    event: "Conquest of Mecca",
    details: "Peaceful takeover of Mecca after the Quraysh violated the Treaty of Hudaybiyyah. The Prophet forgave the Meccans who had persecuted him."
  },
  {
    year: "631 CE",
    age: 61,
    event: "Year of Delegations",
    details: "Various Arabian tribes sent delegations to Medina to accept Islam and pledge allegiance to the Prophet."
  },
  {
    year: "632 CE",
    age: 62,
    event: "Farewell Pilgrimage and Death",
    details: "Performed his only Hajj pilgrimage as a Muslim and delivered his Farewell Sermon. Passed away in Medina after a brief illness."
  }
];

const ProphetPath: React.FC = () => {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [eventsToOrder, setEventsToOrder] = useState<Event[]>([]);
  const [orderedEvents, setOrderedEvents] = useState<Event[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(120);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [correctOrder, setCorrectOrder] = useState<Event[]>([]);

  const startGame = () => {
    // Select 8 random events from the timeline
    const shuffledEvents = [...timelineEvents].sort(() => 0.5 - Math.random()).slice(0, 8);
    // Sort them by year for the correct answer
    const correct = [...shuffledEvents].sort((a, b) => a.age - b.age);
    
    setCorrectOrder(correct);
    // Shuffle them again for the player to order
    setEventsToOrder([...shuffledEvents].sort(() => 0.5 - Math.random()));
    setOrderedEvents([]);
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setCurrentRound(1);
    setTimeLeft(120);
    setShowResults(false);
    
    toast("Arrange the events from Prophet Muhammad's (PBUH) life in chronological order!");
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (gameStarted && !gameOver && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !gameOver) {
      checkAnswers();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, gameStarted, gameOver]);

  const addToOrdered = (event: Event) => {
    setEventsToOrder(prev => prev.filter(e => e.year !== event.year));
    setOrderedEvents(prev => [...prev, event]);
  };

  const removeFromOrdered = (event: Event) => {
    setOrderedEvents(prev => prev.filter(e => e.year !== event.year));
    setEventsToOrder(prev => [...prev, event]);
  };

  const checkAnswers = () => {
    if (orderedEvents.length < correctOrder.length) {
      toast.error("Please arrange all events before submitting!");
      return;
    }
    
    // Count correct positions
    let correctPositions = 0;
    for (let i = 0; i < orderedEvents.length; i++) {
      if (orderedEvents[i].year === correctOrder[i].year) {
        correctPositions++;
      }
    }
    
    const newScore = Math.round((correctPositions / orderedEvents.length) * 100);
    setScore(newScore);
    setShowResults(true);
    setGameOver(true);
    
    if (newScore === 100) {
      toast.success("Perfect! You got all events in the correct order!");
    } else if (newScore >= 75) {
      toast.success("Great job! You have a good understanding of the Prophet's life!");
    } else if (newScore >= 50) {
      toast("Good effort! You got some events in the right order.");
    } else {
      toast("Keep learning about the Prophet's life! It's a fascinating journey.");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Prophet Path Puzzle</h1>
          <p className="text-lg text-muted-foreground">Arrange the events from the life of Prophet Muhammad (PBUH) in chronological order</p>
        </div>
        
        {!gameStarted && !gameOver && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Welcome to Prophet Path</CardTitle>
              <CardDescription>
                Test your knowledge of the Prophet Muhammad's (PBUH) life by arranging key events in chronological order.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-islamic-primary" />
                <p>Learn about the Seerah (biography) of the Prophet</p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-islamic-primary" />
                <p>You have 2 minutes to complete the timeline</p>
              </div>
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-islamic-primary" />
                <p>Arrange 8 key events in the Prophet's life</p>
              </div>
              <Button onClick={startGame} className="w-full mt-4 bg-islamic-primary hover:bg-islamic-primary/90">
                Start Game
              </Button>
            </CardContent>
          </Card>
        )}
        
        {gameStarted && !gameOver && (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <Badge variant="outline" className="text-sm px-3 py-1">
                Round: {currentRound}
              </Badge>
              <Badge className="bg-amber-500 text-white flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatTime(timeLeft)}
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">
                Events Placed: {orderedEvents.length}/{correctOrder.length}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Events to Arrange</CardTitle>
                  <CardDescription>
                    Click on events to add them to your timeline
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {eventsToOrder.map((event, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full flex flex-col items-start p-4 h-auto text-left justify-start hover:bg-islamic-primary/10"
                        onClick={() => addToOrdered(event)}
                      >
                        <div className="flex justify-between w-full">
                          <span className="font-bold">{event.event}</span>
                          <Badge variant="outline">{event.year}</Badge>
                        </div>
                      </Button>
                    ))}
                    {eventsToOrder.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">All events have been placed on the timeline</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Timeline</CardTitle>
                  <CardDescription>
                    Arrange events in chronological order (earliest to latest)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {orderedEvents.map((event, index) => (
                      <div 
                        key={index} 
                        className="relative flex items-center"
                      >
                        <div className="absolute left-4 h-full">
                          {index < orderedEvents.length - 1 && (
                            <div className="absolute top-5 left-0 w-0.5 h-full bg-islamic-primary/30"></div>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          className="w-full flex flex-col items-start p-4 h-auto text-left justify-start hover:bg-islamic-primary/10 border-islamic-primary/30"
                          onClick={() => removeFromOrdered(event)}
                        >
                          <div className="flex justify-between w-full">
                            <span className="font-bold">{event.event}</span>
                            <Badge variant="outline">{event.year}</Badge>
                          </div>
                        </Button>
                      </div>
                    ))}
                    {orderedEvents.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">Click on events to add them to your timeline</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={checkAnswers} 
                    className="w-full bg-islamic-primary hover:bg-islamic-primary/90"
                    disabled={orderedEvents.length < correctOrder.length}
                  >
                    Submit Timeline
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
        
        {showResults && (
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
                <CardDescription>
                  You scored {score}% - {score === 100 ? "Perfect!" : score >= 75 ? "Great job!" : score >= 50 ? "Good effort!" : "Keep learning!"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-4">Correct Timeline:</h3>
                <div className="space-y-3">
                  {correctOrder.map((event, index) => {
                    const userEvent = orderedEvents[index];
                    const isCorrect = userEvent?.year === event.year;
                    
                    return (
                      <div key={index} className="relative flex items-start">
                        <div className="absolute left-4 top-0 h-full">
                          {index < correctOrder.length - 1 && (
                            <div className="absolute top-5 left-0 w-0.5 h-full bg-islamic-primary/30"></div>
                          )}
                        </div>
                        <div className="mr-3 pt-1">
                          {isCorrect ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <X className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <Card className={`w-full border ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                          <CardHeader className="p-4">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-base">{event.event}</CardTitle>
                              <Badge variant="outline">{event.year} (Age: {event.age})</Badge>
                            </div>
                            <CardDescription>
                              {event.details}
                            </CardDescription>
                          </CardHeader>
                          {!isCorrect && (
                            <CardFooter className="p-4 pt-0 border-t border-red-200">
                              <div className="flex items-center text-sm text-red-600">
                                <span>Your answer: </span>
                                <Badge variant="outline" className="ml-2">{userEvent?.event || "None"}</Badge>
                              </div>
                            </CardFooter>
                          )}
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={startGame} 
                  className="w-full bg-islamic-primary hover:bg-islamic-primary/90"
                >
                  Play Again
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ProphetPath;
