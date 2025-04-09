import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Calendar, CheckCircle } from 'lucide-react';

interface Dhikr {
  id: number;
  name: string;
  count: number;
}

const DhikrQuest = () => {
  const [dhikrs, setDhikrs] = useState<Dhikr[]>([
    { id: 1, name: 'SubhanAllah', count: 33 },
    { id: 2, name: 'Alhamdulillah', count: 33 },
    { id: 3, name: 'Allahu Akbar', count: 34 },
  ]);
  const [completedDhikrs, setCompletedDhikrs] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [lastCompleted, setLastCompleted] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const currentDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const storedCompletedDhikrs = localStorage.getItem('completedDhikrs');
    const storedStreak = localStorage.getItem('streak');
    const storedLastCompleted = localStorage.getItem('lastCompleted');

    if (storedCompletedDhikrs) {
      setCompletedDhikrs(JSON.parse(storedCompletedDhikrs));
    }
    if (storedStreak) {
      setStreak(parseInt(storedStreak, 10));
    }
    if (storedLastCompleted) {
      setLastCompleted(storedLastCompleted);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('completedDhikrs', JSON.stringify(completedDhikrs));
    localStorage.setItem('streak', streak.toString());
    localStorage.setItem('lastCompleted', lastCompleted || '');
  }, [completedDhikrs, streak, lastCompleted]);

  const handleDhikrCompletion = (dhikrName: string) => {
    const today = new Date().toISOString().split('T')[0];

    if (!completedDhikrs.includes(today + dhikrName)) {
      setCompletedDhikrs([...completedDhikrs, today + dhikrName]);
      setLastCompleted(today);
      if (lastCompleted === today) {
        setStreak(streak + 1);
      } else if (lastCompleted !== today) {
        setStreak(1);
      }
      toast({
        title: "Dhikr Completed!",
        description: `You completed ${dhikrName} for today. Keep up the good work!`,
      });
    } else {
      toast({
        title: "Already Completed",
        description: `You have already completed ${dhikrName} for today.`,
        variant: "destructive",
      });
    }
  };

  const isDhikrCompletedToday = (dhikrName: string) => {
    const today = new Date().toISOString().split('T')[0];
    return completedDhikrs.includes(today + dhikrName);
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Dhikr Quest</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Embark on a daily quest to remember Allah through dhikr and build a consistent streak.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-3/5">
            <Card className="p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <Badge variant="outline" className="px-3 py-1 text-base">
                  Streak: {streak}
                </Badge>
                <Button variant="outline" size="sm" onClick={toggleCalendar}>
                  {showCalendar ? "Hide Calendar" : "Show Calendar"}
                  <Calendar className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <h2 className="text-xl font-bold mb-4">Today's Dhikrs</h2>
              <div className="space-y-3">
                {dhikrs.map(dhikr => (
                  <Card key={dhikr.id} className="p-4 bg-muted flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{dhikr.name}</h3>
                      <p className="text-sm text-muted-foreground">Recite {dhikr.count} times</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isDhikrCompletedToday(dhikr.name)}
                      onClick={() => handleDhikrCompletion(dhikr.name)}
                    >
                      {isDhikrCompletedToday(dhikr.name) ? (
                        <>
                          Completed <CheckCircle className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        "Complete"
                      )}
                    </Button>
                  </Card>
                ))}
              </div>
            </Card>
          </div>

          <div className="md:w-2/5">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Why Perform Dhikr?</h2>
              <p className="mb-4">
                Dhikr is the remembrance of Allah, and it brings peace to the heart. It is a way to connect with the
                Divine and strengthen your faith.
              </p>
              <p>
                The Prophet Muhammad (peace be upon him) said: "The best of deeds in the sight of Allah is that you
                should die while your tongue is wet with the remembrance of Allah."
              </p>
            </Card>
          </div>
        </div>

        <div className="mt-8 bg-muted p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">How to Play</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Complete the daily dhikrs to earn a streak</li>
            <li>Track your progress on the calendar</li>
            <li>Strive to maintain a consistent habit of remembering Allah</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DhikrQuest;
