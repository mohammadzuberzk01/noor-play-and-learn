
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Medal, Award, CircleUser } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Leaderboard = () => {
  const weeklyLeaders = [
    { rank: 1, name: "Mariam A.", points: 1250, avatar: "/images/avatars/avatar1.png" },
    { rank: 2, name: "Ahmad K.", points: 1180, avatar: "/images/avatars/avatar2.png" },
    { rank: 3, name: "Fatima Z.", points: 1060, avatar: "/images/avatars/avatar3.png" },
    { rank: 4, name: "Omar J.", points: 950, avatar: "/images/avatars/avatar4.png" },
    { rank: 5, name: "Sarah N.", points: 890, avatar: "/images/avatars/avatar5.png" },
    { rank: 6, name: "Yusuf H.", points: 820, avatar: "/images/avatars/avatar6.png" },
    { rank: 7, name: "Rania M.", points: 780, avatar: "/images/avatars/avatar7.png" },
    { rank: 8, name: "Ismail T.", points: 750, avatar: "/images/avatars/avatar8.png" },
    { rank: 9, name: "Amina Q.", points: 710, avatar: "/images/avatars/avatar9.png" },
    { rank: 10, name: "Khalid R.", points: 680, avatar: "/images/avatars/avatar10.png" },
  ];
  
  const monthlyLeaders = [
    { rank: 1, name: "Zainab M.", points: 5430, avatar: "/images/avatars/avatar11.png" },
    { rank: 2, name: "Hassan A.", points: 4890, avatar: "/images/avatars/avatar12.png" },
    { rank: 3, name: "Layla K.", points: 4560, avatar: "/images/avatars/avatar13.png" },
    { rank: 4, name: "Ibrahim S.", points: 4320, avatar: "/images/avatars/avatar14.png" },
    { rank: 5, name: "Noor Y.", points: 3980, avatar: "/images/avatars/avatar15.png" },
    { rank: 6, name: "Kareem T.", points: 3750, avatar: "/images/avatars/avatar16.png" },
    { rank: 7, name: "Huda R.", points: 3620, avatar: "/images/avatars/avatar17.png" },
    { rank: 8, name: "Tariq W.", points: 3480, avatar: "/images/avatars/avatar18.png" },
    { rank: 9, name: "Yasmin B.", points: 3350, avatar: "/images/avatars/avatar19.png" },
    { rank: 10, name: "Jamal Z.", points: 3210, avatar: "/images/avatars/avatar20.png" },
  ];
  
  const allTimeLeaders = [
    { rank: 1, name: "Dr. Aisha B.", points: 28750, avatar: "/images/avatars/avatar21.png" },
    { rank: 2, name: "Prof. Mustafa K.", points: 26480, avatar: "/images/avatars/avatar22.png" },
    { rank: 3, name: "Imam Zayd A.", points: 24970, avatar: "/images/avatars/avatar23.png" },
    { rank: 4, name: "Hafiz Faisal N.", points: 22340, avatar: "/images/avatars/avatar24.png" },
    { rank: 5, name: "Ustadha Safiya M.", points: 21860, avatar: "/images/avatars/avatar25.png" },
    { rank: 6, name: "Sheikh Hamza T.", points: 20740, avatar: "/images/avatars/avatar26.png" },
    { rank: 7, name: "Hafiza Ruqayya J.", points: 19580, avatar: "/images/avatars/avatar27.png" },
    { rank: 8, name: "Imam Bilal S.", points: 18460, avatar: "/images/avatars/avatar28.png" },
    { rank: 9, name: "Ustadh Umar F.", points: 17850, avatar: "/images/avatars/avatar29.png" },
    { rank: 10, name: "Hafiz Dawud L.", points: 16790, avatar: "/images/avatars/avatar30.png" },
  ];
  
  const renderLeaderRow = (leader: any, index: number) => {
    let rankIcon = null;
    let rowClass = "flex items-center justify-between p-3 border-b";
    
    if (leader.rank === 1) {
      rankIcon = <Trophy className="h-5 w-5 text-yellow-500" />;
      rowClass += " bg-yellow-50 dark:bg-yellow-900/10";
    } else if (leader.rank === 2) {
      rankIcon = <Medal className="h-5 w-5 text-gray-400" />;
      rowClass += " bg-gray-50 dark:bg-gray-900/10";
    } else if (leader.rank === 3) {
      rankIcon = <Award className="h-5 w-5 text-amber-700" />;
      rowClass += " bg-amber-50 dark:bg-amber-900/10";
    }
    
    return (
      <div key={index} className={rowClass}>
        <div className="flex items-center gap-3">
          <div className="w-6 text-center font-semibold">
            {rankIcon || leader.rank}
          </div>
          <Avatar className="h-8 w-8">
            <AvatarImage src={leader.avatar} alt={leader.name} />
            <AvatarFallback>
              <CircleUser className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{leader.name}</span>
        </div>
        <div className="font-semibold">{leader.points.toLocaleString()} pts</div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">Leaderboard</h1>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            See who's leading the way in Islamic learning through our educational games
          </p>
          
          <Card>
            <CardHeader>
              <CardTitle>Top Players</CardTitle>
              <CardDescription>
                Compete with others and climb the rankings by playing games and earning points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="weekly" className="w-full">
                <TabsList className="mb-6 grid grid-cols-3 w-full">
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="alltime">All Time</TabsTrigger>
                </TabsList>
                
                <TabsContent value="weekly" className="mt-0">
                  <div className="space-y-0 rounded-md border">
                    <div className="flex justify-between p-3 bg-muted font-semibold border-b">
                      <span>Player</span>
                      <span>Points</span>
                    </div>
                    {weeklyLeaders.map(renderLeaderRow)}
                  </div>
                </TabsContent>
                
                <TabsContent value="monthly" className="mt-0">
                  <div className="space-y-0 rounded-md border">
                    <div className="flex justify-between p-3 bg-muted font-semibold border-b">
                      <span>Player</span>
                      <span>Points</span>
                    </div>
                    {monthlyLeaders.map(renderLeaderRow)}
                  </div>
                </TabsContent>
                
                <TabsContent value="alltime" className="mt-0">
                  <div className="space-y-0 rounded-md border">
                    <div className="flex justify-between p-3 bg-muted font-semibold border-b">
                      <span>Player</span>
                      <span>Points</span>
                    </div>
                    {allTimeLeaders.map(renderLeaderRow)}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <div className="mt-8 p-6 bg-islamic-primary/5 border border-islamic-primary/20 rounded-xl">
            <h2 className="text-xl font-bold mb-4">How to Earn Points</h2>
            <ul className="space-y-2">
              <li className="flex gap-2">
                <div className="min-w-5 text-islamic-primary">•</div>
                <div>Complete games to earn base points</div>
              </li>
              <li className="flex gap-2">
                <div className="min-w-5 text-islamic-primary">•</div>
                <div>Higher difficulty levels award bonus points</div>
              </li>
              <li className="flex gap-2">
                <div className="min-w-5 text-islamic-primary">•</div>
                <div>Daily streaks multiply your points</div>
              </li>
              <li className="flex gap-2">
                <div className="min-w-5 text-islamic-primary">•</div>
                <div>Unlock achievements for additional point bonuses</div>
              </li>
              <li className="flex gap-2">
                <div className="min-w-5 text-islamic-primary">•</div>
                <div>Rankings reset weekly and monthly, but all-time rankings are permanent</div>
              </li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Leaderboard;
