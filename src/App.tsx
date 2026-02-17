import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { GuestRoute } from './components/GuestRoute';
import { Layout } from '@/components/Layout';
import { JobsPage } from './pages/JobsPage'; // Import the page we just built

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* GUEST ONLY ROUTES */}
                <Route element={<GuestRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                </Route>

                {/* AUTH ONLY ROUTES */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                        {/* Use the dedicated components for each route */}
                        <Route path="/dashboard" element={<DashboardHome />} />
                        <Route path="/jobs" element={<JobsPage />} />
                    </Route>
                </Route>

                {/* GLOBAL REDIRECT */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

const DashboardHome = () => (
    <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Overview</h1>
        <p className="text-slate-500 mt-2">Welcome back to your job tracking command center.</p>

        {/* Later, we can add high-level stats here like "Total Applications: 15" */}
    </div>
);

export default App;