// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { MoreVertical, Search, Loader2, Check, X } from 'lucide-react';
// import { useToast } from '@/components/ui/use-toast';
// import { Badge } from '@/components/ui/badge';

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: 'ADMIN' | 'USER';
//   status: 'ACTIVE' | 'INACTIVE';
//   createdAt: string;
// }

// const ManageUsers = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const { toast } = useToast();

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     const results = users.filter(
//       (user) =>
//         user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.email.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredUsers(results);
//   }, [searchTerm, users]);

//   const fetchUsers = async () => {
//     try {
//       const response = await axios.get('/api/users', {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });
//       setUsers(response.data);
//       setFilteredUsers(response.data);
//     } catch (error) {
//       toast({
//         title: 'Error',
//         description: 'Failed to fetch users',
//         variant: 'destructive',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateUserRole = async (userId: string, newRole: 'ADMIN' | 'USER') => {
//     try {
//       await axios.patch(
//         `/api/users/${userId}/role`,
//         { role: newRole },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         }
//       );
//       toast({
//         title: 'Success',
//         description: `User role updated to ${newRole}`,
//       });
//       fetchUsers();
//     } catch (error) {
//       toast({
//         title: 'Error',
//         description: 'Failed to update user role',
//         variant: 'destructive',
//       });
//     }
//   };

//   const updateUserStatus = async (userId: string, newStatus: 'ACTIVE' | 'INACTIVE') => {
//     try {
//       await axios.patch(
//         `/api/users/${userId}/status`,
//         { status: newStatus },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         }
//       );
//       toast({
//         title: 'Success',
//         description: `User status updated to ${newStatus}`,
//       });
//       fetchUsers();
//     } catch (error) {
//       toast({
//         title: 'Error',
//         description: 'Failed to update user status',
//         variant: 'destructive',
//       });
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//     });
//   };

//   return (
//     <div className="p-6 space-y-4">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">User Management</h1>
//         <div className="relative w-64">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//           <Input
//             placeholder="Search users..."
//             className="pl-10"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <Loader2 className="h-8 w-8 animate-spin" />
//         </div>
//       ) : (
//         <div className="rounded-md border">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Name</TableHead>
//                 <TableHead>Email</TableHead>
//                 <TableHead>Role</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Joined</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredUsers.length > 0 ? (
//                 filteredUsers.map((user) => (
//                   <TableRow key={user.id}>
//                     <TableCell className="font-medium">{user.name}</TableCell>
//                     <TableCell>{user.email}</TableCell>
//                     <TableCell>
//                       <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
//                         {user.role}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>
//                       <Badge variant={user.status === 'ACTIVE' ? 'default' : 'destructive'}>
//                         {user.status}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>{formatDate(user.createdAt)}</TableCell>
//                     <TableCell className="text-right">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button variant="ghost" size="icon">
//                             <MoreVertical className="h-4 w-4" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                           <DropdownMenuItem
//                             onClick={() =>
//                               updateUserRole(
//                                 user.id,
//                                 user.role === 'ADMIN' ? 'USER' : 'ADMIN'
//                               )
//                             }
//                           >
//                             {user.role === 'ADMIN' ? (
//                               <>
//                                 <X className="mr-2 h-4 w-4" />
//                                 Remove Admin
//                               </>
//                             ) : (
//                               <>
//                                 <Check className="mr-2 h-4 w-4" />
//                                 Make Admin
//                               </>
//                             )}
//                           </DropdownMenuItem>
//                           <DropdownMenuItem
//                             onClick={() =>
//                               updateUserStatus(
//                                 user.id,
//                                 user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
//                               )
//                             }
//                           >
//                             {user.status === 'ACTIVE' ? (
//                               <>
//                                 <X className="mr-2 h-4 w-4" />
//                                 Deactivate
//                               </>
//                             ) : (
//                               <>
//                                 <Check className="mr-2 h-4 w-4" />
//                                 Activate
//                               </>
//                             )}
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={6} className="h-24 text-center">
//                     No users found
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ManageUsers;
import React from 'react'

export default function ManageUsers() {
  return (
    <div>
      MANAGE USER
    </div>
  )
}
