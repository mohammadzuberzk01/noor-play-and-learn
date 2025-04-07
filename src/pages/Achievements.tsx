
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Award, 
  Zap, 
  BookOpen, 
  Sparkles, 
  Star, 
  Flame,
  Crown,
  Lightbulb,
  Brain,
  Scroll,
  HeartHandshake
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AchievementBadge from '@/components/ui/AchievementBadge';

const Achievements = () => {
  const categories = [
    {
      name: "Learning Achievements",
      description: "Achievements earned through knowledge acquisition",
      achievements: [
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
        }
      ]
    },
    {
      name: "Dedication Achievements",
      description: "Achievements earned through consistent play",
      achievements: [
        { 
          name: "Daily Streak", 
          description: "Play for 7 consecutive days", 
          icon: Flame, 
          unlocked: false, 
          color: "bg-islamic-red" 
        },
        { 
          name: "Weekend Scholar", 
          description: "Play for 3+ hours on a weekend", 
          icon: Crown, 
          unlocked: false, 
          color: "bg-islamic-gold" 
        },
        { 
          name: "Early Bird", 
          description: "Play 5 games before 9 AM", 
          icon: Lightbulb, 
          unlocked: true, 
          color: "bg-islamic-primary" 
        }
      ]
    },
    {
      name: "Special Achievements",
      description: "Unique accomplishments across the platform",
      achievements: [
        { 
          name: "Ramadan Scholar", 
          description: "Complete all Ramadan games", 
          icon: Star, 
          unlocked: false, 
          color: "bg-islamic-teal" 
        },
        { 
          name: "Islamic History Buff", 
          description: "Answer 20 history questions correctly", 
          icon: Scroll, 
          unlocked: false, 
          color: "bg-islamic-secondary" 
        },
        { 
          name: "Islamic Math Genius", 
          description: "Solve 15 Islamic math puzzles", 
          icon: Brain, 
          unlocked: false, 
          color: "bg-islamic-accent" 
        },
        { 
          name: "Community Helper", 
          description: "Share 5 games with friends", 
          icon: HeartHandshake, 
          unlocked: false, 
          color: "bg-islamic-red" 
        }
      ]
    }
  ];
  
  const totalAchievements = categories.reduce((acc, category) => acc + category.achievements.length, 0);
  const unlockedAchievements = categories.reduce((acc, category) => 
    acc + category.achievements.filter(a => a.unlocked).length, 0);
  const progressPercentage = (unlockedAchievements / totalAchievements) * 100;
  
  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Achievements</h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Track your progress and earn badges as you learn about Islamic traditions through fun games.
            </p>
            
            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-islamic-gold" />
                    <span className="font-medium">Achievement Progress</span>
                  </div>
                  <span>{unlockedAchievements}/{totalAchievements}</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </CardContent>
            </Card>
          </header>
          
          <div className="space-y-12">
            {categories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">{category.name}</h2>
                  <p className="text-muted-foreground">{category.description}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.achievements.map((achievement, achievementIndex) => (
                    <AchievementBadge 
                      key={achievementIndex}
                      name={achievement.name}
                      description={achievement.description}
                      icon={achievement.icon}
                      unlocked={achievement.unlocked}
                      color={achievement.color}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 p-6 bg-islamic-primary/5 border border-islamic-primary/20 rounded-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-islamic-primary" />
              How to Earn Achievements
            </h2>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex gap-2">
                <div className="min-w-5 text-islamic-primary">•</div>
                <div>Play different types of games to unlock a variety of achievements.</div>
              </li>
              <li className="flex gap-2">
                <div className="min-w-5 text-islamic-primary">•</div>
                <div>Complete games at higher difficulty levels for special achievements.</div>
              </li>
              <li className="flex gap-2">
                <div className="min-w-5 text-islamic-primary">•</div>
                <div>Play consistently to earn dedication achievements.</div>
              </li>
              <li className="flex gap-2">
                <div className="min-w-5 text-islamic-primary">•</div>
                <div>Check back during Ramadan for special limited-time achievements.</div>
              </li>
              <li className="flex gap-2">
                <div className="min-w-5 text-islamic-primary">•</div>
                <div>Share games with friends to unlock community helper achievements.</div>
              </li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Achievements;
