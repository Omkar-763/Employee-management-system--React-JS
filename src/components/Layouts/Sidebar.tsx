import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../store/themeConfigSlice';
import { useState, useEffect } from 'react';
import IconCaretsDown from '../Icon/IconCaretsDown';
import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
import IconMenuChat from '../Icon/Menu/IconMenuChat';
import IconMenuMailbox from '../Icon/Menu/IconMenuMailbox';
import IconMenuScrumboard from '../Icon/Menu/IconMenuScrumboard';
import IconMenuCalendar from '../Icon/Menu/IconMenuCalendar';
import IconBook from '../Icon/IconBook';
import IconBookmark from '../Icon/IconBookmark';
import IconFile from '../Icon/IconFile';
import IconFolder from '../Icon/IconFolder';
import IconHeart from '../Icon/IconHeart';
import IconHome from '../Icon/IconHome';
import IconChecks from '../Icon/IconChecks';
import axios from 'axios';

const Sidebar = () => {
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const dispatch = useDispatch();
    const location = useLocation();
    const { t } = useTranslation();
    
    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setLoading(false);
                    return;
                }

                // First check localStorage
                const localStorageAdmin = localStorage.getItem('isAdmin');
                if (localStorageAdmin) {
                    setIsAdmin(localStorageAdmin === 'true');
                    setLoading(false);
                    return;
                }

                // Fallback to API check
                const response = await axios.get('http://localhost:5000/user-info', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                // Check for both boolean true and numeric 1
                const adminStatus = response.data.is_admin === true || response.data.is_admin === 1;
                setIsAdmin(adminStatus);
                localStorage.setItem('isAdmin', adminStatus.toString());
                
            } catch (error) {
                console.error('Admin check error:', error);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };

        checkAdminStatus();
        
        // Listen for storage changes (from other tabs)
        const handleStorageChange = () => {
            const adminStatus = localStorage.getItem('isAdmin');
            setIsAdmin(adminStatus === 'true');
        };
        
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => (oldValue === value ? '' : value));
    };

    useEffect(() => {
        if (window.innerWidth < 1024) {
            dispatch(toggleSidebar());
        }
    }, [location, dispatch]);

    if (loading) {
        return (
            <div className="sidebar fixed min-h-screen w-[260px] bg-gray-100 dark:bg-gray-800">
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <nav className="sidebar fixed min-h-screen w-[260px] shadow-lg z-50 transition-all duration-300 
                bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_75%,#fff9f9_100%)]
                dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0.1)_18.66%,rgba(14,23,38,0.1)_51.04%,rgba(14,23,38,0.1)_80.07%,#0E1726_100%)]">
                
                <div className="h-full">
                    <div className="flex justify-between items-center px-4 py-3">
                        <NavLink to="/" className="main-logo flex items-center">
                            <img className="w-8" src="/assets/images/logo.svg" alt="logo" />
                            <span className="text-2xl font-semibold text-black dark:text-white">Employee Management System</span>
                        </NavLink>

                        <button
                            type="button"
                            className="collapse-icon w-8 h-8 flex items-center"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>

                    <PerfectScrollbar className="h-[calc(100vh-80px)]">
                        <ul className="p-4">
                            {/* Dashboard - Visible for all users */}
                            <li className="nav-item">
                                <NavLink to="/" className="group">
                                    <div className="flex items-center">
                                        <IconHome className="shrink-0" />
                                        <span className="pl-3 text-black dark:text-white">{t('Dashboard')}</span>
                                    </div>
                                </NavLink>
                            </li>

                            <h2 className="py-3 px-7 font-extrabold uppercase text-black dark:text-white">Apps</h2>

                            {/* All App Components - Visible for all users */}
                            <li className="nav-item">
                                <NavLink to="/apps/feed" className="group">
                                    <div className="flex items-center">
                                        <IconMenuDashboard className="shrink-0" />
                                        <span className="pl-3 text-black dark:text-white">{t('Feed')}</span>
                                    </div>
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink to="/apps/chat" className="group">
                                    <div className="flex items-center">
                                        <IconMenuChat className="shrink-0" />
                                        <span className="pl-3 text-black dark:text-white">{t('Chat')}</span>
                                    </div>
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink to="/apps/mailbox" className="group">
                                    <div className="flex items-center">
                                        <IconMenuMailbox className="shrink-0" />
                                        <span className="pl-3 text-black dark:text-white">{t('Email')}</span>
                                    </div>
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink to="/apps/drive" className="group">
                                    <div className="flex items-center">
                                        <IconFolder className="shrink-0" />
                                        <span className="pl-3 text-black dark:text-white">{t('Drive')}</span>
                                    </div>
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink to="/apps/todolist" className="group">
                                    <div className="flex items-center">
                                        <IconChecks className="shrink-0" />
                                        <span className="pl-3 text-black dark:text-white">{t('Todo List')}</span>
                                    </div>
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink to="/apps/taskandprojects" className="group">
                                    <div className="flex items-center">
                                        <IconBookmark className="shrink-0" />
                                        <span className="pl-3 text-black dark:text-white">{t('Task And Projects')}</span>
                                    </div>
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink to="/apps/scrumboard" className="group">
                                    <div className="flex items-center">
                                        <IconMenuScrumboard className="shrink-0" />
                                        <span className="pl-3 text-black dark:text-white">{t('Scrumboard')}</span>
                                    </div>
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink to="/apps/onlinedocument" className="group">
                                    <div className="flex items-center">
                                        <IconFile className="shrink-0" />
                                        <span className="pl-3 text-black dark:text-white">{t('Online Documents')}</span>
                                    </div>
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink to="/apps/calendar" className="group">
                                    <div className="flex items-center">
                                        <IconMenuCalendar className="shrink-0" />
                                        <span className="pl-3 text-black dark:text-white">{t('Calendar')}</span>
                                    </div>
                                </NavLink>
                            </li>

                            {/* Admin Section - Only visible to admins */}
                            {isAdmin && (
                                <>
                                    <h2 className="py-3 px-7 font-extrabold uppercase text-black dark:text-white">Admin</h2>

                                    <li className="nav-item">
                                        <NavLink to="/admin/users" className="group">
                                            <div className="flex items-center">
                                                <IconBook className="shrink-0" />
                                                <span className="pl-3 text-black dark:text-white">{t('Manage Users')}</span>
                                            </div>
                                        </NavLink>
                                    </li>

                                    <li className="nav-item">
                                        <NavLink to="/admin/reports" className="group">
                                            <div className="flex items-center">
                                                <IconFile className="shrink-0" />
                                                <span className="pl-3 text-black dark:text-white">{t('Reports')}</span>
                                            </div>
                                        </NavLink>
                                    </li>
                                </>
                            )}
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;