import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Shuffle, Volume, Check, Heart, Lightbulb, Play } from 'lucide-react';

interface VerseWord {
  id: string;
  text: string;
  position: number;
}

interface Verse {
  id: number;
  surah: string;
  ayahNumber: number;
  arabicText: string;
  englishTranslation: string;
  words: VerseWord[];
  audioUrl?: string;
}

const QuranPuzzle = () => {
  const [currentVerse, setCurrentVerse] = useState<Verse | null>(null);
  const [shuffledWords, setShuffledWords] = useState<VerseWord[]>([]);
  const [arrangedWords, setArrangedWords] = useState<VerseWord[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [hintUsed, setHintUsed] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const verses: Verse[] = [
    {
      id: 1,
      surah: 'Al-Fatihah',
      ayahNumber: 1,
      arabicText: 'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ',
      englishTranslation: 'In the name of Allah, the Most Gracious, the Most Merciful',
      words: [
        { id: 'w1', text: 'بِسْمِ', position: 0 },
        { id: 'w2', text: 'اللهِ', position: 1 },
        { id: 'w3', text: 'الرَّحْمٰنِ', position: 2 },
        { id: 'w4', text: 'الرَّحِيْمِ', position: 3 }
      ],
      audioUrl: 'https://verses.quran.com/AbdulBaset/Mujawwad/mp3/001001.mp3'
    },
    {
      id: 2,
      surah: 'Al-Fatihah',
      ayahNumber: 2,
      arabicText: 'الْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَ',
      englishTranslation: 'All praise is due to Allah, Lord of the worlds',
      words: [
        { id: 'w1', text: 'الْحَمْدُ', position: 0 },
        { id: 'w2', text: 'لِلّٰهِ', position: 1 },
        { id: 'w3', text: 'رَبِّ', position: 2 },
        { id: 'w4', text: 'الْعٰلَمِيْنَ', position: 3 }
      ],
      audioUrl: 'https://verses.quran.com/AbdulBaset/Mujawwad/mp3/001002.mp3'
    },
    {
      id: 3,
      surah: 'Al-Ikhlas',
      ayahNumber: 1,
      arabicText: 'قُلْ هُوَ اللّٰهُ اَحَدٌ',
      englishTranslation: 'Say, "He is Allah, the One"',
      words: [
        { id: 'w1', text: 'قُلْ', position: 0 },
        { id: 'w2', text: 'هُوَ', position: 1 },
        { id: 'w3', text: 'اللّٰهُ', position: 2 },
        { id: 'w4', text: 'اَحَدٌ', position: 3 }
      ],
      audioUrl: 'https://verses.quran.com/AbdulBaset/Mujawwad/mp3/112001.mp3'
    },
    {
      id: 4,
      surah: 'Al-Ikhlas',
      ayahNumber: 2,
      arabicText: 'اَللّٰهُ الصَّمَدُ',
      englishTranslation: 'Allah, the Eternal Refuge',
      words: [
        { id: 'w1', text: 'اَللّٰهُ', position: 0 },
        { id: 'w2', text: 'الصَّمَدُ', position: 1 }
      ],
      audioUrl: 'https://verses.quran.com/AbdulBaset/Mujawwad/mp3/112002.mp3'
    },
    {
      id: 5,
      surah: 'Al-Nas',
      ayahNumber: 1,
      arabicText: 'قُلْ اَعُوْذُ بِرَبِّ النَّاسِ',
      englishTranslation: 'Say, "I seek refuge in the Lord of mankind"',
      words: [
        { id: 'w1', text: 'قُلْ', position: 0 },
        { id: 'w2', text: 'اَعُوْذُ', position: 1 },
        { id: 'w3', text: 'بِرَبِّ', position: 2 },
        { id: 'w4', text: 'النَّاسِ', position: 3 }
      ],
      audioUrl: 'https://verses.quran.com/AbdulBaset/Mujawwad/mp3/114001.mp3'
    },
    {
      id: 6,
      surah: 'Al-Kawthar',
      ayahNumber: 1,
      arabicText: 'اِنَّاۤ اَعْطَيْنٰكَ الْكَوْثَرَ',
      englishTranslation: 'Indeed, We have granted you Al-Kawthar',
      words: [
        { id: 'w1', text: 'اِنَّاۤ', position: 0 },
        { id: 'w2', text: 'اَعْطَيْنٰكَ', position: 1 },
        { id: 'w3', text: 'الْكَوْثَرَ', position: 2 }
      ],
      audioUrl: 'https://verses.quran.com/AbdulBaset/Mujawwad/mp3/108001.mp3'
    }
  ];

  useEffect(() => {
    if (gameStarted) {
      startNewPuzzle();
    }
  }, [gameStarted, difficulty]);

  useEffect(() => {
    if (arrangedWords.length > 0 && isCorrectArrangement()) {
      handlePuzzleComplete();
    }
  }, [arrangedWords]);

  useEffect(() => {
    return () => {
      if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.src = '';
      }
    };
  }, []);

  const startNewPuzzle = () => {
    let filteredVerses = verses;
    
    switch (difficulty) {
      case 'easy':
        filteredVerses = verses.filter(v => v.words.length <= 3);
        break;
      case 'medium':
        filteredVerses = verses.filter(v => v.words.length === 4);
        break;
      case 'hard':
        filteredVerses = verses.filter(v => v.words.length >= 5);
        break;
    }
    
    if (filteredVerses.length === 0) {
      filteredVerses = verses;
    }
    
    const randomIndex = Math.floor(Math.random() * filteredVerses.length);
    const selectedVerse = filteredVerses[randomIndex];
    
    const shuffled = [...selectedVerse.words];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    setCurrentVerse(selectedVerse);
    setShuffledWords(shuffled);
    setArrangedWords([]);
    setIsComplete(false);
    setHintUsed(false);
    
    if (selectedVerse.audioUrl) {
      const audio = new Audio(selectedVerse.audioUrl);
      setAudioPlayer(audio);
      setIsPlaying(false);
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
      });
    } else {
      setAudioPlayer(null);
    }
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    word: VerseWord,
    sourceArea: 'shuffled' | 'arranged'
  ) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ word, sourceArea }));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetArea: 'shuffled' | 'arranged',
    index?: number
  ) => {
    e.preventDefault();
    
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    const { word, sourceArea } = data;
    
    if (sourceArea === targetArea) return;
    
    if (sourceArea === 'shuffled' && targetArea === 'arranged') {
      setShuffledWords(shuffledWords.filter(w => w.id !== word.id));
      
      if (index !== undefined && index < arrangedWords.length) {
        const newArranged = [...arrangedWords];
        newArranged.splice(index, 0, word);
        setArrangedWords(newArranged);
      } else {
        setArrangedWords([...arrangedWords, word]);
      }
    } else if (sourceArea === 'arranged' && targetArea === 'shuffled') {
      setArrangedWords(arrangedWords.filter(w => w.id !== word.id));
      setShuffledWords([...shuffledWords, word]);
    }
  };

  const handleWordClick = (word: VerseWord, sourceArea: 'shuffled' | 'arranged') => {
    if (sourceArea === 'shuffled') {
      setShuffledWords(shuffledWords.filter(w => w.id !== word.id));
      setArrangedWords([...arrangedWords, word]);
    } else {
      setArrangedWords(arrangedWords.filter(w => w.id !== word.id));
      setShuffledWords([...shuffledWords, word]);
    }
  };

  const isCorrectArrangement = () => {
    if (!currentVerse || arrangedWords.length !== currentVerse.words.length) return false;
    
    return arrangedWords.every((word, index) => {
      const correctWord = currentVerse.words.find(w => w.position === index);
      return word.id === correctWord?.id;
    });
  };

  const handlePuzzleComplete = () => {
    if (isComplete) return;
    
    setIsComplete(true);
    
    const baseScore = 100;
    const hintPenalty = hintUsed ? 20 : 0;
    const finalScore = baseScore - hintPenalty;
    
    setScore(finalScore);
    
    toast.success('Congratulations! Verse arranged correctly!');
    
    if (audioPlayer) {
      playAudio();
    }
  };

  const useHint = () => {
    if (!currentVerse || arrangedWords.length === currentVerse.words.length) return;
    
    setHintUsed(true);
    
    const nextPosition = arrangedWords.length;
    const correctWord = currentVerse.words.find(w => w.position === nextPosition);
    
    if (correctWord) {
      setShuffledWords(shuffledWords.filter(w => w.id !== correctWord.id));
      setArrangedWords([...arrangedWords, correctWord]);
    }
  };

  const playAudio = () => {
    if (!audioPlayer) return;
    
    if (isPlaying) {
      audioPlayer.pause();
      setIsPlaying(false);
    } else {
      audioPlayer.currentTime = 0;
      audioPlayer.play().catch(err => {
        console.error("Audio playback failed:", err);
        toast.error("Audio playback failed. Please try again.");
      });
      setIsPlaying(true);
    }
  };

  const startGame = () => {
    setGameStarted(true);
  };

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Qur'an Verse Puzzle</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            Rearrange the words to complete Qur'anic verses and hear them beautifully recited.
          </p>
          
          {!gameStarted ? (
            <Card className="max-w-md mx-auto p-6">
              <CardHeader>
                <CardTitle>Start Qur'an Verse Puzzle</CardTitle>
                <CardDescription>Select difficulty level to begin</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-2">Difficulty</h3>
                  <div className="flex justify-center gap-2">
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
              </CardContent>
              
              <CardFooter>
                <Button 
                  onClick={startGame}
                  className="w-full"
                >
                  Start Puzzle
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <>
              {currentVerse && (
                <div className="max-w-3xl mx-auto">
                  <Card className="mb-8">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">
                          Surah {currentVerse.surah} ({currentVerse.ayahNumber})
                        </Badge>
                        <div className="flex gap-2">
                          {audioPlayer && (
                            <Button 
                              onClick={playAudio}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              {isPlaying ? (
                                <>
                                  <Volume className="h-4 w-4" />
                                  Playing...
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4" />
                                  Play Audio
                                </>
                              )}
                            </Button>
                          )}
                          <Button 
                            onClick={useHint}
                            variant="outline"
                            size="sm"
                            disabled={isComplete || !shuffledWords.length}
                            className="flex items-center gap-1"
                          >
                            <Lightbulb className="h-4 w-4" />
                            Hint
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Translation:</h3>
                        <p className="text-gray-600 italic">{currentVerse.englishTranslation}</p>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-2">Arranged Words:</h3>
                          <div 
                            className="min-h-20 p-4 border border-dashed border-gray-300 rounded-lg flex flex-wrap justify-center gap-2 items-center bg-white"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, 'arranged')}
                          >
                            {arrangedWords.length === 0 ? (
                              <p className="text-gray-400">Drag words here to arrange the verse</p>
                            ) : (
                              arrangedWords.map((word, index) => (
                                <div
                                  key={`arranged-${word.id}`}
                                  className="px-4 py-2 bg-islamic-primary text-white rounded-lg cursor-pointer hover:bg-islamic-primary/90 transition-colors text-2xl font-arabic"
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, word, 'arranged')}
                                  onClick={() => handleWordClick(word, 'arranged')}
                                  style={{ direction: 'rtl' }}
                                >
                                  {word.text}
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2">Available Words:</h3>
                          <div 
                            className="min-h-20 p-4 border border-dashed border-gray-300 rounded-lg flex flex-wrap justify-center gap-2 items-center bg-gray-50"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, 'shuffled')}
                          >
                            {shuffledWords.length === 0 ? (
                              <p className="text-gray-400">All words have been arranged</p>
                            ) : (
                              shuffledWords.map((word) => (
                                <div
                                  key={`shuffled-${word.id}`}
                                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors text-2xl font-arabic"
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, word, 'shuffled')}
                                  onClick={() => handleWordClick(word, 'shuffled')}
                                  style={{ direction: 'rtl' }}
                                >
                                  {word.text}
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between">
                      <Button
                        onClick={startNewPuzzle}
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Shuffle className="h-4 w-4" />
                        New Verse
                      </Button>
                      
                      {isComplete && (
                        <div className="flex items-center gap-2">
                          <Heart className="h-5 w-5 text-islamic-primary fill-islamic-primary" />
                          <Badge className="px-3 py-1">
                            Score: {score}/100
                          </Badge>
                          <Check className="h-5 w-5 text-green-600" />
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default QuranPuzzle;
