
import { ThemeSelector } from '@/features/settings/components/ThemeSelector';
import { WallpaperUploader } from '@/features/settings/components/WallpaperUploader';
import { useGetSettings, useUpdateSettings, useUploadWallpaper } from '@/features/settings/hooks/useSettings';

export const SettingsPage = () => {
    const { data: settingsData, isLoading } = useGetSettings();
    const updateSettingsMutation = useUpdateSettings();
    const uploadWallpaperMutation = useUploadWallpaper();

    const settings = settingsData;

    const handleUpdateTheme = (themeId: string) => {
        updateSettingsMutation.mutate({ theme: themeId });
        // Optimistically apply the theme immediately for snappy UI
        localStorage.setItem('pathlog-theme', themeId);
        document.documentElement.removeAttribute('data-theme');
        if (themeId !== 'default') {
            document.documentElement.setAttribute('data-theme', themeId);
        }
    };

    const handleUploadWallpaper = (file: File) => {
        uploadWallpaperMutation.mutate(file);
    };

    const handleClearWallpaper = () => {
        updateSettingsMutation.mutate({ wallpaper: null } as any);
    };

    if (isLoading && !settings) {
        return (
            <div className="max-w-4xl flex items-center justify-center p-20">
                <div className="animate-pulse text-brand font-bold tracking-widest uppercase">Loading Settings...</div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl pb-20">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-text-main tracking-tight">Settings</h1>
                <p className="opacity-60 text-text-main">Customize your workspace and personal preferences.</p>
            </header>

            <section className="space-y-8">
                <ThemeSelector
                    currentTheme={settings?.theme || localStorage.getItem('pathlog-theme') || 'default'}
                    onUpdateTheme={handleUpdateTheme}
                    isLoading={updateSettingsMutation.isPending}
                />

                <WallpaperUploader
                    wallpaperUrl={settings?.wallpaper_url || ''}
                    onUploadWallpaper={handleUploadWallpaper}
                    onClearWallpaper={handleClearWallpaper}
                    isUploading={uploadWallpaperMutation.isPending}
                />
            </section>
        </div>
    );
};