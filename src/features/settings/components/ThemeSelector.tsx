interface ThemeSelectorProps {
    currentTheme: string;
    onUpdateTheme: (themeId: string) => void;
    isLoading?: boolean;
}

const themes = [
    { id: 'default', name: 'Boreal Teal', color: '#0d9488' },
    { id: 'jade', name: 'Jade Forest', color: '#3d9970' },
    { id: 'executive', name: 'Clean Executive', color: '#4f46e5' },
    { id: 'night', name: 'Midnight', color: '#8b5cf6' },
    { id: 'sand', name: 'Desert Sand', color: '#d69a3c' },
];

export const ThemeSelector = ({ currentTheme, onUpdateTheme, isLoading }: ThemeSelectorProps) => {
    return (
        <div className="bg-surface p-8 rounded-3xl border border-surface-border shadow-sm transition-colors duration-300">
            <h2 className="text-xl font-bold text-text-main mb-6">Visual Theme</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                {themes.map((theme) => (
                    <button
                        key={theme.id}
                        onClick={() => onUpdateTheme(theme.id)}
                        disabled={isLoading}
                        className={`p-4 rounded-2xl border-2 text-left transition-all ${currentTheme === theme.id
                                ? 'border-brand bg-brand/5 shadow-sm'
                                : 'border-surface-border hover:border-brand/30 bg-workspace/50'
                            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
    );
};
