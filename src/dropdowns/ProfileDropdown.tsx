import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}

const ProfileDropdown = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/auth/boxed-signin');
          return;
        }

        const response = await axios.get('http://localhost:5000/user-info', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUser(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            handleLogout();
          }
          toast.error(error.response?.data.error || 'Failed to fetch user data');
        } else {
          console.error('Unexpected error:', error);
          toast.error('An unexpected error occurred');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/auth/boxed-signin');
    toast.success('Logged out successfully');
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  if (!user) {
    return (
      <button 
        onClick={() => navigate('/auth/boxed-signin')}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Login
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <img
          src="/assets/images/user-profile.jpeg"
          alt="User profile"
          className="w-8 h-8 rounded-full object-cover border-2 border-gray-300"
        />
        <span className="font-medium text-gray-700">{user.name}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          tabIndex={-1}
        >
          <div className="px-4 py-3 border-b">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
            {user.is_admin && (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                Admin
              </span>
            )}
          </div>
          
          <a
            href="/users/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            role="menuitem"
            tabIndex={-1}
          >
            Profile Settings
          </a>
          
          {user.is_admin && (
            <a
              href="/admin/users"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
              tabIndex={-1}
            >
              Admin Dashboard
            </a>
          )}
          
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            role="menuitem"
            tabIndex={-1}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;