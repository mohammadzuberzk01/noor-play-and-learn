
import React from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GameController, 
  LogOut, 
  Menu, 
  X,
  Users,
  Settings,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    } else {
      setIsLoggedIn(true);
    }
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out from the admin panel",
    });
    navigate('/admin/login');
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  if (!isLoggedIn) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button variant="outline" size="icon" onClick={toggleSidebar} className="rounded-full">
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-200 ease-in-out 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex h-16 items-center justify-center border-b px-4">
          <h1 className="text-xl font-bold text-islamic-primary">Islamic Games Admin</h1>
        </div>
        
        <nav className="mt-5 px-2">
          <div className="space-y-1">
            <Link 
              to="/admin/dashboard" 
              className="flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-islamic-primary"
            >
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            
            <Link 
              to="/admin/games" 
              className="flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-islamic-primary"
            >
              <GameController className="mr-3 h-5 w-5" />
              Games
            </Link>
            
            <Link 
              to="/admin/users" 
              className="flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-islamic-primary"
            >
              <Users className="mr-3 h-5 w-5" />
              Users
            </Link>
            
            <Link 
              to="/admin/settings" 
              className="flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-islamic-primary"
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </Link>
            
            <Link 
              to="/admin/help" 
              className="flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-islamic-primary"
            >
              <HelpCircle className="mr-3 h-5 w-5" />
              Help
            </Link>
          </div>
        </nav>
        
        <div className="absolute bottom-0 w-full border-t p-4">
          <Button 
            variant="outline" 
            className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700" 
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Log Out
          </Button>
        </div>
      </aside>
      
      {/* Main content */}
      <main className={`min-h-screen transition-all duration-200 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        <div className="py-6 px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
