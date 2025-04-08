
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { AlertCircle, Clock, CheckCircle, Calendar as CalendarIcon, Trophy, Star, Flame, Medal } from 'lucide-react';
import { toast } from 'sonner';
import { format, isToday, addDays, startOfToday, differenceInDays, isSameDay } from 'date-fns';

// Define prayer times struct
interface PrayerTime {
  name: string;
  arabicName: string;
  time: string;
  isCompleted: boolean;
  isOnTime: boolean;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  thisWeek: number;
  thisMonth: number;
  onTimePercentage: number;
  lastPrayed: Date | null;
  prayedDates: Date[];
}

const SalahStreak: React.FC = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [date, setDate] = useState<Date>(new Date());
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([
    { name: 'Fajr', arabicName: 'الفجر', time: '05:30', isCompleted: false, isOnTime: false },
    { name: 'Dhuhr', arabicName: 'الظهر', time: '12:30', isCompleted: false, isOnTime: false },
    { name: 'Asr', arabicName: 'العصر', time: '15:45', isCompleted: false, isOnTime: false },
    { name: 'Maghrib', arabicName: 'المغرب', time: '18:15', isCompleted: false, isOnTime: false },
    { name: 'Isha', arabicName: 'العشاء', time: '19:45', isCompleted: false, isOnTime: false }
  ]);
  
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    thisWeek: 0,
    thisMonth: 0,
    onTimePercentage: 0,
    lastPrayed: null,
    prayedDates: []
  });
  
  // Load saved data from localStorage
  useEffect(() => {
    const savedPrayerTimes = localStorage.getItem('salahStreak_prayerTimes');
    const savedStreakData = localStorage.getItem('salahStreak_streakData');
    
    if (savedPrayerTimes) {
      const parsed = JSON.parse(savedPrayerTimes);
      // Only load today's saved data
      if (isToday(new Date(parsed.date))) {
        setPrayerTimes(parsed.prayers);
      }
    }
    
    if (savedStreakData) {
      const parsed = JSON.parse(savedStreakData);
      parsed.lastPrayed = parsed.lastPrayed ? new Date(parsed.lastPrayed) : null;
      parsed.prayedDates = parsed.prayedDates ? parsed.prayedDates.map((d: string) => new Date(d)) : [];
      setStreakData(parsed);
    }
  }, []);
  
  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('salahStreak_prayerTimes', JSON.stringify({
      date: new Date(),
      prayers: prayerTimes
    }));
    
    localStorage.setItem('salahStreak_streakData', JSON.stringify(streakData));
  }, [prayerTimes, streakData]);
  
  const markAsPrayed = (index: number, onTime: boolean) => {
    const updatedPrayerTimes = [...prayerTimes];
    updatedPrayerTimes[index].isCompleted = true;
    updatedPrayerTimes[index].isOnTime = onTime;
    setPrayerTimes(updatedPrayerTimes);
    
    const today = startOfToday();
    const onTimeCount = updatedPrayerTimes.filter(prayer => prayer.isOnTime).length;
    const completedCount = updatedPrayerTimes.filter(prayer => prayer.isCompleted).length;
    
    // Update streak data
    const updatedStreakData = { ...streakData };
    
    // If this is the first prayer of today
    if (!streakData.prayedDates.some(date => isSameDay(date, today))) {
      updatedStreakData.prayedDates.push(today);
    }
    
    // Update last prayed date
    updatedStreakData.lastPrayed = today;
    
    // Calculate current streak
    if (streakData.lastPrayed) {
      const daysSinceLastPrayer = differenceInDays(today, streakData.lastPrayed);
      if (daysSinceLastPrayer <= 1) {
        // Maintain or increment streak
        updatedStreakData.currentStreak = streakData.currentStreak + (daysSinceLastPrayer === 1 ? 1 : 0);
      } else {
        // Reset streak
        updatedStreakData.currentStreak = 1;
      }
    } else {
      // First time praying
      updatedStreakData.currentStreak = 1;
    }
    
    // Update longest streak if needed
    if (updatedStreakData.currentStreak > streakData.longestStreak) {
      updatedStreakData.longestStreak = updatedStreakData.currentStreak;
    }
    
    // Update this week and this month
    const datesThisWeek = streakData.prayedDates.filter(date => 
      differenceInDays(today, date) < 7
    );
    const datesThisMonth = streakData.prayedDates.filter(date => 
      differenceInDays(today, date) < 30
    );
    
    updatedStreakData.thisWeek = datesThisWeek.length;
    updatedStreakData.thisMonth = datesThisMonth.length;
    
    // Update on-time percentage
    updatedStreakData.onTimePercentage = Math.round((onTimeCount / completedCount) * 100) || 0;
    
    setStreakData(updatedStreakData);
    
    toast.success(`${updatedPrayerTimes[index].name} prayer marked as completed!`);
    
    // Achievement notifications
    if (updatedStreakData.currentStreak === 7) {
      toast("Achievement Unlocked: 7-Day Streak!", {
        icon: <Trophy className="h-5 w-5 text-yellow-500" />
      });
    } else if (updatedStreakData.currentStreak === 30) {
      toast("Achievement Unlocked: 30-Day Streak!", {
        icon: <Trophy className="h-5 w-5 text-yellow-500" />
      });
    }
    
    if (updatedStreakData.onTimePercentage >= 90) {
      toast("Achievement Unlocked: Punctuality Master!", {
        icon: <Clock className="h-5 w-5 text-green-500" />
      });
    }
  };
  
  const resetToday = () => {
    const confirmed = window.confirm("Are you sure you want to reset today's prayers?");
    if (confirmed) {
      const resetPrayers = prayerTimes.map(prayer => ({
        ...prayer,
        isCompleted: false,
        isOnTime: false
      }));
      setPrayerTimes(resetPrayers);
      toast.info("Today's prayers have been reset.");
    }
  };
  
  const getOnTimeButtonDisabled = (prayer: PrayerTime) => {
    if (prayer.isCompleted) return true;
    
    // In a real app, we would compare current time with prayer time
    // For this demo, we'll just enable all on-time buttons
    return false;
  };
  
  const calculateCompletion = () => {
    const completed = prayerTimes.filter(prayer => prayer.isCompleted).length;
    return (completed / prayerTimes.length) * 100;
  };
  
  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Salah Streak</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Keep track of your daily prayers and build a streak of on-time Salah
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="today">Today's Prayers</TabsTrigger>
                <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="today" className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Today's Prayer Times</CardTitle>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(), 'EEEE, MMMM d, yyyy')}
                      </div>
                    </div>
                    <CardDescription>
                      Mark your prayers as completed to maintain your streak
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Today's Progress</span>
                        <span className="text-sm">
                          {prayerTimes.filter(p => p.isCompleted).length}/{prayerTimes.length} Prayers
                        </span>
                      </div>
                      <Progress value={calculateCompletion()} className="h-2" />
                    </div>
                    
                    <div className="space-y-4">
                      {prayerTimes.map((prayer, index) => (
                        <div 
                          key={prayer.name} 
                          className={`p-4 rounded-lg border ${
                            prayer.isCompleted 
                              ? prayer.isOnTime 
                                ? 'bg-green-50 border-green-200' 
                                : 'bg-yellow-50 border-yellow-200' 
                              : 'bg-white'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-lg">{prayer.name}</h3>
                                <span className="text-lg text-muted-foreground font-arabic">{prayer.arabicName}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">Scheduled: {prayer.time}</p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {prayer.isCompleted ? (
                                <Badge className={prayer.isOnTime ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                  {prayer.isOnTime ? 'On Time' : 'Completed'}
                                </Badge>
                              ) : (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => markAsPrayed(index, false)}
                                  >
                                    Mark as Prayed
                                  </Button>
                                  <Button 
                                    size="sm"
                                    onClick={() => markAsPrayed(index, true)}
                                    disabled={getOnTimeButtonDisabled(prayer)}
                                    className="bg-islamic-primary hover:bg-islamic-primary/90"
                                  >
                                    Prayed On Time
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button variant="outline" size="sm" onClick={resetToday} className="ml-auto">
                      Reset Today
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="calendar" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Prayer Calendar</CardTitle>
                    <CardDescription>
                      View your prayer history and upcoming days
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex flex-col items-center">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => date && setDate(date)}
                        className="rounded-md border"
                        modifiers={{
                          prayed: streakData.prayedDates
                        }}
                        modifiersClassNames={{
                          prayed: "bg-islamic-primary/20 text-islamic-primary font-bold"
                        }}
                      />
                      
                      <div className="mt-6 text-center w-full max-w-sm">
                        <h3 className="font-medium mb-2">Legend:</h3>
                        <div className="flex justify-center gap-4">
                          <div className="flex items-center gap-1">
                            <div className="w-4 h-4 rounded-full bg-islamic-primary/20"></div>
                            <span className="text-xs">Prayed</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-4 h-4 rounded-full bg-white border"></div>
                            <span className="text-xs">No Record</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-4 h-4 rounded-full bg-slate-200"></div>
                            <span className="text-xs">Today</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-islamic-primary" />
                  Your Streak
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="text-center py-4">
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-islamic-primary">
                      <span className="text-4xl font-bold text-white">{streakData.currentStreak}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">Current Streak (Days)</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-islamic-primary">{streakData.longestStreak}</div>
                      <p className="text-xs text-muted-foreground">Longest Streak</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-islamic-primary">{streakData.onTimePercentage}%</div>
                      <p className="text-xs text-muted-foreground">On Time</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-islamic-primary">{streakData.thisWeek}</div>
                      <p className="text-xs text-muted-foreground">This Week</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-islamic-primary">{streakData.thisMonth}</div>
                      <p className="text-xs text-muted-foreground">This Month</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="border-t pt-6 flex flex-col gap-4">
                <h3 className="font-medium text-sm">Achievements:</h3>
                <div className="grid grid-cols-2 gap-3 w-full">
                  <Badge variant={streakData.currentStreak >= 7 ? 'default' : 'outline'} className="flex gap-1 justify-center py-1">
                    <Star className="h-4 w-4" />
                    <span>7-Day Streak</span>
                  </Badge>
                  <Badge variant={streakData.currentStreak >= 30 ? 'default' : 'outline'} className="flex gap-1 justify-center py-1">
                    <Trophy className="h-4 w-4" />
                    <span>30-Day Streak</span>
                  </Badge>
                  <Badge variant={streakData.onTimePercentage >= 90 ? 'default' : 'outline'} className="flex gap-1 justify-center py-1">
                    <Clock className="h-4 w-4" />
                    <span>Punctuality</span>
                  </Badge>
                  <Badge variant={streakData.thisMonth >= 25 ? 'default' : 'outline'} className="flex gap-1 justify-center py-1">
                    <Medal className="h-4 w-4" />
                    <span>Consistency</span>
                  </Badge>
                </div>
                
                <div className="mt-4 flex justify-center">
                  <Button variant="link" className="text-sm" asChild>
                    <a href="/achievements">View All Achievements</a>
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Prayer Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-3">
                  <div className="flex gap-2 items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <p>Set alarms 10 minutes before prayer times</p>
                  </div>
                  <div className="flex gap-2 items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <p>Keep a prayer mat in your car or workplace</p>
                  </div>
                  <div className="flex gap-2 items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <p>Plan your day around prayer times when possible</p>
                  </div>
                  <div className="flex gap-2 items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <p>Use wudu before leaving home to be ready</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SalahStreak;
