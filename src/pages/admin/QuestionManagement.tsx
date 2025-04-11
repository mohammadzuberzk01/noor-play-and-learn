
import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { gameQuestionServices } from '@/services/api';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Edit, Trash2, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

// Generate form schema based on game type
const getTrueFalseFormSchema = () => z.object({
  text: z.string().min(5, "Question text must be at least 5 characters"),
  isTrue: z.boolean(),
  explanation: z.string().min(10, "Explanation must be at least 10 characters"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  isActive: z.boolean().default(true),
});

const QuestionManagement = () => {
  const { gameSlug } = useParams<{ gameSlug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const gameType = location.state?.gameType || 'true-false';
  const [searchTerm, setSearchTerm] = useState('');
  const [difficulty, setDifficulty] = useState<string | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  
  // Create form schema based on game type
  const formSchema = getTrueFalseFormSchema();
  
  // Create form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
      isTrue: false,
      explanation: '',
      difficulty: 'medium',
      isActive: true,
    },
  });
  
  // Fetch questions for the specific game
  const { 
    data: questionsData, 
    isLoading,
    refetch 
  } = useQuery({
    queryKey: ['adminGameQuestions', gameSlug, difficulty],
    queryFn: () => {
      // In a real app, this would be a real API call
      if (gameType === 'true-false') {
        return gameQuestionServices.trueFalse.getQuestions(gameSlug!, { difficulty, limit: 100 });
      }
      // Add handlers for other game types here
      return Promise.resolve({ data: [] });
    }
  });
  
  const questions = questionsData?.data || [];
  
  // Filter questions based on search term
  const filteredQuestions = questions.filter((question: any) => {
    if (gameType === 'true-false') {
      return question.text.toLowerCase().includes(searchTerm.toLowerCase());
    }
    // Add filters for other question types here
    return true;
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (editingQuestion) {
        // Update existing question
        // In a real app, this would be a real API call
        await gameQuestionServices.trueFalse.updateQuestion(
          gameSlug!, 
          editingQuestion._id, 
          values
        );
        toast({
          title: "Question updated",
          description: "The question has been updated successfully",
        });
      } else {
        // Create new question
        // In a real app, this would be a real API call
        await gameQuestionServices.trueFalse.createQuestion(gameSlug!, values);
        toast({
          title: "Question created",
          description: "The question has been created successfully",
        });
      }
      
      // Close dialog and reset form
      setIsDialogOpen(false);
      setEditingQuestion(null);
      form.reset();
      
      // Refetch questions
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving the question",
        variant: "destructive",
      });
    }
  };
  
  const handleEdit = (question: any) => {
    setEditingQuestion(question);
    form.reset({
      text: question.text,
      isTrue: question.isTrue,
      explanation: question.explanation,
      difficulty: question.difficulty,
      isActive: question.isActive,
    });
    setIsDialogOpen(true);
  };
  
  const handleDelete = async (questionId: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        // In a real app, this would be a real API call
        await gameQuestionServices.trueFalse.deleteQuestion(gameSlug!, questionId);
        toast({
          title: "Question deleted",
          description: "The question has been deleted successfully",
        });
        refetch();
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while deleting the question",
          variant: "destructive",
        });
      }
    }
  };
  
  const openAddDialog = () => {
    setEditingQuestion(null);
    form.reset({
      text: '',
      isTrue: false,
      explanation: '',
      difficulty: 'medium',
      isActive: true,
    });
    setIsDialogOpen(true);
  };
  
  // Helper function to render the appropriate form based on game type
  const renderQuestionForm = () => {
    if (gameType === 'true-false') {
      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Text</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter the question statement" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isTrue"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Is this statement true?</FormLabel>
                    <FormDescription>
                      Toggle whether the statement is true or false
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="explanation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Explanation</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Explain why the statement is true or false" {...field} />
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
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
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
                      Is this question active and available in the game?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">
                {editingQuestion ? 'Update Question' : 'Create Question'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      );
    }
    
    // Add forms for other game types here
    return <p>Form for {gameType} questions not implemented yet</p>;
  };
  
  // Helper function to render table rows based on game type
  const renderQuestionRows = () => {
    if (gameType === 'true-false') {
      return filteredQuestions.map((question: any) => (
        <TableRow key={question._id}>
          <TableCell className="font-medium max-w-lg truncate">{question.text}</TableCell>
          <TableCell>
            {question.isTrue ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="mr-1 h-4 w-4" /> True
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <XCircle className="mr-1 h-4 w-4" /> False
              </div>
            )}
          </TableCell>
          <TableCell>{question.difficulty}</TableCell>
          <TableCell className="text-right">
            <Button 
              variant="outline" 
              size="sm" 
              className="mr-2"
              onClick={() => handleEdit(question)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => handleDelete(question._id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      ));
    }
    
    // Add renderers for other question types here
    return <TableRow><TableCell colSpan={4}>No questions available</TableCell></TableRow>;
  };
  
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
        <h1 className="text-3xl font-bold">{gameSlug} Questions</h1>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Manage Questions</CardTitle>
              <CardDescription>
                Add, edit, or remove questions for the {gameType} game
              </CardDescription>
            </div>
            <Button onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" /> Add Question
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center mt-4">
            <div className="flex items-center space-x-2 flex-1">
              <Input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            
            <Select 
              value={difficulty || "all"} 
              onValueChange={(value) => setDifficulty(value === "all" ? undefined : value)}
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading questions...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  {gameType === 'true-false' && <TableHead>Answer</TableHead>}
                  <TableHead>Difficulty</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuestions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">No questions found</TableCell>
                  </TableRow>
                ) : (
                  renderQuestionRows()
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingQuestion ? 'Edit Question' : 'Create New Question'}
            </DialogTitle>
            <DialogDescription>
              {editingQuestion 
                ? 'Update the details of the existing question' 
                : 'Fill in the details to create a new question'}
            </DialogDescription>
          </DialogHeader>
          
          {renderQuestionForm()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuestionManagement;
