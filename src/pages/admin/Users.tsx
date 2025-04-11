
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Edit, Trash2, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  joinedDate: string;
  lastActive: string;
}

const Users = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data - in a real app, this would come from an API call
  const mockUsers: User[] = [
    { _id: '1', username: 'ahmed', email: 'ahmed@example.com', role: 'user', joinedDate: '2024-01-15', lastActive: '2024-04-10' },
    { _id: '2', username: 'fatima', email: 'fatima@example.com', role: 'user', joinedDate: '2024-02-20', lastActive: '2024-04-05' },
    { _id: '3', username: 'omar', email: 'omar@example.com', role: 'admin', joinedDate: '2023-11-10', lastActive: '2024-04-11' },
    { _id: '4', username: 'aisha', email: 'aisha@example.com', role: 'user', joinedDate: '2024-03-05', lastActive: '2024-03-28' },
    { _id: '5', username: 'yusuf', email: 'yusuf@example.com', role: 'user', joinedDate: '2024-01-30', lastActive: '2024-04-09' },
  ];
  
  // Filter users based on search term
  const filteredUsers = mockUsers.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleEditUser = (userId: string) => {
    toast({
      title: "Edit User",
      description: `Editing user with ID: ${userId}`,
    });
  };
  
  const handleDeleteUser = (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      toast({
        title: "User Deleted",
        description: `User with ID: ${userId} has been deleted`,
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Management</h1>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                Manage users for your Islamic Games application
              </CardDescription>
            </div>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" /> Add User
            </Button>
          </div>
          
          <div className="flex w-full max-w-sm items-center space-x-2 mt-4">
            <Input
              type="text"
              placeholder="Search users..."
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">No users found</TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>{user.joinedDate}</TableCell>
                    <TableCell>{user.lastActive}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mr-2"
                        onClick={() => handleEditUser(user._id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
