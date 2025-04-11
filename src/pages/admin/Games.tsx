
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gameService } from '@/services/api';
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
  questionCount?: number;
  isActive: boolean;
  comingSoon: boolean;
}

const Games = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch games from API
  const { data: gamesData, isLoading } = useQuery({
    queryKey: ['adminGames'],
    queryFn: () => gameService.getAllGames()
  });
  
  const games = gamesData?.data || [];
  
  // Filter games based on search term
  const filteredGames = games.filter((game: GameType) => 
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
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGames.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">No games found</TableCell>
                  </TableRow>
                ) : (
                  filteredGames.map((game: GameType) => (
                    <TableRow key={game._id}>
                      <TableCell className="font-medium">{game.title}</TableCell>
                      <TableCell>{game.gameType}</TableCell>
                      <TableCell className="text-center">
                        {game.comingSoon ? (
                          <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                            Coming Soon
                          </span>
                        ) : game.isActive ? (
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                            Inactive
                          </span>
                        )}
                      </TableCell>
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
