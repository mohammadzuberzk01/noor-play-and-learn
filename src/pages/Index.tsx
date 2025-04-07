
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Book, Star, Puzzle, Target, Gift } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Learn Islam Through <span className="text-islamic-primary">Interactive Games</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                  Discover Islamic traditions, history, and teachings through fun, 
                  engaging games designed for all ages and knowledge levels.
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <Link to="/games">
                    <Button size="lg" className="bg-islamic-primary hover:bg-islamic-primary/90">
                      Start Playing
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="flex-1 relative">
                <img 
                  src="/lovable-uploads/2b86eda0-bae3-4351-aca1-350d4bfa1479.png" 
                  alt="Islamic educational games" 
                  className="w-full h-auto rounded-xl shadow-lg max-w-md mx-auto"
                />
                <div className="absolute -top-6 -right-6 bg-islamic-accent text-white p-3 rounded-lg shadow-lg animate-float">
                  <div className="text-sm font-bold">Special Ramadan</div>
                  <div className="text-xs">Collection</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features */}
        <section className="py-16 bg-gradient-to-b from-background to-background/60">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Play With Us?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Search className="h-10 w-10 text-islamic-primary" />,
                  title: "Word Search & Puzzles",
                  description: "Find Islamic terms in challenging word search puzzles that expand your vocabulary."
                },
                {
                  icon: <Book className="h-10 w-10 text-islamic-secondary" />,
                  title: "Qur'an Learning",
                  description: "Engage with interactive Qur'an verse puzzles with audio recitations."
                },
                {
                  icon: <Star className="h-10 w-10 text-islamic-gold" />,
                  title: "Achievement System",
                  description: "Earn badges and rewards as you complete games and challenges."
                },
                {
                  icon: <Puzzle className="h-10 w-10 text-islamic-accent" />,
                  title: "Matching Games",
                  description: "Test your memory with Islamic matching games that teach important concepts."
                },
                {
                  icon: <Target className="h-10 w-10 text-islamic-red" />,
                  title: "Multiple Difficulty Levels",
                  description: "Games for all ages and knowledge levels, from beginners to advanced."
                },
                {
                  icon: <Gift className="h-10 w-10 text-islamic-teal" />,
                  title: "Special Ramadan Collection",
                  description: "Explore games specifically designed to teach about Ramadan traditions."
                }
              ].map((feature, index) => (
                <div key={index} className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 bg-islamic-primary/10 border-y border-islamic-primary/20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Play and Learn?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users who are discovering Islamic knowledge through interactive gameplay.
            </p>
            <Link to="/games">
              <Button size="lg" className="bg-islamic-primary hover:bg-islamic-primary/90">
                Explore Games
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
