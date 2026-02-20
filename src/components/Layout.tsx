import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const Layout = () => {
    const [wallpaper, setWallpaper] = useState(localStorage.getItem('pathlog-wallpaper') || '');

    useEffect(() => {
        const handleWallpaperChange = () => {
            setWallpaper(localStorage.getItem('pathlog-wallpaper') || '');
        };

        // Listen for the custom event we dispatch in SettingsPage
        window.addEventListener('wallpaper-updated', handleWallpaperChange);

        return () => window.removeEventListener('wallpaper-updated', handleWallpaperChange);
    }, []);

    return (
        <div className="flex min-h-screen relative">
            {/* Background Wallpaper Layer */}
            {wallpaper && (
                <div
                    className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-700"
                    style={{
                        backgroundImage: `url(${wallpaper})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 0.4 // Softened so text is readable
                    }}
                >
                    {/* Subtle Blur/Overlay to ensure table readability */}
                    <div className="absolute inset-0 bg-workspace/60 backdrop-blur-[1px]" />
                </div>
            )}

            <Sidebar />

            {/* Main Content: z-10 ensures it stays above the wallpaper */}
            <main className="flex-1 ml-64 p-8 min-h-screen relative z-10">
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};