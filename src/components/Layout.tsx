import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const Layout = () => {
    const [wallpaper, setWallpaper] = useState(localStorage.getItem('pathlog-wallpaper') || '');

    useEffect(() => {
        const handleWallpaperChange = () => {
            console.log("Layout received wallpaper-updated event!"); // Add this to debug
            setWallpaper(localStorage.getItem('pathlog-wallpaper') || '');
        };

        window.addEventListener('wallpaper-updated', handleWallpaperChange);
        return () => window.removeEventListener('wallpaper-updated', handleWallpaperChange);
    }, []);

    return (
        <div className="flex min-h-screen relative overflow-hidden bg-workspace">
            {/* 1. THE WALLPAPER */}
            {wallpaper && (
                <div
                    className="fixed inset-0 pointer-events-none transition-all duration-1000"
                    style={{
                        backgroundImage: `url(${wallpaper})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        zIndex: 0,
                        // We keep a slight brightness drop so white cards still "pop"
                        filter: 'brightness(0.85)',
                    }}
                >
                    {/* 2. THE SHARP OVERLAY */}
                    <div
                        className="absolute inset-0"
                        style={{
                            // A very subtle tint that matches your theme, but NO blur
                            background: `linear-gradient(to bottom, transparent, var(--workspace-bg))`,
                            opacity: 0.4
                        }}
                    />
                </div>
            )}

            {/* 3. THE UI (Top) */}
            <div className="relative z-10 flex w-full">
                <Sidebar />
                <main className="flex-1 ml-64 p-8 min-h-screen">
                    <div className="max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};