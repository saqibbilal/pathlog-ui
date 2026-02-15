import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Route for our new Login Page */}
                <Route path="/login" element={<LoginPage />} />

                {/* Temporary Dashboard Route */}
                <Route path="/dashboard" element={<div className="p-10 text-2xl">Welcome to the Dashboard!</div>} />

                {/* Redirect any empty path to /login */}
                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;