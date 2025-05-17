import { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, Trash2, CheckCircle, Shield, ShieldOff } from 'lucide-react';
import { apiService } from '../servicies/apiService';

interface User {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    created_at: string;
}

interface ApiResponse {
    success: boolean;
    data: User[];
    message?: string;
}

export default function ManageUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingUserIds, setUpdatingUserIds] = useState<number[]>([]);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiService.get<ApiResponse>('/users');

            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to fetch users');
            }

            setUsers(response.data.data || []);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch users');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleString();
        } catch {
            return 'Invalid date';
        }
    };

    const toggleAdminStatus = async (userId: number, currentStatus: boolean) => {
        setUpdatingUserIds((prev) => [...prev, userId]);

        try {
            const response = await apiService.put<ApiResponse>(`/users/${userId}/admin`, { is_admin: !currentStatus });

            if (!response.data.success) {
                throw new Error(response.data.message || 'Update failed');
            }

            setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, is_admin: !currentStatus } : user)));
        } catch (err: any) {
            setError(err.message || 'Failed to update admin status');
        } finally {
            setUpdatingUserIds((prev) => prev.filter((id) => id !== userId));
        }
    };

    const handleDelete = async (userId: number) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await apiService.delete<ApiResponse>(`/users/${userId}`);

            if (!response.data.success) {
                throw new Error(response.data.message || 'Delete failed');
            }

            setUsers((prev) => prev.filter((user) => user.id !== userId));
        } catch (err: any) {
            setError(err.message || 'Failed to delete user');
        }
    };

    return (
        <div className="p-6 max-w-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-200">Manage Users</h1>
                <button
                    onClick={fetchUsers}
                    disabled={loading}
                    className="flex items-center px-4 py-2 text-sm font-medium rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Loading...' : 'Refresh'}
                </button>
            </div>

            {error && (
                <div className="flex items-center justify-between p-4 mb-6 rounded bg-red-900/50 border border-red-700 text-red-300">
                    <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        <p>{error}</p>
                    </div>
                    <button onClick={() => setError(null)} className="px-3 py-1 text-sm font-medium rounded bg-red-800 text-white hover:bg-red-700 transition-colors">
                        Dismiss
                    </button>
                </div>
            )}

            <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden border border-gray-700 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created At</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-900 divide-y divide-gray-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                                            <div className="flex justify-center items-center">
                                                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                                                Loading users...
                                            </div>
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                                            <div className="flex items-center justify-center text-red-400">
                                                <AlertCircle className="w-5 h-5 mr-2" />
                                                {error}
                                            </div>
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-800">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-200">{user.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-300">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {user.is_admin ? (
                                                    <span className="flex items-center px-2 py-1 text-xs font-medium rounded bg-purple-100 text-purple-800">
                                                        <Shield className="w-3 h-3 mr-1" />
                                                        Admin
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        User
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(user.created_at)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                                                        disabled={updatingUserIds.includes(user.id)}
                                                        className="p-1 text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50"
                                                        title={user.is_admin ? 'Remove admin' : 'Make admin'}
                                                    >
                                                        {updatingUserIds.includes(user.id) ? (
                                                            <RefreshCw className="w-5 h-5 animate-spin" />
                                                        ) : user.is_admin ? (
                                                            <ShieldOff className="w-5 h-5" />
                                                        ) : (
                                                            <Shield className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                    <button onClick={() => handleDelete(user.id)} className="p-1 text-red-400 hover:text-red-300 transition-colors" title="Delete user">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
