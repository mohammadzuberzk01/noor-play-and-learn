
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gameQuestionServices } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Edit, Plus, PlusCircle } from 'lucide-react';

interface GameType {
  _id: string;
  title: string;
  description: string;
  slug: string;
  gameType: string;
  iconName: string;
  questionCount: number;
}

const Games = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // In a real app, fetch games from API
  const { data: gamesData, isLoading } = useQuery({
    queryKey: ['adminGames'],
    queryFn: () => {
      // This would be replaced with a real API call in production
      return Promise.resolve({
        data: [
          { _id: '1', title: 'Islamic True or False', description: 'Test your knowledge of Islamic facts', slug: 'true-false', gameType: 'true-false', iconName: 'check-circle', questionCount: 120 },
          { _id: '2', title: 'Multiple Choice Quiz', description: 'Islamic knowledge quiz', slug: 'multiple-choice', gameType: 'multiple-choice', iconName: 'list', questionCount: 210 },
          { _id: '3', title: 'Matching Game', description: 'Match Islamic concepts', slug: 'matching', gameType: 'matching', iconName: 'git-merge', questionCount: 80 },
          { _id: '4', title: 'Word Search', description: 'Find Islamic terms', slug: 'word-search', gameType: 'word-search', iconName: 'search', questionCount: 95 },
          { _id: '5', title: 'Islamic Quiz', description: 'Comprehensive Islamic quiz', slug: 'quiz', gameType: 'quiz', iconName: 'help-circle', questionCount: 168 },
          { _id: '6', title: 'Islamic Flashcards', description: 'Learn Islamic concepts', slug: 'flashcards', gameType: 'flashcards', iconName: 'layers', questionCount: 120 },
        ]
      });
    }
  });
  
  const games = gamesData?.data || [];
  
  // Filter games based on search term
  const filteredGames = games.filter(game => 
    game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.gameType.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const navigateToQuestions = (gameSlug: string, gameType: string) => {
    navigate(`/admin/games/${gameSlug}/questions`, { state: { gameType } });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Game Management</h1>
        <Button variant="default" onClick={() => navigate('/admin/games/create')}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Game
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Games</CardTitle>
          <CardDescription>
            Manage all Islamic games in your application
          </CardDescription>
          <div className="flex w-full max-w-sm items-center space-x-2 mt-4">
            <Input
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading games...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Game Type</TableHead>
                  <TableHead className="text-center">Questions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGames.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">No games found</TableCell>
                  </TableRow>
                ) : (
                  filteredGames.map((game) => (
                    <TableRow key={game._id}>
                      <TableCell className="font-medium">{game.title}</TableCell>
                      <TableCell>{game.gameType}</TableCell>
                      <TableCell className="text-center">{game.questionCount}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mr-2"
                          onClick={() => navigate(`/admin/games/edit/${game._id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => navigateToQuestions(game.slug, game.gameType)}
                        >
                          Manage Questions
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Games;
