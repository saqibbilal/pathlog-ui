import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { GuestRoute } from './components/GuestRoute';
import { Layout } from '@/components/Layout';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* GUEST ONLY ROUTES */}
                <Route element={<GuestRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                    {/* Future Register page goes here */}
                </Route>

                {/* AUTH ONLY ROUTES */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/dashboard" element={<DashboardHome />} />
                        <Route path="/jobs" element={<div>Job List</div>} />
                    </Route>
                </Route>

                {/* GLOBAL REDIRECT */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

// Simple temp component for the home view
const DashboardHome = () => (
    <div>
        <h1 className="text-3xl font-bold text-slate-900">Overview</h1>
        <p className="text-slate-500 mt-2">Welcome back to your job tracking command center.</p>
    </div>
);

export default App;