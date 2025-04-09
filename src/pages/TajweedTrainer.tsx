import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Volume, Mic, PlayCircle, PauseCircle, AlertCircle, CheckCircle, Book } from 'lucide-react';
import { toast } from 'sonner';

const tajweedRules = [
  {
    id: 'idghaam',
    name: 'Idghaam (Merging)',
    description: 'When certain letters meet, one merges into the other',
    examples: [
      {
        arabic: 'مِن رَّبِّهِمْ',
        transliteration: 'Mir Rabbihim',
        audioUrl: 'https://www.islamicnet.com/islamic-audios/tajweed/idghaam1.mp3',
        surah: 'Al-Baqarah 2:5'
      },
      {
        arabic: 'قُل رَّبِّ',
        transliteration: 'Qur Rabbi',
        audioUrl: 'https://www.islamicnet.com/islamic-audios/tajweed/idghaam2.mp3',
        surah: 'Al-Mu\'minun 23:118'
      }
    ]
  },
  {
    id: 'ikhfaa',
    name: 'Ikhfaa (Hiding)',
    description: 'When noon saakinah or tanween is followed by certain letters, it\'s pronounced with a nasal sound',
    examples: [
      {
        arabic: 'مِن كُلِّ',
        transliteration: 'Min Kulli',
        audioUrl: 'https://www.islamicnet.com/islamic-audios/tajweed/ikhfaa_example1.mp3',
        surah: 'Ibrahim 14:34'
      },
      {
        arabic: 'أَنفُسَكُمْ',
        transliteration: 'Anfusakum',
        audioUrl: 'https://www.islamicnet.com/islamic-audios/tajweed/ikhfaa_example2.mp3',
        surah: 'Al-Baqarah 2:284'
      }
    ]
  },
  {
    id: 'qalqalah',
    name: 'Qalqalah (Echoing)',
    description: 'When certain letters (ق ط ب ج د) have sukoon, they\'re pronounced with a slight bounce',
    examples: [
      {
        arabic: 'قُلْ أَعُوذُ',
        transliteration: 'Qul a\'oodhu',
        audioUrl: 'https://www.islamicnet.com/islamic-audios/tajweed/qalqalah_example1.mp3',
        surah: 'Al-Falaq 113:1'
      },
      {
        arabic: 'وَتَبَّ',
        transliteration: 'Wa tabb',
        audioUrl: 'https://www.islamicnet.com/islamic-audios/tajweed/qalqalah_example2.mp3',
        surah: 'Al-Masad 111:1'
      }
    ]
  },
  {
    id: 'madd',
    name: 'Madd (Elongation)',
    description: 'Extending the sound of certain letters for a specific duration',
    examples: [
      {
        arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ',
        transliteration: 'Laa ilaaha illallah',
        audioUrl: 'https://www.islamicnet.com/islamic-audios/tajweed/madd_example1.mp3',
        surah: 'Muhammad 47:19'
      },
      {
        arabic: 'آمَنُوا',
        transliteration: 'Aamanoo',
        audioUrl: 'https://www.islamicnet.com/islamic-audios/tajweed/madd_example2.mp3',
        surah: 'Al-Baqarah 2:3'
      }
    ]
  }
];

const practiceExercises = {
  beginner: [
    {
      id: 'b1',
      arabic: 'بِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحِيمِ',
      transliteration: 'Bismillahir Rahmanir Raheem',
      meaning: 'In the name of Allah, the Most Gracious, the Most Merciful',
      rules: ['idghaam', 'madd'],
      audioUrl: 'https://www.everyayah.com/data/AbdulSamad_64kbps_QuranExplorer.Com/001001.mp3'
    },
    {
      id: 'b2',
      arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
      transliteration: 'Qul huwa Allahu ahad',
      meaning: 'Say, "He is Allah, [who is] One"',
      rules: ['qalqalah', 'madd'],
      audioUrl: 'https://www.everyayah.com/data/AbdulSamad_64kbps_QuranExplorer.Com/112001.mp3'
    }
  ],
  intermediate: [
    {
      id: 'i1',
      arabic: 'وَمَا أَدْرَاكَ مَا الْقَارِعَةُ',
      transliteration: 'Wa maa adraaka mal qaari\'ah',
      meaning: 'And what can make you know what is the Striking Calamity?',
      rules: ['madd', 'qalqalah', 'ikhfaa'],
      audioUrl: 'https://www.islamicnet.com/islamic-audios/tajweed/qariah_3.mp3'
    },
    {
      id: 'i2',
      arabic: 'إِنَّ الإِنسَانَ لَفِي خُسْرٍ',
      transliteration: 'Innal insaana lafee khusr',
      meaning: 'Indeed, mankind is in loss',
      rules: ['idghaam', 'ikhfaa'],
      audioUrl: 'https://www.islamicnet.com/islamic-audios/tajweed/asr_2.mp3'
    }
  ],
  advanced: [
    {
      id: 'a1',
      arabic: 'وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
      transliteration: 'Wa min sharrin-naffaathaati fil-\'uqad',
      meaning: 'And from the evil of the blowers in knots',
      rules: ['idghaam', 'ikhfaa', 'qalqalah'],
      audioUrl: 'https://www.islamicnet.com/islamic-audios/tajweed/falaq_4.mp3'
    },
    {
      id: 'a2',
      arabic: 'أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ',
      transliteration: 'Alam nashrah laka sadrak',
      meaning: 'Have We not expanded for you your breast?',
      rules: ['qalqalah', 'ikhfaa'],
      audioUrl: 'https://www.islamicnet.com/islamic-audios/tajweed/sharh_1.mp3'
    }
  ]
};

const TajweedTrainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState('learn');
  const [selectedRule, setSelectedRule] = useState(tajweedRules[0]);
  const [practiceLevel, setPracticeLevel] = useState('beginner');
  const [currentExercise, setCurrentExercise] = useState(practiceExercises.beginner[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const playExampleAudio = (url: string) => {
    const audio = new Audio(url);
    audio.play().catch(err => {
      console.error("Audio playback failed:", err);
      toast.error("Audio playback failed. Please try again.");
    });
  };

  const handleRuleSelect = (ruleId: string) => {
    const rule = tajweedRules.find(r => r.id === ruleId);
    if (rule) {
      setSelectedRule(rule);
    }
  };

  const handlePracticeLevel = (level: string) => {
    setPracticeLevel(level);
    if (level === 'beginner') {
      setCurrentExercise(practiceExercises.beginner[0]);
    } else if (level === 'intermediate') {
      setCurrentExercise(practiceExercises.intermediate[0]);
    } else {
      setCurrentExercise(practiceExercises.advanced[0]);
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => {
        console.error("Audio playback failed:", err);
        toast.error("Audio playback failed. Please try again.");
      });
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const analyzePronunciation = (): number => {
    const baseScore = Math.random() * 0.7;
    const biasedScore = 0.3 + baseScore;
    const difficultyAdjustment = 
      practiceLevel === 'beginner' ? 0.1 :
      practiceLevel === 'intermediate' ? 0 : -0.1;
      
    let adjustedScore = biasedScore + difficultyAdjustment;
    adjustedScore = Math.max(0, Math.min(1, adjustedScore));
    
    return adjustedScore;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const score = analyzePronunciation();
        setProgress(Math.round(score * 100));
        
        if (score > 0.8) {
          setFeedback("Excellent pronunciation! Your tajweed is very good.");
          toast.success("Excellent pronunciation!");
        } else if (score > 0.5) {
          setFeedback("Good attempt. Try to focus on the correct elongation (madd).");
          toast("Good attempt. Keep practicing!");
        } else {
          setFeedback("Need more practice. Listen to the example again and try to match the pronunciation.");
          toast.error("Need more practice. Listen to the example again.");
        }
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      toast("Recording started. Recite the verse...");
      
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
          stopRecording();
        }
      }, 5000);
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone. Please check your browser permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast("Recording completed. Analyzing your pronunciation...");
    }
  };

  const nextExercise = () => {
    const currentExercises = 
      practiceLevel === 'beginner' ? practiceExercises.beginner :
      practiceLevel === 'intermediate' ? practiceExercises.intermediate :
      practiceExercises.advanced;
      
    const currentIndex = currentExercises.findIndex(ex => ex.id === currentExercise.id);
    const nextIndex = (currentIndex + 1) % currentExercises.length;
    
    setCurrentExercise(currentExercises[nextIndex]);
    setFeedback(null);
    setProgress(0);
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Tajweed Trainer</h1>
          <p className="text-lg text-muted-foreground">
            Practice correct Quranic pronunciation with voice feedback
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="learn">Learn Tajweed Rules</TabsTrigger>
            <TabsTrigger value="practice">Practice Pronunciation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="learn" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Tajweed Rules</CardTitle>
                  <CardDescription>
                    Select a rule to learn more about it
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    {tajweedRules.map(rule => (
                      <Button 
                        key={rule.id}
                        variant={selectedRule.id === rule.id ? "default" : "outline"}
                        className="justify-start w-full"
                        onClick={() => handleRuleSelect(rule.id)}
                      >
                        {rule.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>{selectedRule.name}</CardTitle>
                  <CardDescription>{selectedRule.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <h3 className="text-lg font-medium mb-3">Examples:</h3>
                  <div className="space-y-4">
                    {selectedRule.examples.map((example, index) => (
                      <div key={index} className="p-4 bg-slate-50 rounded-md">
                        <div className="mb-2 flex justify-between items-start">
                          <div>
                            <p className="text-xl font-arabic mb-1 text-right">{example.arabic}</p>
                            <p className="text-sm text-muted-foreground">{example.transliteration}</p>
                          </div>
                          <Badge variant="outline">{example.surah}</Badge>
                        </div>
                        <div className="flex justify-end mt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={() => playExampleAudio(example.audioUrl)}
                          >
                            <Volume className="h-4 w-4" />
                            <span>Listen</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    <AlertCircle className="h-4 w-4 inline-block mr-1" />
                    Consistent practice is key to mastering tajweed
                  </p>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="practice" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Practice Levels</CardTitle>
                  <CardDescription>
                    Choose a level based on your experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant={practiceLevel === 'beginner' ? "default" : "outline"}
                      className="justify-start w-full"
                      onClick={() => handlePracticeLevel('beginner')}
                    >
                      Beginner
                    </Button>
                    <Button 
                      variant={practiceLevel === 'intermediate' ? "default" : "outline"}
                      className="justify-start w-full"
                      onClick={() => handlePracticeLevel('intermediate')}
                    >
                      Intermediate
                    </Button>
                    <Button 
                      variant={practiceLevel === 'advanced' ? "default" : "outline"}
                      className="justify-start w-full"
                      onClick={() => handlePracticeLevel('advanced')}
                    >
                      Advanced
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    <Book className="h-4 w-4 inline-block mr-1" />
                    Start with beginner exercises if you're new to tajweed
                  </p>
                </CardFooter>
              </Card>
              
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Practice Exercise</CardTitle>
                      <CardDescription>
                        Listen to the audio and then record yourself reciting
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      {currentExercise?.rules.map(rule => {
                        const ruleInfo = tajweedRules.find(r => r.id === rule);
                        return (
                          <Badge key={rule} variant="outline" className="text-xs">
                            {ruleInfo?.name || rule}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-5 bg-slate-50 rounded-md mb-6">
                    <p className="text-2xl font-arabic mb-3 text-center">{currentExercise?.arabic}</p>
                    <p className="text-sm text-center mb-1">{currentExercise?.transliteration}</p>
                    <p className="text-xs text-muted-foreground text-center italic">"{currentExercise?.meaning}"</p>
                    
                    <div className="flex justify-center mt-4 gap-2">
                      {!isPlaying ? (
                        <Button 
                          onClick={playAudio}
                          variant="outline" 
                          className="flex items-center gap-1"
                        >
                          <PlayCircle className="h-4 w-4" />
                          <span>Listen</span>
                        </Button>
                      ) : (
                        <Button 
                          onClick={pauseAudio}
                          variant="outline" 
                          className="flex items-center gap-1"
                        >
                          <PauseCircle className="h-4 w-4" />
                          <span>Pause</span>
                        </Button>
                      )}
                      
                      <audio 
                        ref={audioRef}
                        src={currentExercise?.audioUrl} 
                        onEnded={() => setIsPlaying(false)}
                        className="hidden"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-sm text-center mb-2">
                      Now try to recite it yourself with correct tajweed:
                    </p>
                    
                    {!isRecording ? (
                      <Button 
                        onClick={startRecording}
                        className="bg-islamic-primary hover:bg-islamic-primary/90"
                        disabled={isPlaying}
                      >
                        <Mic className="h-4 w-4 mr-2" />
                        Record Your Recitation
                      </Button>
                    ) : (
                      <Button 
                        onClick={stopRecording}
                        variant="destructive"
                      >
                        Stop Recording
                      </Button>
                    )}
                    
                    {feedback && (
                      <div className="w-full mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Pronunciation Score:</span>
                          <span className="text-sm">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2 mb-3" />
                        <div className={`p-3 rounded text-sm ${
                          progress > 80 ? "bg-green-50 text-green-700" : 
                          progress > 50 ? "bg-yellow-50 text-yellow-700" : "bg-red-50 text-red-700"
                        }`}>
                          {progress > 80 ? (
                            <CheckCircle className="h-4 w-4 inline-block mr-1" />
                          ) : (
                            <AlertCircle className="h-4 w-4 inline-block mr-1" />
                          )}
                          {feedback}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => {
                    setFeedback(null);
                    setProgress(0);
                  }}>
                    Reset
                  </Button>
                  <Button onClick={nextExercise}>
                    Next Exercise
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default TajweedTrainer;
