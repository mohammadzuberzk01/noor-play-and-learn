
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { BookOpen, ArrowRight, ArrowLeft, Home, Check } from 'lucide-react';

interface StoryChoice {
  id: string;
  text: string;
  nextPage: number;
  feedback?: string;
  isCorrect?: boolean;
}

interface StoryPage {
  id: number;
  text: string;
  image?: string;
  hasChoices: boolean;
  choices?: StoryChoice[];
  isEnding?: boolean;
}

interface Story {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  ageGroup: string;
  coverImage: string;
  pages: StoryPage[];
}

const Stories = () => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [completedStories, setCompletedStories] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState('all');
  
  const stories: Story[] = [
    {
      id: 'prophet-yusuf',
      title: 'The Story of Prophet Yusuf (AS)',
      description: 'Learn about the life of Prophet Yusuf (Joseph) and his journey from slavery to leadership.',
      category: 'prophets',
      difficulty: 'medium',
      ageGroup: '8-12',
      coverImage: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=600&q=80',
      pages: [
        {
          id: 0,
          text: 'Prophet Yusuf (AS) was the son of Prophet Yaqub (AS). He had eleven brothers. Yusuf had a dream where eleven stars, the sun, and the moon bowed to him. When he told his father about this dream, his father warned him not to tell his brothers, as they might become jealous.',
          hasChoices: false
        },
        {
          id: 1,
          text: 'Yusuf\'s brothers became jealous of him because their father loved him very much. They plotted against Yusuf. What did they do to him?',
          hasChoices: true,
          choices: [
            { 
              id: 'choice1', 
              text: 'They threw him in a well and told their father he was eaten by a wolf', 
              nextPage: 2,
              isCorrect: true,
              feedback: 'Correct! They threw him in a well and then sold him to a passing caravan. They told their father that a wolf had eaten Yusuf.' 
            },
            { 
              id: 'choice2', 
              text: 'They sent him to live with their uncle', 
              nextPage: 1,
              isCorrect: false,
              feedback: 'That\'s not what happened. They threw him in a well and then sold him to a passing caravan.' 
            },
            { 
              id: 'choice3', 
              text: 'They kept him locked in their house', 
              nextPage: 1,
              isCorrect: false,
              feedback: 'That\'s not what happened. They threw him in a well and then sold him to a passing caravan.' 
            }
          ]
        },
        {
          id: 2,
          text: 'After being thrown in the well, Yusuf was found by a caravan and sold as a slave in Egypt. He was bought by a high-ranking official named Al-Aziz. As Yusuf grew up, he became known for his honesty and good character. Allah blessed him with the ability to interpret dreams.',
          hasChoices: false
        },
        {
          id: 3,
          text: 'While in Egypt, Yusuf was falsely accused and put in prison. In prison, he interpreted dreams for two fellow prisoners. One of them later remembered Yusuf when the king of Egypt had a troubling dream that no one could interpret. What was the king\'s dream?',
          hasChoices: true,
          choices: [
            { 
              id: 'choice1', 
              text: 'Seven fat cows being eaten by seven lean cows', 
              nextPage: 4,
              isCorrect: true,
              feedback: 'Correct! The king dreamed of seven fat cows being eaten by seven lean ones, and seven green ears of grain and seven dry ones.' 
            },
            { 
              id: 'choice2', 
              text: 'A giant flood destroying the kingdom', 
              nextPage: 3,
              isCorrect: false,
              feedback: 'That\'s not what the king dreamed. He dreamed of seven fat cows being eaten by seven lean ones, and seven green ears of grain and seven dry ones.' 
            },
            { 
              id: 'choice3', 
              text: 'The sun, moon, and stars bowing to him', 
              nextPage: 3,
              isCorrect: false,
              feedback: 'That was actually Yusuf\'s own dream from his childhood, not the king\'s dream.' 
            }
          ]
        },
        {
          id: 4,
          text: 'Yusuf interpreted the king\'s dream: there would be seven years of good harvest followed by seven years of drought. He advised the king to store grain during the good years to prepare for the difficult years ahead. The king was impressed and appointed Yusuf to a high position to manage Egypt\'s resources.',
          hasChoices: false
        },
        {
          id: 5,
          text: 'During the years of drought, Yusuf\'s brothers came to Egypt seeking food. They did not recognize Yusuf, who had grown up and was now a powerful official. What did Yusuf do when he saw his brothers?',
          hasChoices: true,
          choices: [
            { 
              id: 'choice1', 
              text: 'He immediately forgave them and revealed who he was', 
              nextPage: 5,
              isCorrect: false,
              feedback: 'Actually, Yusuf recognized them but didn\'t immediately reveal his identity. He tested them first to see if they had changed.' 
            },
            { 
              id: 'choice2', 
              text: 'He punished them for what they had done to him', 
              nextPage: 5,
              isCorrect: false,
              feedback: 'No, Yusuf didn\'t seek revenge. He recognized them but didn\'t immediately reveal his identity, testing them first.' 
            },
            { 
              id: 'choice3', 
              text: 'He recognized them but didn\'t reveal who he was right away', 
              nextPage: 6,
              isCorrect: true,
              feedback: 'Correct! Yusuf recognized his brothers but didn\'t reveal his identity immediately. He tested them to see if they had changed.' 
            }
          ]
        },
        {
          id: 6,
          text: 'Yusuf eventually revealed his identity to his brothers and forgave them. He invited his entire family to Egypt, reuniting with his father after many years of separation. The dream he had as a young boy came true when his family bowed before him out of respect for his position.',
          hasChoices: false,
          isEnding: true
        }
      ]
    },
    {
      id: 'prophet-ibrahim',
      title: 'The Story of Prophet Ibrahim (AS)',
      description: 'Discover how Ibrahim (Abraham) challenged idol worship and showed unwavering faith in Allah.',
      category: 'prophets',
      difficulty: 'easy',
      ageGroup: '6-10',
      coverImage: 'https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?auto=format&fit=crop&w=600&q=80',
      pages: [
        {
          id: 0,
          text: 'Prophet Ibrahim (AS) lived in a time when people worshipped idols instead of Allah. His father, Azar, was a sculptor who made idols for people to worship. Ibrahim knew that these statues could not hear, see, or help anyone.',
          hasChoices: false
        },
        {
          id: 1,
          text: 'Ibrahim wanted to show people that the idols were not gods. What did he do to prove this to the people?',
          hasChoices: true,
          choices: [
            { 
              id: 'choice1', 
              text: 'He prayed to the idols to show they couldn\'t answer', 
              nextPage: 1,
              isCorrect: false,
              feedback: 'That\'s not what Ibrahim did. He broke all the idols except the largest one to show they couldn\'t protect themselves.' 
            },
            { 
              id: 'choice2', 
              text: 'He broke all the idols except the largest one', 
              nextPage: 2,
              isCorrect: true,
              feedback: 'Correct! Ibrahim broke all the idols except the largest one. When people asked who did it, he suggested they ask the remaining idol, showing that idols cannot speak or do anything.' 
            },
            { 
              id: 'choice3', 
              text: 'He hid the idols to show they couldn\'t find their way back', 
              nextPage: 1,
              isCorrect: false,
              feedback: 'That\'s not what Ibrahim did. He broke all the idols except the largest one to show they couldn\'t protect themselves.' 
            }
          ]
        },
        {
          id: 2,
          text: 'The people were angry with Ibrahim for breaking their idols. They decided to punish him by throwing him into a huge fire. But Allah protected Ibrahim. What happened when they threw him into the fire?',
          hasChoices: true,
          choices: [
            { 
              id: 'choice1', 
              text: 'Angels came and carried him away', 
              nextPage: 2,
              isCorrect: false,
              feedback: 'That\'s not what happened. Allah commanded the fire, "O fire! Be cool and peaceful for Ibrahim!" The fire did not harm him.' 
            },
            { 
              id: 'choice2', 
              text: 'The fire became cool and did not harm him', 
              nextPage: 3,
              isCorrect: true,
              feedback: 'Correct! Allah commanded the fire, "O fire! Be cool and peaceful for Ibrahim!" The fire did not harm him at all.' 
            },
            { 
              id: 'choice3', 
              text: 'It rained and put out the fire', 
              nextPage: 2,
              isCorrect: false,
              feedback: 'That\'s not what happened. Allah commanded the fire, "O fire! Be cool and peaceful for Ibrahim!" The fire did not harm him.' 
            }
          ]
        },
        {
          id: 3,
          text: 'Ibrahim left his homeland with his wife Sarah and later married Hajar. Allah blessed Ibrahim and Hajar with a son named Ismail when Ibrahim was very old. This was a miracle from Allah. Ibrahim was later asked to do something very difficult to test his faith. What was it?',
          hasChoices: true,
          choices: [
            { 
              id: 'choice1', 
              text: 'To leave Hajar and Ismail in the desert', 
              nextPage: 3,
              isCorrect: false,
              feedback: 'While Ibrahim did leave Hajar and Ismail in Mecca (which was a desert then) by Allah\'s command, the greater test came later when he was asked to sacrifice his son Ismail.' 
            },
            { 
              id: 'choice2', 
              text: 'To sacrifice his son Ismail', 
              nextPage: 4,
              isCorrect: true,
              feedback: 'Correct! Ibrahim was commanded in a dream to sacrifice his son Ismail. Both father and son submitted to Allah\'s will, showing their complete obedience.' 
            },
            { 
              id: 'choice3', 
              text: 'To build a house of worship alone', 
              nextPage: 3,
              isCorrect: false,
              feedback: 'While Ibrahim and Ismail did build the Kaaba together, the greater test was when Ibrahim was asked to sacrifice his son Ismail.' 
            }
          ]
        },
        {
          id: 4,
          text: 'Ibrahim and Ismail both submitted to Allah\'s command. When Ibrahim was about to sacrifice Ismail, Allah replaced him with a ram from heaven. This showed that Allah did not want human sacrifice but was testing Ibrahim\'s obedience. Later, Ibrahim and Ismail built the Kaaba in Mecca, which is the holiest site in Islam.',
          hasChoices: false,
          isEnding: true
        }
      ]
    },
    {
      id: 'bilal-ibn-rabah',
      title: 'The Story of Bilal Ibn Rabah',
      description: 'The inspiring journey of Bilal, from slavery to becoming Islam\'s first muezzin.',
      category: 'companions',
      difficulty: 'medium',
      ageGroup: '8-12',
      coverImage: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop&w=600&q=80',
      pages: [
        {
          id: 0,
          text: 'Bilal ibn Rabah was born into slavery in Mecca. He was owned by Umayyah ibn Khalaf, who was a harsh and cruel master. Bilal was known for his strong physique and his beautiful voice.',
          hasChoices: false
        },
        {
          id: 1,
          text: 'When Prophet Muhammad (PBUH) began preaching Islam, Bilal was one of the early converts. When his master discovered that Bilal had become a Muslim, what did he do?',
          hasChoices: true,
          choices: [
            { 
              id: 'choice1', 
              text: 'He immediately freed Bilal', 
              nextPage: 1,
              isCorrect: false,
              feedback: 'No, Umayyah was opposed to Islam and was very angry when he found out Bilal had converted.' 
            },
            { 
              id: 'choice2', 
              text: 'He tortured Bilal to make him renounce Islam', 
              nextPage: 2,
              isCorrect: true,
              feedback: 'Correct! Umayyah tortured Bilal severely, including dragging him on the hot desert sand and placing heavy rocks on his chest, trying to force him to renounce Islam.' 
            },
            { 
              id: 'choice3', 
              text: 'He sold Bilal to another master', 
              nextPage: 1,
              isCorrect: false,
              feedback: 'No, Umayyah tortured Bilal to try to make him renounce Islam.' 
            }
          ]
        },
        {
          id: 2,
          text: 'Despite the severe torture, Bilal remained steadfast in his faith. When rocks were placed on his chest in the scorching heat, he would only say "Ahad, Ahad" (One, One), affirming his belief in the oneness of Allah. Who came to rescue Bilal from this torture?',
          hasChoices: true,
          choices: [
            { 
              id: 'choice1', 
              text: 'Prophet Muhammad (PBUH) himself', 
              nextPage: 2,
              isCorrect: false,
              feedback: 'It wasn\'t the Prophet himself who purchased Bilal, though he supported the decision.' 
            },
            { 
              id: 'choice2', 
              text: 'Abu Bakr Al-Siddiq', 
              nextPage: 3,
              isCorrect: true,
              feedback: 'Correct! Abu Bakr, the Prophet\'s closest companion, purchased Bilal for a high price and then immediately freed him for the sake of Allah.' 
            },
            { 
              id: 'choice3', 
              text: 'Ali ibn Abi Talib', 
              nextPage: 2,
              isCorrect: false,
              feedback: 'It was Abu Bakr who purchased and freed Bilal, not Ali.' 
            }
          ]
        },
        {
          id: 3,
          text: 'After being freed, Bilal became a close companion of Prophet Muhammad (PBUH). When Muslims migrated to Medina and built the first mosque, an important question arose: how should Muslims be called to prayer? What special honor was given to Bilal?',
          hasChoices: true,
          choices: [
            { 
              id: 'choice1', 
              text: 'He became the leader of the Muslim army', 
              nextPage: 3,
              isCorrect: false,
              feedback: 'Bilal was not appointed as army leader. He was given a different honor.' 
            },
            { 
              id: 'choice2', 
              text: 'He became the governor of Medina', 
              nextPage: 3,
              isCorrect: false,
              feedback: 'Bilal was not appointed as governor. He was given a different honor.' 
            },
            { 
              id: 'choice3', 
              text: 'He became the first muezzin (caller to prayer)', 
              nextPage: 4,
              isCorrect: true,
              feedback: 'Correct! Because of his beautiful voice, Bilal was chosen as the first muezzin in Islam. He would climb to the roof of the mosque and call Muslims to prayer five times a day.' 
            }
          ]
        },
        {
          id: 4,
          text: 'Bilal remained the muezzin of the Prophet\'s mosque throughout the Prophet\'s lifetime. When Mecca was conquered by the Muslims, what special honor did the Prophet give to Bilal?',
          hasChoices: true,
          choices: [
            { 
              id: 'choice1', 
              text: 'He asked Bilal to call the adhan from the top of the Kaaba', 
              nextPage: 5,
              isCorrect: true,
              feedback: 'Correct! After the conquest of Mecca, the Prophet asked Bilal to climb on top of the Kaaba and call the adhan. This was a powerful symbol, as Bilal had once been tortured there for his faith.' 
            },
            { 
              id: 'choice2', 
              text: 'He made Bilal the new leader of Mecca', 
              nextPage: 4,
              isCorrect: false,
              feedback: 'Bilal was not made the leader of Mecca. The Prophet asked him to call the adhan from the top of the Kaaba.' 
            },
            { 
              id: 'choice3', 
              text: 'He gave Bilal all of his former master\'s property', 
              nextPage: 4,
              isCorrect: false,
              feedback: 'That\'s not what happened. The Prophet asked Bilal to call the adhan from the top of the Kaaba.' 
            }
          ]
        },
        {
          id: 5,
          text: 'After the Prophet\'s death, Bilal was so grieved that he could no longer bear to stay in Medina. He asked the first caliph, Abu Bakr, to allow him to go to Syria. There, he spent the rest of his life calling others to Islam. His story, from slave to one of Islam\'s most honored figures, continues to inspire Muslims to this day.',
          hasChoices: false,
          isEnding: true
        }
      ]
    }
  ];
  
  const startStory = (story: Story) => {
    setSelectedStory(story);
    setCurrentPage(0);
    setSelectedChoice(null);
    setShowFeedback(false);
  };
  
  const goToNextPage = () => {
    if (!selectedStory) return;
    
    const currentPageData = selectedStory.pages[currentPage];
    
    if (currentPageData.hasChoices && !showFeedback) {
      // If there are choices and feedback isn't shown yet, show feedback first
      setShowFeedback(true);
      return;
    }
    
    // If showing feedback, go to the next page based on the choice
    if (showFeedback && selectedChoice && currentPageData.choices) {
      const choice = currentPageData.choices.find(c => c.id === selectedChoice);
      if (choice) {
        setCurrentPage(choice.nextPage);
        setSelectedChoice(null);
        setShowFeedback(false);
      }
    } else {
      // Simply go to the next page
      setCurrentPage(currentPage + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
    }
    
    // Check if we're at the last page
    const nextPageIndex = currentPageData.hasChoices && selectedChoice && currentPageData.choices 
      ? currentPageData.choices.find(c => c.id === selectedChoice)?.nextPage 
      : currentPage + 1;
      
    if (nextPageIndex !== undefined && selectedStory.pages[nextPageIndex]?.isEnding) {
      // Mark story as completed
      if (!completedStories.includes(selectedStory.id)) {
        setCompletedStories([...completedStories, selectedStory.id]);
        toast.success(`Completed "${selectedStory.title}"!`);
      }
    }
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setSelectedChoice(null);
      setShowFeedback(false);
    }
  };
  
  const exitStory = () => {
    setSelectedStory(null);
    setCurrentPage(0);
    setSelectedChoice(null);
    setShowFeedback(false);
  };
  
  const handleChoiceSelect = (choiceId: string) => {
    setSelectedChoice(choiceId);
  };
  
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return '';
    }
  };
  
  const filteredStories = currentCategory === 'all' 
    ? stories 
    : stories.filter(story => story.category === currentCategory);
  
  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {!selectedStory ? (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Islamic Stories</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
                Interactive storytelling from Islamic history and traditions. Choose your path through these educational stories.
              </p>
            </div>
            
            <Tabs defaultValue="all" className="w-full max-w-4xl mx-auto mb-8">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="all" onClick={() => setCurrentCategory('all')}>All Stories</TabsTrigger>
                <TabsTrigger value="prophets" onClick={() => setCurrentCategory('prophets')}>Prophets</TabsTrigger>
                <TabsTrigger value="companions" onClick={() => setCurrentCategory('companions')}>Companions</TabsTrigger>
              </TabsList>
              
              <TabsContent value={currentCategory}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStories.map(story => (
                    <Card key={story.id} className="overflow-hidden h-full flex flex-col">
                      <div 
                        className="h-40 bg-cover bg-center relative"
                        style={{ backgroundImage: `url(${story.coverImage})` }}
                      >
                        {completedStories.includes(story.id) && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-green-500 text-white px-2 py-1 flex items-center gap-1">
                              <Check className="h-3 w-3" />
                              Completed
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle>{story.title}</CardTitle>
                          <Badge 
                            variant="outline" 
                            className={getDifficultyColor(story.difficulty)}
                          >
                            {story.difficulty}
                          </Badge>
                        </div>
                        <CardDescription>{story.description}</CardDescription>
                      </CardHeader>
                      
                      <CardContent className="flex-1">
                        <div className="flex gap-2 mb-2">
                          <Badge variant="outline">Age: {story.ageGroup}</Badge>
                          <Badge variant="outline" className="capitalize">{story.category}</Badge>
                        </div>
                      </CardContent>
                      
                      <CardFooter>
                        <Button 
                          className="w-full flex items-center gap-2" 
                          onClick={() => startStory(story)}
                        >
                          <BookOpen className="h-4 w-4" />
                          Read Story
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">{selectedStory.title}</h1>
              <div className="flex gap-2">
                <Badge variant="outline" className="capitalize">{selectedStory.category}</Badge>
                <Badge variant="outline" className={getDifficultyColor(selectedStory.difficulty)}>
                  {selectedStory.difficulty}
                </Badge>
              </div>
            </div>
            
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="prose max-w-none">
                  {selectedStory.pages[currentPage].image && (
                    <div 
                      className="w-full h-48 bg-cover bg-center mb-4 rounded-md"
                      style={{ backgroundImage: `url(${selectedStory.pages[currentPage].image})` }}
                    ></div>
                  )}
                  
                  <p className="text-lg leading-relaxed mb-6">{selectedStory.pages[currentPage].text}</p>
                  
                  {selectedStory.pages[currentPage].hasChoices && selectedStory.pages[currentPage].choices && (
                    <div className="mt-6">
                      <h3 className="font-medium mb-3">What happens next?</h3>
                      
                      <RadioGroup 
                        value={selectedChoice || ''} 
                        onValueChange={handleChoiceSelect}
                        className="space-y-3"
                        disabled={showFeedback}
                      >
                        {selectedStory.pages[currentPage].choices?.map(choice => (
                          <div key={choice.id} className="flex items-start space-x-2">
                            <RadioGroupItem 
                              value={choice.id} 
                              id={choice.id} 
                              className="mt-1"
                            />
                            <Label 
                              htmlFor={choice.id}
                              className={`p-2 rounded-md flex-1 cursor-pointer ${
                                showFeedback && selectedChoice === choice.id
                                  ? choice.isCorrect 
                                    ? 'bg-green-50 border border-green-200' 
                                    : 'bg-red-50 border border-red-200'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              {choice.text}
                              
                              {showFeedback && selectedChoice === choice.id && choice.feedback && (
                                <p className={`text-sm mt-2 ${choice.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                  {choice.feedback}
                                </p>
                              )}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between">
              <div>
                <Button 
                  variant="outline" 
                  onClick={exitStory}
                  className="flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Back to Stories
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={goToPreviousPage}
                  disabled={currentPage === 0}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <Button 
                  onClick={goToNextPage}
                  disabled={
                    selectedStory.pages[currentPage].hasChoices && 
                    !selectedChoice && 
                    !showFeedback
                  }
                  className="flex items-center gap-2"
                >
                  {showFeedback || !selectedStory.pages[currentPage].hasChoices ? (
                    <>
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </>
                  ) : (
                    'Select an option'
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Stories;
