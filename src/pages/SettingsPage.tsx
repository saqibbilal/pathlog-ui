import { useState, useRef } from 'react';

const themes = [
    { id: 'default', name: 'Boreal Teal', color: '#0d9488' },
    { id: 'jade', name: 'Jade Forest', color: '#3d9970' },
    { id: 'executive', name: 'Clean Executive', color: '#4f46e5' },
    { id: 'night', name: 'Midnight', color: '#8b5cf6' },
    { id: 'sand', name: 'Desert Sand', color: '#d69a3c' },
];

const presets = [
    { id: 'wood', name: 'Executive Oak', url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1200' },
    { id: 'minimal', name: 'Abstract Calm', url: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=1200' },
    { id: 'structure', name: 'Urban Focus', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200' },
];

export const SettingsPage = () => {
    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('pathlog-theme') || 'default');
    const [wallpaper, setWallpaper] = useState(localStorage.getItem('pathlog-wallpaper') || '');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleThemeChange = (themeId: string) => {
        setCurrentTheme(themeId);
        localStorage.setItem('pathlog-theme', themeId);
        document.documentElement.removeAttribute('data-theme');
        if (themeId !== 'default') {
            document.documentElement.setAttribute('data-theme', themeId);
        }
    };

    const updateWallpaper = (url: string) => {
        // 1. Update local state (for the preview)
        setWallpaper(url);

        // 2. Update storage (for the Layout and persistence)
        localStorage.setItem('pathlog-wallpaper', url);

        // 3. SHOUT to the rest of the app
        console.log("Dispatching wallpaper-updated event..."); // Add this to debug
        window.dispatchEvent(new Event('wallpaper-updated'));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("Please choose an image under 2MB for performance.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                updateWallpaper(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearWallpaper = () => {
        setWallpaper('');
        localStorage.removeItem('pathlog-wallpaper');
        window.dispatchEvent(new Event('wallpaper-updated'));
    };

    return (
        <div className="max-w-4xl">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-text-main tracking-tight">Settings</h1>
                <p className="opacity-60 text-text-main">Customize your workspace and personal preferences.</p>
            </header>

            <section className="space-y-8">
                {/* Theme Selection */}
                <div className="bg-surface p-8 rounded-3xl border border-surface-border shadow-sm transition-colors duration-300">
                    <h2 className="text-xl font-bold text-text-main mb-6">Visual Theme</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                        {themes.map((theme) => (
                            <button
                                key={theme.id}
                                onClick={() => handleThemeChange(theme.id)}
                                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                                    currentTheme === theme.id
                                        ? 'border-brand bg-brand/5 shadow-sm'
                                        : 'border-surface-border hover:border-brand/30 bg-workspace/50'
                                }`}
                            >
                                <div className="w-full h-12 rounded-lg mb-3 shadow-inner" style={{ backgroundColor: theme.color }} />
                                <div className="font-bold text-text-main text-sm">{theme.name}</div>
                                <div className="text-[10px] text-text-main opacity-40 uppercase tracking-widest font-black mt-1">
                                    {currentTheme === theme.id ? 'Active' : 'Select'}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Workspace Wallpaper */}
                <div className="bg-surface p-8 rounded-3xl border border-surface-border shadow-sm transition-colors duration-300">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-text-main mb-1">Workspace Wallpaper</h2>
                            <p className="text-sm text-text-main opacity-60">Set a background image for your dashboard to make it feel like home.</p>
                        </div>
                        {wallpaper && (
                            <button
                                onClick={clearWallpaper}
                                className="text-xs font-bold text-rose-500 uppercase tracking-widest hover:underline"
                            >
                                Clear Current
                            </button>
                        )}
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                    />

                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="relative border-2 border-dashed border-surface-border rounded-2xl p-12 text-center hover:border-brand/50 transition-colors cursor-pointer group bg-workspace/20 overflow-hidden"
                    >
                        {wallpaper && (
                            <img
                                src={wallpaper}
                                className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity"
                                alt="Wallpaper Preview"
                            />
                        )}
                        <div className="relative z-10">
                            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🖼️</div>
                            <p className="text-text-main font-bold">Click to upload or drag and drop</p>
                            <p className="text-xs text-text-main opacity-40 mt-1">Recommended: 1920x1080 or higher (JPG, PNG)</p>
                        </div>
                    </div>

                    {/* Quick Select Presets */}
                    <div className="mt-8">
                        <h3 className="text-[10px] font-bold text-text-main opacity-40 uppercase tracking-widest mb-4">Quick Presets</h3>
                        <div className="flex flex-wrap gap-4">
                            {presets.map((preset) => (
                                <button
                                    key={preset.id}
                                    onClick={() => updateWallpaper(preset.url)}
                                    className={`group relative w-32 h-20 rounded-xl border-2 transition-all overflow-hidden ${
                                        wallpaper === preset.url ? 'border-brand shadow-md' : 'border-surface-border hover:border-brand/50'
                                    }`}
                                >
                                    <img src={preset.url} className="absolute inset-0 w-full h-full object-cover" alt={preset.name} />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-[10px] text-white font-bold uppercase tracking-tight">{preset.name}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};