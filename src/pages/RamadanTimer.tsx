
import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Sun, Moon, Clock, Info, Calendar } from 'lucide-react';

interface PrayerTime {
  name: string;
  time: string;
}

interface RamadanDay {
  date: string;
  hijriDate: string;
  day: number;
  fajr: string;
  maghrib: string;
  fact: string;
}

const RamadanTimer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeUntilNext, setTimeUntilNext] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [nextEvent, setNextEvent] = useState<'suhoor' | 'iftar'>('iftar');
  const [selectedLocation, setSelectedLocation] = useState('london');
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [ramadanDays, setRamadanDays] = useState<RamadanDay[]>([]);
  const [todayRamadan, setTodayRamadan] = useState<RamadanDay | null>(null);
  const [factIndex, setFactIndex] = useState(0);
  const [showPrayerTimes, setShowPrayerTimes] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  
  const locations = [
    { id: 'london', name: 'London, UK' },
    { id: 'newyork', name: 'New York, USA' },
    { id: 'cairo', name: 'Cairo, Egypt' },
    { id: 'dubai', name: 'Dubai, UAE' },
    { id: 'kualalumpur', name: 'Kuala Lumpur, Malaysia' },
  ];
  
  // Mock Ramadan 2025 data (April 1 - April 30, 2025)
  const generateRamadanData = (location: string) => {
    const days: RamadanDay[] = [];
    
    // Base times that will be adjusted by location
    let baseAdjustment = 0;
    switch (location) {
      case 'newyork': baseAdjustment = -5; break; // -5 hours from London
      case 'cairo': baseAdjustment = 2; break;    // +2 hours from London
      case 'dubai': baseAdjustment = 4; break;    // +4 hours from London
      case 'kualalumpur': baseAdjustment = 8; break; // +8 hours from London
      default: baseAdjustment = 0; // London
    }
    
    // Fajr times get earlier by 1-2 minutes each day during Ramadan
    // Maghrib times get later by 1-2 minutes each day during Ramadan
    for (let i = 0; i < 30; i++) {
      const date = new Date(2025, 3, 1 + i); // April 2025
      
      // Format the date
      const dateStr = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      
      // Calculate Hijri date (mock calculation - in reality, this would be more complex)
      const hijriDay = 1 + i;
      const hijriDateStr = `Ramadan ${hijriDay}, 1446`;
      
      // Calculate Fajr and Maghrib times with daily progression
      const fajrHour = 4 - Math.floor(i / 10); // Fajr gets earlier as Ramadan progresses
      const fajrMinute = 30 - (i % 30);
      
      const maghribHour = 19 + Math.floor(i / 15); // Maghrib gets later as Ramadan progresses
      const maghribMinute = 15 + (i % 30);
      
      // Apply location adjustment
      const fajrAdjustedHour = (((fajrHour + baseAdjustment) % 24) + 24) % 24; // Handle negative hours
      const maghribAdjustedHour = (((maghribHour + baseAdjustment) % 24) + 24) % 24;
      
      const fajrTimeStr = `${fajrAdjustedHour.toString().padStart(2, '0')}:${fajrMinute.toString().padStart(2, '0')}`;
      const maghribTimeStr = `${maghribAdjustedHour.toString().padStart(2, '0')}:${maghribMinute.toString().padStart(2, '0')}`;
      
      days.push({
        date: dateStr,
        hijriDate: hijriDateStr,
        day: i + 1,
        fajr: fajrTimeStr,
        maghrib: maghribTimeStr,
        fact: getRamadanFact(i)
      });
    }
    
    return days;
  };
  
  const getRamadanFact = (index: number) => {
    const facts = [
      "Ramadan is the ninth month of the Islamic lunar calendar.",
      "Fasting during Ramadan is one of the Five Pillars of Islam.",
      "The Quran was first revealed to Prophet Muhammad during Ramadan.",
      "Muslims fast from dawn until sunset during Ramadan.",
      "Laylat al-Qadr (Night of Power) falls during the last 10 days of Ramadan.",
      "Charity is especially encouraged during Ramadan.",
      "The first meal before dawn is called Suhoor.",
      "The meal to break the fast at sunset is called Iftar.",
      "Muslims often break their fast with dates, following the tradition of Prophet Muhammad.",
      "Taraweeh prayers are special evening prayers performed during Ramadan.",
      "Eid al-Fitr is the celebration that marks the end of Ramadan.",
      "Many Muslims aim to read the entire Quran during Ramadan.",
      "Children, elderly, and ill people are exempt from fasting.",
      "The Islamic calendar is lunar, so Ramadan moves about 11 days earlier each year.",
      "The start of Ramadan is determined by the sighting of the new moon.",
      "During Ramadan, Muslims strive to increase their acts of worship and good deeds.",
      "In some countries, cannons or sirens announce the beginning and end of the daily fast.",
      "The Prophet Muhammad said, 'When Ramadan enters, the gates of Paradise are opened.'",
      "Fasting is meant to teach patience, self-restraint, and empathy for those less fortunate.",
      "Many mosques offer free iftar meals to the community during Ramadan.",
      "Muslims believe that the rewards for good deeds are multiplied during Ramadan.",
      "The act of fasting is not unique to Islam; it is practiced in many religions.",
      "Ramadan is a time for spiritual reflection, improvement, and increased devotion.",
      "The word 'Ramadan' comes from the Arabic root 'ramida,' which means intense heat or dryness.",
      "Muslims greet each other during this month by saying 'Ramadan Mubarak' or 'Ramadan Kareem.'",
      "In many Muslim-majority countries, work hours are reduced during Ramadan.",
      "The pre-dawn meal (suhoor) is recommended even if it's just a sip of water.",
      "It is believed that the Quran was revealed on Laylat al-Qadr, which is better than 1000 months.",
      "Muslims are encouraged to be more generous and giving during Ramadan.",
      "Fasting in Ramadan includes abstaining from food, drink, smoking, and immoral behavior."
    ];
    
    return facts[index % facts.length];
  };
  
  // Generate prayer times based on location
  const generatePrayerTimes = (location: string) => {
    // Base times that will be adjusted by location
    let baseAdjustment = 0;
    switch (location) {
      case 'newyork': baseAdjustment = -5; break; // -5 hours from London
      case 'cairo': baseAdjustment = 2; break;    // +2 hours from London
      case 'dubai': baseAdjustment = 4; break;    // +4 hours from London
      case 'kualalumpur': baseAdjustment = 8; break; // +8 hours from London
      default: baseAdjustment = 0; // London
    }
    
    // Base prayer times (for London)
    const baseTimes = [
      { name: 'Fajr', hour: 4, minute: 30 },
      { name: 'Sunrise', hour: 6, minute: 15 },
      { name: 'Dhuhr', hour: 13, minute: 0 },
      { name: 'Asr', hour: 16, minute: 30 },
      { name: 'Maghrib', hour: 19, minute: 45 },
      { name: 'Isha', hour: 21, minute: 15 }
    ];
    
    // Adjust times based on location
    return baseTimes.map(prayer => {
      const adjustedHour = (((prayer.hour + baseAdjustment) % 24) + 24) % 24; // Handle negative hours
      const timeStr = `${adjustedHour.toString().padStart(2, '0')}:${prayer.minute.toString().padStart(2, '0')}`;
      return { name: prayer.name, time: timeStr };
    });
  };
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Initialize data when location changes
  useEffect(() => {
    const newRamadanDays = generateRamadanData(selectedLocation);
    const newPrayerTimes = generatePrayerTimes(selectedLocation);
    
    setRamadanDays(newRamadanDays);
    setPrayerTimes(newPrayerTimes);
    
    // Find today's Ramadan day (mock - using April 2025)
    const today = new Date();
    const todayMonth = today.getMonth();
    const todayDate = today.getDate();
    
    if (todayMonth === 3 && todayDate >= 1 && todayDate <= 30) { // April 2025
      setTodayRamadan(newRamadanDays[todayDate - 1]);
    } else {
      // For demo purposes, show the first day of Ramadan
      setTodayRamadan(newRamadanDays[0]);
    }
    
    toast.success(`Location updated to ${locations.find(l => l.id === selectedLocation)?.name}`);
  }, [selectedLocation]);
  
  // Calculate time until next event (suhoor or iftar)
  const calculateTimeUntil = useCallback(() => {
    if (!todayRamadan) return { hours: 0, minutes: 0, seconds: 0 };
    
    const now = currentTime;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();
    
    // Parse Fajr and Maghrib times
    const [fajrHour, fajrMinute] = todayRamadan.fajr.split(':').map(Number);
    const [maghribHour, maghribMinute] = todayRamadan.maghrib.split(':').map(Number);
    
    // Calculate seconds until Fajr and Maghrib
    let secondsUntilFajr = ((fajrHour - currentHour) * 3600) + 
                           ((fajrMinute - currentMinute) * 60) - 
                           currentSecond;
    if (secondsUntilFajr < 0) secondsUntilFajr += 24 * 3600; // Add one day if it's already past Fajr
    
    let secondsUntilMaghrib = ((maghribHour - currentHour) * 3600) + 
                              ((maghribMinute - currentMinute) * 60) - 
                              currentSecond;
    if (secondsUntilMaghrib < 0) secondsUntilMaghrib += 24 * 3600; // Add one day if it's already past Maghrib
    
    // Determine next event
    if (secondsUntilFajr < secondsUntilMaghrib) {
      setNextEvent('suhoor');
      return {
        hours: Math.floor(secondsUntilFajr / 3600),
        minutes: Math.floor((secondsUntilFajr % 3600) / 60),
        seconds: secondsUntilFajr % 60
      };
    } else {
      setNextEvent('iftar');
      return {
        hours: Math.floor(secondsUntilMaghrib / 3600),
        minutes: Math.floor((secondsUntilMaghrib % 3600) / 60),
        seconds: secondsUntilMaghrib % 60
      };
    }
  }, [currentTime, todayRamadan]);
  
  // Update countdown timer
  useEffect(() => {
    setTimeUntilNext(calculateTimeUntil());
  }, [currentTime, calculateTimeUntil]);
  
  // Show a new Ramadan fact every 15 seconds
  useEffect(() => {
    const factTimer = setInterval(() => {
      setFactIndex((prevIndex) => (prevIndex + 1) % 30);
    }, 15000);
    
    return () => clearInterval(factTimer);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Ramadan Timer</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Keep track of Suhoor and Iftar times during the blessed month of Ramadan.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(location => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline"
              onClick={() => setShowPrayerTimes(!showPrayerTimes)}
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              {showPrayerTimes ? 'Hide Prayer Times' : 'Show Prayer Times'}
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
            </Button>
          </div>
        </div>
        
        {todayRamadan && (
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    {todayRamadan.hijriDate}
                  </Badge>
                  <h2 className="text-xl font-semibold">
                    {todayRamadan.date}
                  </h2>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-100">
                    <div className="flex items-center justify-center mb-2">
                      <Moon className="h-6 w-6 text-islamic-primary mr-2" />
                      <h3 className="text-lg font-medium">Suhoor Ends</h3>
                    </div>
                    <p className="text-3xl font-bold">{todayRamadan.fajr}</p>
                    <p className="text-sm text-gray-500 mt-1">Fajr Prayer</p>
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded-lg text-center border border-amber-100">
                    <div className="flex items-center justify-center mb-2">
                      <Sun className="h-6 w-6 text-islamic-gold mr-2" />
                      <h3 className="text-lg font-medium">Iftar Time</h3>
                    </div>
                    <p className="text-3xl font-bold">{todayRamadan.maghrib}</p>
                    <p className="text-sm text-gray-500 mt-1">Maghrib Prayer</p>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <h3 className="text-xl font-medium mb-4">Time Until {nextEvent === 'suhoor' ? 'Suhoor Ends' : 'Iftar'}</h3>
                  <div className="flex justify-center gap-4">
                    <div className="bg-white p-4 rounded-lg w-24 border border-gray-200">
                      <p className="text-3xl font-bold">{String(timeUntilNext.hours).padStart(2, '0')}</p>
                      <p className="text-sm text-gray-500">Hours</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg w-24 border border-gray-200">
                      <p className="text-3xl font-bold">{String(timeUntilNext.minutes).padStart(2, '0')}</p>
                      <p className="text-sm text-gray-500">Minutes</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg w-24 border border-gray-200">
                      <p className="text-3xl font-bold">{String(timeUntilNext.seconds).padStart(2, '0')}</p>
                      <p className="text-sm text-gray-500">Seconds</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-islamic-primary/10 rounded-lg border border-islamic-primary/20">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-islamic-primary shrink-0 mt-0.5" />
                    <p className="text-sm italic">{todayRamadan.fact}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {showPrayerTimes && (
              <Card>
                <CardHeader>
                  <CardTitle>Prayer Times</CardTitle>
                  <CardDescription>
                    Prayer times for {locations.find(l => l.id === selectedLocation)?.name}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-2">
                    {prayerTimes.map((prayer, index) => (
                      <li 
                        key={index} 
                        className={`flex justify-between p-2 rounded-lg ${
                          prayer.name === 'Fajr' || prayer.name === 'Maghrib' 
                            ? 'bg-islamic-primary/10 border border-islamic-primary/20' 
                            : 'border-b'
                        }`}
                      >
                        <span className="font-medium">{prayer.name}</span>
                        <span>{prayer.time}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            
            {showCalendar && (
              <Card>
                <CardHeader>
                  <CardTitle>Ramadan Calendar</CardTitle>
                  <CardDescription>
                    Ramadan 1446 (2025) Calendar
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="h-[400px] overflow-y-auto">
                  <ul className="space-y-1 divide-y">
                    {ramadanDays.map((day, index) => (
                      <li 
                        key={index} 
                        className={`p-2 ${
                          todayRamadan && day.day === todayRamadan.day 
                            ? 'bg-islamic-primary/10 rounded-lg' 
                            : ''
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">Day {day.day}</span>
                            <span className="text-sm text-gray-500 ml-2">{day.date}</span>
                          </div>
                          <div className="text-sm">
                            <span className="mr-2">S: {day.fajr}</span>
                            <span>I: {day.maghrib}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default RamadanTimer;
