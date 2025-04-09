import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { CheckCircle, PlusCircle, Book } from 'lucide-react';

interface Activity {
  id: string;
  name: string;
  completed: boolean;
  date: string;
  category: string;
  points: number; // Add this line
}

const MuslimTracker = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [newActivity, setNewActivity] = useState({
    name: '',
    category: '',
  });
  const [filterCategory, setFilterCategory] = useState('All');
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showForm, setShowForm] = useState(false);

  // Sample activity data
  const sampleActivities: Activity[] = [
    {
      id: '1',
      name: "Fajr Prayer",
      completed: true,
      date: "2024-08-24",
      category: "Prayer",
      points: 20
    },
    {
      id: '2',
      name: "Read Quran",
      completed: false,
      date: "2024-08-24",
      category: "Quran",
      points: 15
    },
    {
      id: '3',
      name: "Give Charity",
      completed: true,
      date: "2024-08-23",
      category: "Kindness",
      points: 25
    },
    {
      id: '4',
      name: "Isha Prayer",
      completed: true,
      date: "2024-08-23",
      category: "Prayer",
      points: 20
    },
    {
      id: '5',
      name: "Learn Hadith",
      completed: false,
      date: "2024-08-22",
      category: "Knowledge",
      points: 15
    }
  ];

  // Initialize or load activities
  useEffect(() => {
    // In a real app, this would be loaded from local storage or a database
    setActivities(sampleActivities);
  }, []);

  // Calculate total points and streak
  useEffect(() => {
    const calculatedPoints = activities.reduce((acc, activity) => acc + (activity.completed ? activity.points : 0), 0);
    setTotalPoints(calculatedPoints);

    // Calculate streak (basic example: count consecutive days with completed activities)
    let currentStreak = 0;
    let currentDate = new Date();
    const sortedActivities = [...activities].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    for (const activity of sortedActivities) {
      const activityDate = new Date(activity.date);
      if (activityDate.toDateString() === currentDate.toDateString() && activity.completed) {
        currentStreak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    setStreak(currentStreak);
  }, [activities]);

  // Handle input change for new activity form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewActivity(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new activity
  const addActivity = () => {
    if (!newActivity.name || !newActivity.category) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all fields to add a new activity.",
        variant: "destructive"
      });
      return;
    }

    const newId = Math.random().toString(36).substring(7);
    const activityToAdd: Activity = {
      id: newId,
      name: newActivity.name,
      completed: false,
      date: new Date().toISOString().split('T')[0],
      category: newActivity.category,
      points: 10
    };
    setActivities([...activities, activityToAdd]);
    setNewActivity({ name: '', category: '' });
    setShowForm(false);
    toast({
      title: "Activity Added!",
      description: `You've added ${activityToAdd.name} to your tracker.`,
      variant: "default"
    });
  };

  // Toggle activity completion status
  const toggleComplete = (id: string) => {
    setActivities(activities.map(activity =>
      activity.id === id ? { ...activity, completed: !activity.completed } : activity
    ));
  };

  // Filter activities by category
  const filteredActivities = filterCategory === 'All'
    ? activities
    : activities.filter(activity => activity.category === filterCategory);

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Muslim Activity Tracker</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your daily Islamic activities and stay motivated.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-3/5">
            <Card className="p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <Badge variant="outline" className="px-3 py-1 text-base">
                  Total Points: {totalPoints}
                </Badge>
                <Badge variant="outline" className="px-3 py-1 text-base">
                  Streak: {streak} days
                </Badge>
              </div>

              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Today's Activities</h2>
                <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)}>
                  {showForm ? "Hide Form" : "Add Activity"}
                  <PlusCircle className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {showForm && (
                <div className="mb-4">
                  <Input
                    type="text"
                    name="name"
                    placeholder="Activity Name (e.g., Read Quran)"
                    value={newActivity.name}
                    onChange={handleInputChange}
                    className="mb-2"
                  />
                  <Input
                    type="text"
                    name="category"
                    placeholder="Category (e.g., Prayer, Quran)"
                    value={newActivity.category}
                    onChange={handleInputChange}
                    className="mb-2"
                  />
                  <Button onClick={addActivity}>Add Activity</Button>
                </div>
              )}

              <div className="space-y-3">
                {filteredActivities.map(activity => (
                  <Card key={activity.id} className="p-4 bg-muted">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-lg">{activity.name}</h3>
                        <p className="text-sm text-muted-foreground">Category: {activity.category}</p>
                        <p className="text-sm text-muted-foreground">Date: {activity.date}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleComplete(activity.id)}
                      >
                        {activity.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </Card>
                ))}
                {filteredActivities.length === 0 && (
                  <p className="text-muted-foreground">No activities found in this category.</p>
                )}
              </div>
            </Card>
          </div>

          <div className="md:w-2/5">
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Filter by Category</h2>
              <div className="space-y-2">
                {['All', 'Prayer', 'Quran', 'Kindness', 'Knowledge'].map(category => (
                  <Button
                    key={category}
                    variant={filterCategory === category ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setFilterCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Book className="mr-2 h-5 w-5" />
                Why Track Activities?
              </h2>
              <p className="mb-4">
                Tracking your daily Islamic activities helps you stay consistent in your worship and good deeds.
                It provides a visual representation of your progress and motivates you to maintain a strong connection with Allah.
              </p>
              <p>
                By tracking your activities, you can identify areas where you can improve and set goals to enhance your
                spiritual growth.
              </p>
            </Card>
          </div>
        </div>

        <div className="mt-8 bg-muted p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">How to Use</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Add your daily Islamic activities to the tracker</li>
            <li>Mark activities as complete to track your progress</li>
            <li>Filter activities by category to focus on specific areas</li>
            <li>Monitor your total points and streak to stay motivated</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MuslimTracker;
