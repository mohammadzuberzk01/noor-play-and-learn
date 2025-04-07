
import React from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, User, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Header = () => {
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    toast({
      title: newMode ? "Dark mode enabled" : "Light mode enabled",
      description: "Your preference has been saved.",
      duration: 2000,
    });
  };

  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-islamic-primary flex items-center justify-center">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <h1 className="text-2xl font-bold text-islamic-dark">Noor Play & Learn</h1>
        </Link>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <Link to="/profile">
            <Button variant="outline" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          
          <Link to="/achievements">
            <Button variant="outline" size="icon">
              <Trophy className="h-5 w-5" />
            </Button>
          </Link>
          
          <Link to="/games">
            <Button>Play Games</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
