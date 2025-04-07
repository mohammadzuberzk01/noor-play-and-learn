
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  User, 
  BadgeCheck, 
  Clock, 
  BarChart3, 
  Star,
  Award,
  Zap,
  BookOpen,
  Sparkles,
  Flame 
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AchievementBadge from '@/components/ui/AchievementBadge';

const Profile = () => {
  const achievements = [
    { 
      name: "Word Master", 
      description: "Complete 10 word search puzzles", 
      icon: Award, 
      unlocked: true, 
      color: "bg-islamic-primary" 
    },
    { 
      name: "Trivia Expert", 
      description: "Answer 50 trivia questions correctly", 
      icon: Zap, 
      unlocked: true, 
      color: "bg-islamic-gold" 
    },
    { 
      name: "Quran Explorer", 
      description: "Complete 5 Quran puzzles", 
      icon: BookOpen, 
      unlocked: false, 
      color: "bg-islamic-secondary" 
    },
    { 
      name: "Memory Master", 
      description: "Complete 10 matching games", 
      icon: Sparkles, 
      unlocked: true, 
      color: "bg-islamic-accent" 
    },
    { 
      name: "Daily Streak", 
      description: "Play for 7 consecutive days", 
      icon: Flame, 
      unlocked: false, 
      color: "bg-islamic-red" 
    },
    { 
      name: "Ramadan Scholar", 
      description: "Complete all Ramadan games", 
      icon: Star, 
      unlocked: false, 
      color: "bg-islamic-teal" 
    }
  ];
  
  const recentGames = [
    { name: "Islamic Word Search", date: "Today", score: "6/8 words", result: "Completed" },
    { name: "Islamic Trivia", date: "Yesterday", score: "8/10 correct", result: "Completed" },
    { name: "Masjid Maze", date: "2 days ago", score: "Level 3", result: "Completed" },
    { name: "Islamic Matching", date: "3 days ago", score: "12 pairs", result: "Completed" }
  ];
  
  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>User Profile</CardTitle>
                <CardDescription>Your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full bg-islamic-primary flex items-center justify-center text-white">
                    <User className="h-10 w-10" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Guest Player</h3>
                    <p className="text-muted-foreground">Joined April 2025</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">Overall Progress</span>
                      <span>Level 3</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-card rounded-lg p-3 text-center">
                      <div className="text-3xl font-bold text-islamic-primary">8</div>
                      <div className="text-sm text-muted-foreground">Games Played</div>
                    </div>
                    <div className="bg-card rounded-lg p-3 text-center">
                      <div className="text-3xl font-bold text-islamic-gold">3</div>
                      <div className="text-sm text-muted-foreground">Achievements</div>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4 bg-islamic-primary hover:bg-islamic-primary/90">
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader className="pb-4">
                <CardTitle>Game Statistics</CardTitle>
                <CardDescription>Track your progress across all games</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium flex items-center gap-1">
                        <Trophy className="h-4 w-4 text-islamic-gold" /> Word Search Progress
                      </span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium flex items-center gap-1">
                        <BadgeCheck className="h-4 w-4 text-islamic-primary" /> Trivia Progress
                      </span>
                      <span>60%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium flex items-center gap-1">
                        <Clock className="h-4 w-4 text-islamic-secondary" /> Matching Games Progress
                      </span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium flex items-center gap-1">
                        <BarChart3 className="h-4 w-4 text-islamic-accent" /> Ramadan Games Progress
                      </span>
                      <span>30%</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <h3 className="font-medium mb-3">Recent Activity</h3>
                    <div className="space-y-2">
                      {recentGames.map((game, index) => (
                        <div key={index} className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50">
                          <div>
                            <div className="font-medium">{game.name}</div>
                            <div className="text-sm text-muted-foreground">{game.date}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm">{game.score}</div>
                            <div className="text-xs text-islamic-primary font-medium">{game.result}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="achievements">
            <TabsList className="mb-6">
              <TabsTrigger value="achievements">
                <Trophy className="h-4 w-4 mr-2" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="learning">
                <BookOpen className="h-4 w-4 mr-2" />
                Learning Progress
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="achievements">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement, index) => (
                  <AchievementBadge 
                    key={index}
                    name={achievement.name}
                    description={achievement.description}
                    icon={achievement.icon}
                    unlocked={achievement.unlocked}
                    color={achievement.color}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="learning">
              <Card>
                <CardHeader>
                  <CardTitle>Islamic Learning Progress</CardTitle>
                  <CardDescription>Track what you've learned through playing games</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Ramadan Knowledge</h3>
                      <Progress value={70} className="h-2 mb-4" />
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {['Fasting', 'Iftar', 'Suhoor', 'Night of Power', 'Charity', 'Taraweeh', 'Moon Sighting'].map((topic, i) => (
                          <div key={i} className="bg-islamic-primary/10 text-islamic-primary rounded-full px-3 py-1 text-sm text-center">
                            {topic}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Qur'an Knowledge</h3>
                      <Progress value={45} className="h-2 mb-4" />
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {['Surah Al-Fatiha', 'Basic Arabic', 'Tajweed'].map((topic, i) => (
                          <div key={i} className="bg-islamic-secondary/10 text-islamic-secondary rounded-full px-3 py-1 text-sm text-center">
                            {topic}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Islamic History</h3>
                      <Progress value={30} className="h-2 mb-4" />
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {['Prophets', 'Companions'].map((topic, i) => (
                          <div key={i} className="bg-islamic-accent/10 text-islamic-accent rounded-full px-3 py-1 text-sm text-center">
                            {topic}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-3">Suggested Games Based on Learning Progress</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-card p-4 rounded-lg border">
                          <h4 className="font-medium mb-1">Islamic History Trivia</h4>
                          <p className="text-sm text-muted-foreground mb-3">Expand your knowledge of Islamic history.</p>
                          <Button variant="outline" size="sm" className="w-full">Play Now</Button>
                        </div>
                        <div className="bg-card p-4 rounded-lg border">
                          <h4 className="font-medium mb-1">Qur'an Verse Puzzle</h4>
                          <p className="text-sm text-muted-foreground mb-3">Improve your understanding of Qur'anic verses.</p>
                          <Button variant="outline" size="sm" className="w-full">Play Now</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
