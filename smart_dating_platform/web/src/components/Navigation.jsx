import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api';

const Navigation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [notifications, setNotifications] = useState([]);
    const [profile, setProfile] = useState(null);

    const isPublic = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/onboarding';

    const fetchNotifications = async () => {
        if (isPublic) return;
        try {
            const res = await api.get('notifications/');
            setNotifications(res.data);
        } catch (err) { }
    };

    useEffect(() => {
        if (!isPublic) {
            api.get('users/profile/').then(res => setProfile(res.data)).catch(() => {});
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 10000);
            return () => clearInterval(interval);
        }
    }, [isPublic]);

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/');
    };

    if (isPublic) return null; // Don't render sidebar on public/auth pages

    const NavItem = ({ to, label, icon, badge }) => {
        const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
        return (
            <Link to={to} className={`flex items-center justify-between p-4 rounded-2xl mb-2 transition-all ${isActive ? 'bg-pink-50 text-pink-600 font-bold' : 'text-slate-600 hover:bg-slate-50 font-semibold'}`}>
                <div className="flex items-center gap-4">
                    <span className={`${isActive ? 'text-pink-600' : 'text-slate-400'}`}>{icon}</span>
                    <span>{label}</span>
                </div>
                {badge > 0 && <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{badge}</span>}
            </Link>
        );
    };

    const MEDIA = 'http://localhost:8000/media/';
    const avatarSrc = profile?.id_photo
        ? (profile.id_photo.startsWith('http') ? profile.id_photo : `${MEDIA}${profile.id_photo}`)
        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username || 'user'}&backgroundColor=fbbf24`;

    return (
        <aside className="w-[320px] flex-shrink-0 bg-white border-r border-slate-200 flex flex-col h-screen z-40 shadow-sm hidden md:flex">
            {/* Profile Header */}
            <div onClick={() => navigate('/profile')} className="h-24 bg-gradient-to-r from-pink-500 to-rose-500 flex items-center px-6 gap-4 cursor-pointer hover:opacity-95 transition-opacity">
                <div className="w-14 h-14 rounded-full bg-slate-200 border-2 border-white overflow-hidden shadow-md shrink-0">
                    <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-white overflow-hidden">
                     <h2 className="font-extrabold text-lg truncate leading-tight">{profile?.username || 'My Profile'}</h2>
                     <p className="text-white/80 text-xs font-semibold tracking-wide uppercase mt-0.5">{profile?.trust_score ? `Trust Score ${profile.trust_score}` : 'Premium Match'}</p>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-6 overflow-y-auto">
                <NavItem to="/dashboard" label="Discover" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>} />
                <NavItem to="/feed" label="Community Feed" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>} />
                <NavItem to="/chat" label="Messages" badge={unreadCount} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>} />
                <NavItem to="/profile" label="Settings & Trust" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>} />

                {/* Divider */}
                <div className="my-3 border-t border-slate-100"></div>
                <a href="http://localhost:8000/admin/" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-4 p-4 rounded-2xl mb-2 transition-all text-slate-500 hover:bg-amber-50 hover:text-amber-700 font-semibold border-2 border-transparent hover:border-amber-100">
                    <span className="text-slate-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><circle cx="12" cy="12" r="3" strokeWidth="2.5"></circle></svg>
                    </span>
                    <span>Admin Dashboard</span>
                    <svg className="w-3.5 h-3.5 ml-auto text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </a>
            </nav>

            {/* Logout Footer */}
            <div className="p-6 border-t border-slate-100">
                <button onClick={handleLogout} className="w-full py-4 text-slate-500 font-bold hover:bg-slate-50 hover:text-slate-700 rounded-2xl transition-colors border-2 border-transparent hover:border-slate-200">
                    Log Out
                </button>
            </div>
        </aside>
    );
};
export default Navigation;
