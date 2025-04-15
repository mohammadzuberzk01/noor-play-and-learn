import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gameService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';

const gameTypeOptions = [
  { value: 'true-false', label: 'True/False' },
  { value: 'multiple-choice', label: 'Multiple Choice' },
  { value: 'matching', label: 'Matching' },
  { value: 'word-search', label: 'Word Search' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'flashcards', label: 'Flashcards' },
  { value: 'memory', label: 'Memory' },
  { value: 'puzzle', label: 'Puzzle' },
  { value: 'other', label: 'Other' },
];

const difficultyOptions = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

const iconOptions = [
  { value: 'Check', label: 'Check' },
  { value: 'Search', label: 'Search' },
  { value: 'HelpCircle', label: 'Help Circle' },
  { value: 'Grid3X3', label: 'Grid' },
  { value: 'Puzzle', label: 'Puzzle' },
  { value: 'Layers', label: 'Layers' },
  { value: 'BookOpen', label: 'Book' },
  { value: 'GamepadIcon', label: 'Gamepad' },
];

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  category: z.string().min(2, { message: "Category is required" }),
  gameType: z.string(),
  slug: z.string().min(3, { message: "Slug must be at least 3 characters" }),
  iconName: z.string(),
  isActive: z.boolean().default(true),
  comingSoon: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const EditGame = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      difficulty: 'medium',
      category: 'Knowledge',
      gameType: 'other',
      slug: '',
      iconName: 'GamepadIcon',
      isActive: true,
      comingSoon: false,
    },
  });
  
  const { data: gameData, isLoading, error } = useQuery({
    queryKey: ['game', id],
    queryFn: () => {
      if (!id) return Promise.reject(new Error('Game ID is required'));
      
      return gameService.getGameById(id);
    },
  });
  
  useEffect(() => {
    if (gameData?.data) {
      form.reset({
        title: gameData.data.title,
        description: gameData.data.description,
        difficulty: gameData.data.difficulty,
        category: gameData.data.category,
        gameType: gameData.data.gameType,
        slug: gameData.data.slug,
        iconName: gameData.data.iconName,
        isActive: gameData.data.isActive,
        comingSoon: gameData.data.comingSoon,
      });
    }
  }, [gameData, form]);
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch game details",
        variant: "destructive",
      });
    }
  }, [error, toast]);
  
  const updateMutation = useMutation({
    mutationFn: (values: FormValues) => {
      if (!id) throw new Error('Game ID is required');
      return gameService.updateGame(id, values);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Game updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['game', id] });
      navigate('/admin/games');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update game",
        variant: "destructive",
      });
    }
  });
  
  const onSubmit = (values: FormValues) => {
    updateMutation.mutate(values);
  };
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-2"
          onClick={() => navigate('/admin/games')}
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Games
        </Button>
        <h1 className="text-3xl font-bold">Edit Game</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Game Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Game Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter game title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="game-slug" {...field} />
                      </FormControl>
                      <FormDescription>
                        URL-friendly name used in the game URL
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Game description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="Game category" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {difficultyOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="gameType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Game Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select game type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {gameTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="iconName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select icon" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {iconOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active</FormLabel>
                        <FormDescription>
                          Is this game active and visible to users?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="comingSoon"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Coming Soon</FormLabel>
                        <FormDescription>
                          Mark this game as coming soon
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="w-full md:w-auto"
                  disabled={updateMutation.isPending}
                >
                  <Save className="mr-2 h-4 w-4" /> 
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditGame;
