
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/theme-toggle';
import { useTheme } from '@/components/theme-provider';
import { Menu, X, User, Trophy, Award, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { useMediaQuery } from '@/hooks/use-mobile';

const Header = () => {
  const { theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  const navItems = [
    { name: 'Games', path: '/games' },
    { name: 'Profile', path: '/profile' },
    { name: 'Achievements', path: '/achievements' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background shadow-sm border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold text-xl text-primary">Noor</span>
          <span className="text-lg">Play & Learn</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-foreground hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <ModeToggle />
          
          {isMobile && (
            <Button variant="outline" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-background z-40 pt-16">
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                onClick={closeMenu}
              >
                {item.path === '/profile' && <User className="h-5 w-5" />}
                {item.path === '/achievements' && <Award className="h-5 w-5" />}
                {item.path === '/leaderboard' && <Trophy className="h-5 w-5" />}
                {item.path === '/about' && <HelpCircle className="h-5 w-5" />}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
