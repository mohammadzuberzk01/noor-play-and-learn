
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Noor Play & Learn</h3>
            <p className="text-muted-foreground">
              Interactive Islamic educational games for children and adults to learn while having fun.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link></li>
              <li><Link to="/games" className="text-muted-foreground hover:text-foreground transition-colors">Games</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
              <li><Link to="/profile" className="text-muted-foreground hover:text-foreground transition-colors">Profile</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <p className="text-muted-foreground">
              Questions or suggestions? Reach out to us at support@noorplaylearn.com
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            Made with <Heart className="h-4 w-4 text-islamic-red" /> for learning Islamic traditions
          </p>
          <p className="mt-1">© {new Date().getFullYear()} Noor Play & Learn. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
