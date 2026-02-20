import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { authApi } from '@/features/auth/services/authApi';

export const Sidebar = () => {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error("Backend logout failed:", error);
        } finally {
            logout();
        }
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: '📊' },
        { name: 'Job Log', path: '/jobs', icon: '📝' },
        { name: 'Settings', path: '/settings', icon: '⚙️' },
    ];

    return (
        <aside className="w-64 bg-sidebar text-sidebar-text fixed h-full flex flex-col transition-colors duration-300">
            <div className="p-6 text-2xl font-bold tracking-tighter">
                Path<span className="text-brand">Log</span>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all font-medium ${
                            location.pathname === item.path
                                ? 'bg-brand text-white shadow-lg shadow-brand/20'
                                : 'hover:bg-white/5 text-slate-400 hover:text-white'
                        }`}
                    >
                        <span>{item.icon}</span>
                        {item.name}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-xs font-bold text-white">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold truncate">{user?.name}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Pro Member</div>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full py-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg transition-all text-xs font-bold uppercase tracking-wider"
                >
                    Logout
                </button>
            </div>
        </aside>
    );
};