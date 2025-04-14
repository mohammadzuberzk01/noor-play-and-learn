
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionService } from '@/services/api';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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

// Define different form schemas based on game type
const trueFalseSchema = z.object({
  text: z.string().min(5, "Question text must be at least 5 characters"),
  isTrue: z.boolean(),
  explanation: z.string().min(10, "Explanation must be at least 10 characters"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  isActive: z.boolean().default(true),
});

const multipleChoiceSchema = z.object({
  question: z.string().min(5, "Question text must be at least 5 characters"),
  options: z.array(z.string()).min(2, "At least 2 options are required"),
  correctOptionIndex: z.number().min(0, "Please select the correct option"),
  explanation: z.string().min(10, "Explanation must be at least 10 characters"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  isActive: z.boolean().default(true),
});

const matchingSchema = z.object({
  pairs: z.array(
    z.object({
      left: z.string().min(1, "Left item is required"),
      right: z.string().min(1, "Right item is required"),
    })
  ).min(2, "At least 2 pairs are required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  isActive: z.boolean().default(true),
});

const flashcardSchema = z.object({
  front: z.string().min(3, "Front text must be at least 3 characters"),
  back: z.string().min(3, "Back text must be at least 3 characters"),
  category: z.string().min(1, "Category is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  isActive: z.boolean().default(true),
});

// Define types for the different question forms
type TrueFalseFormValues = z.infer<typeof trueFalseSchema>;
type MultipleChoiceFormValues = z.infer<typeof multipleChoiceSchema>;
type MatchingFormValues = z.infer<typeof matchingSchema>;
type FlashcardFormValues = z.infer<typeof flashcardSchema>;

// Union type for all possible form values
type QuestionFormValues = 
  | TrueFalseFormValues 
  | MultipleChoiceFormValues 
  | MatchingFormValues 
  | FlashcardFormValues;

// Get the appropriate schema based on game type
const getFormSchema = (gameType: string) => {
  switch (gameType) {
    case 'true-false':
      return trueFalseSchema;
    case 'multiple-choice':
    case 'quiz':
      return multipleChoiceSchema;
    case 'matching':
      return matchingSchema;
    case 'flashcards':
      return flashcardSchema;
    default:
      return trueFalseSchema; // Fallback to true/false as default
  }
};

// Get default values based on game type
const getDefaultValues = (gameType: string): QuestionFormValues => {
  switch (gameType) {
    case 'true-false':
      return {
        text: '',
        isTrue: false,
        explanation: '',
        difficulty: 'medium' as const,
        isActive: true,
      };
    case 'multiple-choice':
    case 'quiz':
      return {
        question: '',
        options: ['', ''],
        correctOptionIndex: 0,
        explanation: '',
        difficulty: 'medium' as const,
        isActive: true,
      };
    case 'matching':
      return {
        pairs: [
          { left: '', right: '' },
          { left: '', right: '' },
        ],
        difficulty: 'medium' as const,
        isActive: true,
      };
    case 'flashcards':
      return {
        front: '',
        back: '',
        category: '',
        difficulty: 'medium' as const,
        isActive: true,
      };
    default:
      return {
        text: '',
        isTrue: false,
        explanation: '',
        difficulty: 'medium' as const,
        isActive: true,
      };
  }
};

// Type guard functions to check form value types
const isTrueFalseForm = (form: QuestionFormValues): form is TrueFalseFormValues => {
  return 'text' in form && 'isTrue' in form;
};

const isMultipleChoiceForm = (form: QuestionFormValues): form is MultipleChoiceFormValues => {
  return 'question' in form && 'options' in form;
};

const isMatchingForm = (form: QuestionFormValues): form is MatchingFormValues => {
  return 'pairs' in form;
};

const isFlashcardForm = (form: QuestionFormValues): form is FlashcardFormValues => {
  return 'front' in form && 'back' in form;
};

const QuestionManagement = () => {
  const { gameSlug } = useParams<{ gameSlug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [difficulty, setDifficulty] = useState<string | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [gameType, setGameType] = useState<string>('true-false');
  
  // Fetch game details to get the game type
  const { data: gameData } = useQuery({
    queryKey: ['game', gameSlug],
    queryFn: async () => {
      if (!gameSlug) return { data: { gameType: 'true-false' } };
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/games/${gameSlug}`);
        return response.json();
      } catch (error) {
        console.error('Error fetching game details:', error);
        return { data: { gameType: 'true-false' } };
      }
    },
    enabled: !!gameSlug,
  });
  
  // Update game type when game data is loaded
  useEffect(() => {
    if (gameData?.data?.gameType) {
      setGameType(gameData.data.gameType);
    } else if (location.state?.gameType) {
      setGameType(location.state.gameType);
    }
  }, [gameData, location.state]);
  
  // Create form based on game type
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(getFormSchema(gameType)),
    defaultValues: getDefaultValues(gameType),
  });
  
  // Reset form values when game type changes
  useEffect(() => {
    form.reset(getDefaultValues(gameType));
  }, [gameType, form]);
  
  // Fetch questions for the specific game
  const { 
    data: questionsData, 
    isLoading,
    error
  } = useQuery({
    queryKey: ['adminGameQuestions', gameSlug, difficulty],
    queryFn: () => {
      if (!gameSlug) return Promise.resolve({ data: [] });
      return questionService.getQuestions(gameSlug, { difficulty, limit: 100 });
    },
    enabled: !!gameSlug
  });
  
  // Create mutation for adding/updating questions
  const mutation = useMutation({
    mutationFn: (values: any) => {
      if (!gameSlug) throw new Error("Game slug is required");
      
      if (editingQuestion) {
        return questionService.updateQuestion(gameSlug, editingQuestion._id, values);
      } else {
        return questionService.createQuestion(gameSlug, values);
      }
    },
    onSuccess: () => {
      toast({
        title: editingQuestion ? "Question updated" : "Question created",
        description: editingQuestion 
          ? "The question has been updated successfully" 
          : "The question has been created successfully",
      });
      setIsDialogOpen(false);
      setEditingQuestion(null);
      form.reset(getDefaultValues(gameType));
      queryClient.invalidateQueries({ queryKey: ['adminGameQuestions', gameSlug] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `An error occurred: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  });
  
  // Delete question mutation
  const deleteMutation = useMutation({
    mutationFn: (questionId: string) => {
      if (!gameSlug) throw new Error("Game slug is required");
      return questionService.deleteQuestion(gameSlug, questionId);
    },
    onSuccess: () => {
      toast({
        title: "Question deleted",
        description: "The question has been deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['adminGameQuestions', gameSlug] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `An error occurred: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  });
  
  const questions = questionsData?.data || [];
  
  // Filter questions based on search term
  const filteredQuestions = questions.filter((question: any) => {
    // Different filtering logic based on question type
    if (gameType === 'true-false') {
      return question.text?.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (gameType === 'multiple-choice' || gameType === 'quiz') {
      return question.question?.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (gameType === 'flashcards') {
      return question.front?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             question.back?.toLowerCase().includes(searchTerm.toLowerCase());
    }
    // Default case
    return true;
  });
  
  const onSubmit = async (values: QuestionFormValues) => {
    mutation.mutate(values);
  };
  
  const handleEdit = (question: any) => {
    setEditingQuestion(question);
    
    // Reset form with the appropriate values based on game type
    if (gameType === 'true-false') {
      form.reset({
        text: question.text,
        isTrue: question.isTrue,
        explanation: question.explanation,
        difficulty: question.difficulty,
        isActive: question.isActive,
      } as TrueFalseFormValues);
    } else if (gameType === 'multiple-choice' || gameType === 'quiz') {
      form.reset({
        question: question.question,
        options: question.options || ['', ''],
        correctOptionIndex: question.correctOptionIndex,
        explanation: question.explanation,
        difficulty: question.difficulty,
        isActive: question.isActive,
      } as MultipleChoiceFormValues);
    } else if (gameType === 'matching') {
      form.reset({
        pairs: question.pairs || [{ left: '', right: '' }, { left: '', right: '' }],
        difficulty: question.difficulty,
        isActive: question.isActive,
      } as MatchingFormValues);
    } else if (gameType === 'flashcards') {
      form.reset({
        front: question.front,
        back: question.back,
        category: question.category,
        difficulty: question.difficulty,
        isActive: question.isActive,
      } as FlashcardFormValues);
    }
    
    setIsDialogOpen(true);
  };
  
  const handleDelete = async (questionId: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      deleteMutation.mutate(questionId);
    }
  };
  
  const openAddDialog = () => {
    setEditingQuestion(null);
    form.reset(getDefaultValues(gameType));
    setIsDialogOpen(true);
  };
  
  // Helper function to render form based on game type
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
                  <FormMessage />
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
                    value={field.value}
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
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving...' : editingQuestion ? 'Update Question' : 'Create Question'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      );
    } else if (gameType === 'multiple-choice' || gameType === 'quiz') {
      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter the question" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {form.getValues('options') && form.getValues('options').map((_, index) => (
              <FormField
                key={index}
                control={form.control}
                name={`options.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Option {index + 1}</FormLabel>
                    <FormControl>
                      <Input placeholder={`Enter option ${index + 1}`} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const currentOptions = form.getValues('options');
                if (!currentOptions) return;
                form.setValue('options', [...currentOptions, '']);
              }}
            >
              Add Option
            </Button>
            
            <FormField
              control={form.control}
              name="correctOptionIndex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correct Option</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value?.toString() || "0"}
                    value={field.value?.toString() || "0"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select correct option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {form.getValues('options') && form.getValues('options').map((option, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          Option {index + 1}
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
              name="explanation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Explanation</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Explain the correct answer" {...field} />
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
                    value={field.value}
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
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving...' : editingQuestion ? 'Update Question' : 'Create Question'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      );
    } else if (gameType === 'flashcards') {
      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="front"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Front Text</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter the front text of the flashcard" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="back"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Back Text</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter the back text of the flashcard" {...field} />
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
                    <Input placeholder="Enter category" {...field} />
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
                    value={field.value}
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
                      Is this flashcard active and available in the game?
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
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving...' : editingQuestion ? 'Update Flashcard' : 'Create Flashcard'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      );
    } else if (gameType === 'matching') {
      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {form.getValues('pairs') && form.getValues('pairs').map((_, index) => (
              <div key={index} className="border p-4 rounded-lg space-y-4">
                <h3 className="font-medium">Pair {index + 1}</h3>
                <FormField
                  control={form.control}
                  name={`pairs.${index}.left` as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Left Item</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter left item" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`pairs.${index}.right` as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Right Item</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter right item" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const currentPairs = form.getValues('pairs');
                if (!currentPairs) return;
                form.setValue('pairs', [...currentPairs, { left: '', right: '' }]);
              }}
            >
              Add Pair
            </Button>
            
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
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
                      Is this matching set active and available in the game?
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
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving...' : editingQuestion ? 'Update Matching Set' : 'Create Matching Set'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      );
    }
    
    // Default form or unsupported game type
    return (
      <div className="text-center p-4">
        <p>Question management for {gameType} is not fully implemented yet.</p>
        <p>Please check back later for updates.</p>
      </div>
    );
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
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      ));
    } else if (gameType === 'multiple-choice' || gameType === 'quiz') {
      return filteredQuestions.map((question: any) => (
        <TableRow key={question._id}>
          <TableCell className="font-medium max-w-lg truncate">{question.question}</TableCell>
          <TableCell>{question.options?.length || 0} options</TableCell>
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
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      ));
    } else if (gameType === 'flashcards') {
      return filteredQuestions.map((question: any) => (
        <TableRow key={question._id}>
          <TableCell className="font-medium max-w-lg truncate">{question.front}</TableCell>
          <TableCell className="max-w-lg truncate">{question.back}</TableCell>
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
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      ));
    } else if (gameType === 'matching') {
      return filteredQuestions.map((question: any) => (
        <TableRow key={question._id}>
          <TableCell className="font-medium">{question.pairs?.length || 0} pairs</TableCell>
          <TableCell>{question.pairs?.[0]?.left} → {question.pairs?.[0]?.right}</TableCell>
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
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      ));
    }
    
    // Default case for unsupported game types
    return (
      <TableRow>
        <TableCell colSpan={4} className="text-center">
          Question management for {gameType} is not fully implemented yet.
        </TableCell>
      </TableRow>
    );
  };
  
  // Helper function to render the correct table headers
  const renderTableHeaders = () => {
    if (gameType === 'true-false') {
      return (
        <TableRow>
          <TableHead>Question</TableHead>
          <TableHead>Answer</TableHead>
          <TableHead>Difficulty</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      );
    } else if (gameType === 'multiple-choice' || gameType === 'quiz') {
      return (
        <TableRow>
          <TableHead>Question</TableHead>
          <TableHead>Options</TableHead>
          <TableHead>Difficulty</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      );
    } else if (gameType === 'flashcards') {
      return (
        <TableRow>
          <TableHead>Front</TableHead>
          <TableHead>Back</TableHead>
          <TableHead>Difficulty</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      );
    } else if (gameType === 'matching') {
      return (
        <TableRow>
          <TableHead>Pairs</TableHead>
          <TableHead>Sample</TableHead>
          <TableHead>Difficulty</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      );
    }
    
    // Default headers
    return (
      <TableRow>
        <TableHead>Question</TableHead>
        <TableHead>Type</TableHead>
        <TableHead>Difficulty</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    );
  };
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        Error loading questions: {(error as Error).message}
      </div>
    );
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
        <h1 className="text-3xl font-bold">
          {gameData?.data?.title || gameSlug} Questions
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({gameType})
          </span>
        </h1>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Manage Questions</CardTitle>
              <CardDescription>
                Add, edit, or remove questions for this game
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
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                {renderTableHeaders()}
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
              {editingQuestion 
                ? `Edit ${gameType === 'flashcards' ? 'Flashcard' : 'Question'}`
                : `Create New ${gameType === 'flashcards' ? 'Flashcard' : 'Question'}`}
            </DialogTitle>
            <DialogDescription>
              {editingQuestion 
                ? `Update the details of the existing ${gameType === 'flashcards' ? 'flashcard' : 'question'}`
                : `Fill in the details to create a new ${gameType === 'flashcards' ? 'flashcard' : 'question'}`}
            </DialogDescription>
          </DialogHeader>
          
          {renderQuestionForm()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuestionManagement;
