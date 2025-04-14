
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertCircle, BookOpen, HelpCircle, Mail, MessageSquare } from 'lucide-react';

const Help = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Help & Support</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HelpCircle className="mr-2 h-5 w-5" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>
              Find answers to common questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I add a new game?</AccordionTrigger>
                <AccordionContent>
                  Navigate to the Games section in the admin panel and click the "Add New Game" button. 
                  Fill in the required information and save the game. Then, you can add questions for the game.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>How do I manage questions for a game?</AccordionTrigger>
                <AccordionContent>
                  From the Games list, find the game you want to manage and click "Manage Questions". 
                  You can add, edit, or delete questions from this interface.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>How do I change my admin password?</AccordionTrigger>
                <AccordionContent>
                  Go to your profile settings by clicking on your username in the top-right corner. 
                  From there, you'll find an option to change your password.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger>How can I view user progress statistics?</AccordionTrigger>
                <AccordionContent>
                  Visit the Dashboard page to see overall statistics. For detailed user progress, 
                  go to the Users section and select a specific user to view their progress.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Documentation
            </CardTitle>
            <CardDescription>
              Detailed guides and documentation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Admin Panel Guide</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Learn how to use all features of the admin panel.
              </p>
              <a 
                href="/docs/admin-guide.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                View Guide
              </a>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Question Management</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Detailed instructions on creating and managing questions.
              </p>
              <a 
                href="/docs/question-management.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                View Guide
              </a>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">User Management</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Learn how to manage users and their permissions.
              </p>
              <a 
                href="/docs/user-management.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                View Guide
              </a>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Contact Support
            </CardTitle>
            <CardDescription>
              Get help from our support team
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-medium">Email Support</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Send an email to our support team for assistance.
                </p>
                <a 
                  href="mailto:support@noorplayandlearn.com" 
                  className="text-sm text-primary hover:underline mt-2 inline-block"
                >
                  support@noorplayandlearn.com
                </a>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-medium">Report an Issue</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Found a bug? Let us know so we can fix it.
                </p>
                <a 
                  href="https://github.com/noor-play-learn/issues/new" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline mt-2 inline-block"
                >
                  Submit a bug report
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Help;
