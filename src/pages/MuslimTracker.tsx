import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Calendar, Award, Check, Clock, BookOpen, Heart, Star, Moon, Sun } from 'lucide-react';

interface Activity {
  id: number;
  name: string;
  description: string;
  category: 'obligatory' | 'sunnah' | 'recommended' | 'knowledge';
  icon: React.ElementType;
  completed: boolean;
  streak: number;
}

interface DailyProgress {
  date: string;
  percentage: number;
}

const MuslimTracker = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [dailyProgress, setDailyProgress] = useState(0);
  const [progressHistory, setProgressHistory] = useState<DailyProgress[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [challengeDay, setChallengeDay] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  
  // Local storage keys
  const STORAGE_KEY_ACTIVITIES = 'muslim-tracker-activities';
  const STORAGE_KEY_HISTORY = 'muslim-tracker-history';
  const STORAGE_KEY_STREAK = 'muslim-tracker-streak';
  const STORAGE_KEY_DAY = 'muslim-tracker-day';
  const STORAGE_KEY_LAST_DATE = 'muslim-tracker-last-date';
  
  // Sample activities data
  const activitiesData: Activity[] = [
    {
      id: 1,
      name: "Fajr Prayer",
      description: "Performed the Fajr prayer on time",
      category: "obligatory",
      icon: Sun,
      completed: false,
      streak: 0
    },
    {
      id: 2,
      name: "Dhuhr Prayer",
      description: "Performed the Dhuhr prayer on time",
      category: "obligatory",
      icon: Sun,
      completed: false,
      streak: 0
    },
    {
      id: 3,
      name: "Asr Prayer",
      description: "Performed the Asr prayer on time",
      category: "obligatory",
      icon: Sun,
      completed: false,
      streak: 0
    },
    {
      id: 4,
      name: "Maghrib Prayer",
      description: "Performed the Maghrib prayer on time",
      category: "obligatory",
      icon: Sun,
      completed: false,
      streak: 0
    },
    {
      id: 5,
      name: "Isha Prayer",
      description: "Performed the Isha prayer on time",
      category: "obligatory",
      icon: Moon,
      completed: false,
      streak: 0
    },
    {
      id: 6,
      name: "Quran Reading",
      description: "Read at least one page of the Quran",
      category: "recommended",
      icon: BookOpen,
      completed: false,
      streak: 0
    },
    {
      id: 7,
      name: "Morning Adhkar",
      description: "Recited the morning remembrances",
      category: "sunnah",
      icon: Heart,
      completed: false,
      streak: 0
    },
    {
      id: 8,
      name: "Evening Adhkar",
      description: "Recited the evening remembrances",
      category: "sunnah",
      icon: Heart,
      completed: false,
      streak: 0
    },
    {
      id: 9,
      name: "Islamic Knowledge",
      description: "Spent time learning about Islam",
      category: "knowledge",
      icon: BookOpen,
      completed: false,
      streak: 0
    },
    {
      id: 10,
      name: "Good Deed",
      description: "Performed at least one good deed today",
      category: "recommended",
      icon: Star,
      completed: false,
      streak: 0
    },
    {
      id: 11,
      name: "Avoid Backbiting",
      description: "Refrained from backbiting and negative speech",
      category: "recommended",
      icon: Check,
      completed: false,
      streak: 0
    },
    {
      id: 12,
      name: "Sunnahs of Eating",
      description: "Followed the sunnahs of eating (saying Bismillah, eating with right hand, etc.)",
      category: "sunnah",
      icon: Check,
      completed: false,
      streak: 0
    }
  ];
  
  // Initialize data from localStorage or default data
  useEffect(() => {
    // Check if day has changed
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem(STORAGE_KEY_LAST_DATE);
    
    if (lastDate && lastDate !== today) {
      // It's a new day
      
      // Calculate and save yesterday's progress before resetting
      const storedActivities = localStorage.getItem(STORAGE_KEY_ACTIVITIES);
      if (storedActivities) {
        const activitiesData = JSON.parse(storedActivities);
        const completedCount = activitiesData.filter((a: Activity) => a.completed).length;
        const percentage = Math.round((completedCount / activitiesData.length) * 100);
        
        // Save progress to history
        const history = JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY) || '[]');
        history.push({
          date: lastDate,
          percentage
        });
        
        // Keep only last 30 days
        if (history.length > 30) {
          history.shift();
        }
        
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
        setProgressHistory(history);
        
        // Update challenge day if progress was good
        if (percentage >= 80) {
          const currentDay = parseInt(localStorage.getItem(STORAGE_KEY_DAY) || '1', 10);
          const newDay = currentDay + 1;
          localStorage.setItem(STORAGE_KEY_DAY, newDay.toString());
          setChallengeDay(newDay);
          
          // Update streak
          const streak = parseInt(localStorage.getItem(STORAGE_KEY_STREAK) || '0', 10);
          const newStreak = streak + 1;
          localStorage.setItem(STORAGE_KEY_STREAK, newStreak.toString());
          setCurrentStreak(newStreak);
        } else {
          // Reset streak if progress was poor
          localStorage.setItem(STORAGE_KEY_STREAK, '0');
          setCurrentStreak(0);
        }
        
        // Reset activities for new day
        const resetActivities = activitiesData.map((a: Activity) => ({
          ...a,
          completed: false
        }));
        localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(resetActivities));
        setActivities(resetActivities);
      }
    } else {
      // Same day or first use
      
      // Load activities
      const storedActivities = localStorage.getItem(STORAGE_KEY_ACTIVITIES);
      if (storedActivities) {
        setActivities(JSON.parse(storedActivities));
      } else {
        setActivities(activitiesData);
      }
      
      // Load history
      const storedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (storedHistory) {
        setProgressHistory(JSON.parse(storedHistory));
      }
      
      // Load streak and day
      const storedStreak = localStorage.getItem(STORAGE_KEY_STREAK);
      if (storedStreak) {
        setCurrentStreak(parseInt(storedStreak, 10));
      }
      
      const storedDay = localStorage.getItem(STORAGE_KEY_DAY);
      if (storedDay) {
        setChallengeDay(parseInt(storedDay, 10));
      }
    }
    
    // Save today's date
    localStorage.setItem(STORAGE_KEY_LAST_DATE, today);
    
    // Calculate current progress
    updateDailyProgress();
  }, []);
  
  // Save activities to localStorage whenever they change
  useEffect(() => {
    if (activities.length > 0) {
      localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(activities));
      updateDailyProgress();
    }
  }, [activities]);
  
  const updateDailyProgress = () => {
    if (activities.length === 0) return;
    
    const completedCount = activities.filter(a => a.completed).length;
    const percentage = Math.round((completedCount / activities.length) * 100);
    
    setDailyProgress(percentage);
  };
  
  const toggleActivity = (id: number) => {
    setActivities(prev => 
      prev.map(activity => {
        if (activity.id === id) {
          const newCompleted = !activity.completed;
          const newStreak = newCompleted ? activity.streak + 1 : activity.streak - 1;
          
          // Show toast for completion
          if (newCompleted) {
            toast({
              title: `${activity.name} Completed!`,
              description: `You've earned ${activity.points} points`,
              variant: "default"
            });
          }
          
          return {
            ...activity,
            completed: newCompleted,
            streak: newCompleted ? activity.streak + 1 : Math.max(0, activity.streak - 1)
          };
        }
        return activity;
      })
    );
  };
  
  const resetDailyProgress = () => {
    setActivities(prev => 
      prev.map(activity => ({
        ...activity,
        completed: false
      }))
    );
    
    toast({
      title: "Progress Reset",
      description: "All activities have been reset for today",
    });
  };
  
  // Filter activities based on active tab
  const filteredActivities = activities.filter(activity => {
    if (activeTab === 'all') return true;
    return activity.category === activeTab;
  });
  
  // Get current date
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">30-Day Muslim Tracker</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your daily Islamic practices and build consistent habits
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <Card className="p-6 flex-1">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-islamic-primary" />
                Day {challengeDay} of 30
              </h2>
              <Badge variant="outline">{formattedDate}</Badge>
            </div>
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Daily Progress</span>
                <span>{dailyProgress}%</span>
              </div>
              <Progress value={dailyProgress} className="h-2" />
            </div>
            <div className="flex justify-between items-center">
              <Badge variant="outline" className="flex items-center gap-1">
                <Award className="h-4 w-4" />
                <span>Streak: {currentStreak} {currentStreak === 1 ? 'day' : 'days'}</span>
              </Badge>
              <Button variant="outline" size="sm" onClick={resetDailyProgress}>
                Reset Day
              </Button>
            </div>
          </Card>
          
          <Card className="p-6 flex-1">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Award className="h-5 w-5 text-islamic-primary" />
              Challenge Progress
            </h2>
            <div className="flex items-center gap-1 mb-3">
              {[...Array(Math.min(7, challengeDay))].map((_, i) => (
                <Badge key={i} className="bg-islamic-primary">
                  Day {i + 1}
                </Badge>
              ))}
              {challengeDay > 7 && (
                <Badge variant="outline">+{challengeDay - 7} more</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Complete at least 80% of your daily activities to advance to the next day
            </p>
          </Card>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Activities</TabsTrigger>
            <TabsTrigger value="obligatory">Obligatory</TabsTrigger>
            <TabsTrigger value="sunnah">Sunnah</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredActivities.map(activity => {
              const Icon = activity.icon;
              return (
                <Card 
                  key={activity.id}
                  className={`p-4 ${activity.completed ? 'bg-islamic-primary/10 border-islamic-primary' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.completed ? 'bg-islamic-primary text-white' : 'bg-muted'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{activity.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {activity.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="flex items-center gap-1 text-xs">
                          <Clock className="h-3 w-3" />
                          <span>Streak: {activity.streak}</span>
                        </Badge>
                        
                        <Button 
                          size="sm" 
                          variant={activity.completed ? "outline" : "default"}
                          className={activity.completed ? "border-islamic-primary text-islamic-primary" : ""}
                          onClick={() => toggleActivity(activity.id)}
                        >
                          {activity.completed ? (
                            <>
                              <Check className="h-4 w-4 mr-1" /> Completed
                            </>
                          ) : (
                            'Mark Complete'
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
        
        <Card className="mt-8 p-6">
          <h2 className="text-xl font-bold mb-4">Progress History</h2>
          <div className="overflow-x-auto">
            <div className="flex space-x-2 min-w-max">
              {progressHistory.slice(-14).map((day, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-8 h-20 rounded-t-md relative"
                    style={{
                      background: `linear-gradient(to top, var(--islamic-primary) ${day.percentage}%, #e5e7eb ${day.percentage}%)`,
                    }}
                  ></div>
                  <span className="text-xs mt-1">{new Date(day.date).getDate()}</span>
                </div>
              ))}
              {progressHistory.length === 0 && (
                <div className="flex items-center justify-center h-24 w-full">
                  <p className="text-muted-foreground">Start tracking to see your history</p>
                </div>
              )}
            </div>
          </div>
        </Card>
        
        <div className="mt-8 bg-muted p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">About the 30-Day Challenge</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Mark activities as complete as you perform them</li>
            <li>Complete at least 80% of activities each day to advance to the next challenge day</li>
            <li>Build a streak to establish consistent Islamic practices</li>
            <li>Your progress resets daily, but your streak continues if you maintain consistency</li>
            <li>Focus on both obligatory acts and recommended practices to balance your spiritual growth</li>
          </ul>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MuslimTracker;
