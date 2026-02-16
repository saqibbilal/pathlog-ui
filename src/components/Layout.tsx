import { useAuthStore } from '@/store/useAuthStore';
import { Outlet, Link } from 'react-router-dom';
import { authService } from '@/features/auth/services/authService';

export const Layout = () => {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = async () => {
        try {
            // Attempt to tell Laravel to kill the token
            await authService.logout();
        } catch (error) {
            // Even if the server is down or the token is already invalid,
            // we catch the error so the next line still runs.
            console.error("Backend logout failed:", error);
        } finally {
            // This MUST run. It clears Zustand and redirects the user via ProtectedRoute logic.
            logout();
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar: Fixed Rectangle on the Left */}
            <aside className="w-64 bg-slate-900 text-white fixed h-full flex flex-col">
                <div className="p-6 text-2xl font-bold tracking-tight">PathLog</div>

                <nav className="flex-1 px-4 space-y-2">
                    <Link to="/dashboard" className="block p-3 hover:bg-slate-800 rounded-xl transition-colors">Dashboard</Link>
                    <Link to="/jobs" className="block p-3 hover:bg-slate-800 rounded-xl transition-colors">Job Log</Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="text-sm text-slate-400">Logged in as:</div>
                    <div className="font-medium truncate">{user?.name}</div>
                    <button
                        onClick={handleLogout}
                        className="mt-4 w-full py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all text-sm font-bold"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content: Pushed to the right by the sidebar width */}
            <main className="flex-1 ml-64 p-8">
                <Outlet />
            </main>
        </div>
    );
};