import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useGetSettings } from '@/features/settings/hooks/useSettings';

export const Layout = () => {
    const { data: settings } = useGetSettings();
    const wallpaper = settings?.wallpaper_url || '';

    // Apply theme globally across the authenticated app
    useEffect(() => {
        if (settings?.theme) {
            localStorage.setItem('pathlog-theme', settings.theme);
            document.documentElement.removeAttribute('data-theme');
            if (settings.theme !== 'default') {
                document.documentElement.setAttribute('data-theme', settings.theme);
            }
        }
    }, [settings?.theme]);

    return (
        <div className="flex min-h-screen relative overflow-hidden bg-workspace">
            {/* 1. THE WALLPAPER */}
            {wallpaper && (
                <div
                    className="fixed inset-0 pointer-events-none transition-all duration-1000"
                    style={{
                        backgroundImage: `url("${wallpaper}")`,
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