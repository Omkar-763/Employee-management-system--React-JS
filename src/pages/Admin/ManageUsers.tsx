import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import IconPencil from '../../components/Icon/IconPencil';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import Swal from 'sweetalert2';
import IconLoader from '../../components/Icon/IconLoader';
import IconChecks from '../../components/Icon/IconChecks';
import IconX from '../../components/Icon/IconX';

interface User {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    created_at: string;
}

const ManageUsers = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [editFormData, setEditFormData] = useState({
        name: '',
        email: '',
        is_admin: false,
    });

    useEffect(() => {
        if (user?.is_admin) {
            fetchUsers();
        }
    }, [user]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/users', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            Swal.fire('Error', 'Failed to fetch users', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (user: User) => {
        setEditingUserId(user.id);
        setEditFormData({
            name: user.name,
            email: user.email,
            is_admin: user.is_admin,
        });
    };

    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleUpdateUser = async () => {
        if (!editingUserId) return;

        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5000/api/users/${editingUserId}`,
                {
                    name: editFormData.name,
                    email: editFormData.email,
                    is_admin: editFormData.is_admin,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setEditingUserId(null);
            fetchUsers();
            Swal.fire('Success', 'User updated successfully', 'success');
        } catch (error) {
            console.error('Error updating user:', error);
            Swal.fire('Error', 'Failed to update user', 'error');
        }
    };

    const handleDeleteUser = async (userId: number) => {
        // Prevent deleting yourself
        if (userId === user?.id) {
            Swal.fire('Error', 'You cannot delete yourself', 'error');
            return;
        }

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                fetchUsers();
                Swal.fire('Deleted!', 'User has been deleted.', 'success');
            } catch (error) {
                console.error('Error deleting user:', error);
                Swal.fire('Error', 'Failed to delete user', 'error');
            }
        }
    };

    const toggleAdminStatus = async (userId: number, currentStatus: boolean) => {
        // Prevent changing your own admin status
        if (userId === user?.id) {
            Swal.fire('Error', 'You cannot change your own admin status', 'error');
            return;
        }

        const result = await Swal.fire({
            title: 'Change Admin Status',
            text: `Are you sure you want to ${currentStatus ? 'remove admin privileges from' : 'make'} this user?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!',
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem('token');
                await axios.patch(
                    `http://localhost:5000/api/users/${userId}/admin-status`,
                    { is_admin: !currentStatus },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                fetchUsers();
                Swal.fire('Updated!', 'User admin status has been updated.', 'success');
            } catch (error) {
                console.error('Error updating admin status:', error);
                Swal.fire('Error', 'Failed to update admin status', 'error');
            }
        }
    };

    if (!user?.is_admin) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Unauthorized Access</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">You don't have permission to view this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="panel">
            <div className="flex items-center justify-between mb-5">
                <h5 className="font-semibold text-lg dark:text-white-light">Manage Users</h5>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <IconLoader className="w-8 h-8 animate-spin" />
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((userItem) => (
                                <tr key={userItem.id}>
                                    <td>{userItem.id}</td>
                                    <td>
                                        {editingUserId === userItem.id ? (
                                            <input type="text" name="name" value={editFormData.name} onChange={handleEditFormChange} className="form-input min-w-[150px]" />
                                        ) : (
                                            userItem.name
                                        )}
                                    </td>
                                    <td>
                                        {editingUserId === userItem.id ? (
                                            <input type="email" name="email" value={editFormData.email} onChange={handleEditFormChange} className="form-input min-w-[200px]" />
                                        ) : (
                                            userItem.email
                                        )}
                                    </td>
                                    <td>
                                        <div className="flex items-center">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    userItem.is_admin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                }`}
                                            >
                                                {userItem.is_admin ? 'Admin' : 'User'}
                                            </span>
                                            {userItem.id !== user?.id && (
                                                <button
                                                    onClick={() => toggleAdminStatus(userItem.id, userItem.is_admin)}
                                                    className="ml-2 relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                                >
                                                    <span
                                                        className={`${userItem.is_admin ? 'bg-primary' : 'bg-gray-200'} inline-block h-6 w-11 rounded-full transition-colors ease-in-out duration-200`}
                                                    ></span>
                                                    <span
                                                        className={`${
                                                            userItem.is_admin ? 'translate-x-5' : 'translate-x-0'
                                                        } absolute left-0 inline-block h-6 w-6 border border-gray-200 rounded-full bg-white shadow transform transition-transform ease-in-out duration-200`}
                                                    >
                                                        {userItem.is_admin ? <IconChecks className="h-4 w-4 text-primary mx-auto mt-1" /> : <IconX className="h-4 w-4 text-gray-400 mx-auto mt-1" />}
                                                    </span>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td>{new Date(userItem.created_at).toLocaleDateString()}</td>
                                    <td className="text-center">
                                        {editingUserId === userItem.id ? (
                                            <div className="flex justify-center space-x-2">
                                                <button type="button" className="btn btn-success btn-sm" onClick={handleUpdateUser}>
                                                    Save
                                                </button>
                                                <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => setEditingUserId(null)}>
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-center space-x-2">
                                                <button type="button" className="btn btn-primary btn-sm" onClick={() => handleEditClick(userItem)}>
                                                    <IconPencil className="w-4 h-4" />
                                                </button>
                                                <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(userItem.id)} disabled={userItem.id === user?.id}>
                                                    <IconTrashLines className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
