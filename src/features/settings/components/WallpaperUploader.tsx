import { useRef } from 'react';

interface WallpaperUploaderProps {
    wallpaperUrl?: string;
    onUploadWallpaper: (file: File) => void;
    onClearWallpaper: () => void;
    isUploading?: boolean;
}

const presets = [
    { id: 'wood', name: 'Executive Oak', url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1200' },
    { id: 'minimal', name: 'Abstract Calm', url: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=1200' },
    { id: 'structure', name: 'Urban Focus', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200' },
];

export const WallpaperUploader = ({ wallpaperUrl, onUploadWallpaper, onClearWallpaper, isUploading }: WallpaperUploaderProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("Please choose an image under 2MB for performance.");
                return;
            }
            onUploadWallpaper(file);
        }
        // Reset the input value so the same file can be selected again
        if (e.target) {
            e.target.value = '';
        }
    };

    const handlePresetSelect = async (url: string) => {
        // Typically, we'd either need to download the blob and upload it like a file,
        // or just have the backend accept URLs. We'll simulate fetching it for now as a file
        // Or if the backend doesn't support downloading URLs yet, we can skip and just update state locally.
        // For simplicity, let's just log a message or handle it if we have URL saving capability later.
        // However, user just needs to know standard functionality.
        // Wait, current setup saves URL literally to local storage. 
        // We will need to update the backend to take a string `wallpaper_url` or similar if we want presets to work perfectly,
        // or we convert the preset image to a File here. Let's convert it to a File to use the same upload endpoint!
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const file = new File([blob], 'preset.jpg', { type: blob.type });
            onUploadWallpaper(file);
        } catch (error) {
            console.error('Failed to download preset', error);
        }
    };

    return (
        <div className="bg-surface p-8 rounded-3xl border border-surface-border shadow-sm transition-colors duration-300">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-xl font-bold text-text-main mb-1">Workspace Wallpaper</h2>
                    <p className="text-sm text-text-main opacity-60">Set a background image for your dashboard to make it feel like home.</p>
                </div>
                {wallpaperUrl && (
                    <button
                        onClick={onClearWallpaper}
                        disabled={isUploading}
                        className="text-xs font-bold text-rose-500 uppercase tracking-widest hover:underline disabled:opacity-50"
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
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`relative border-2 border-dashed border-surface-border rounded-2xl p-12 text-center hover:border-brand/50 transition-colors group bg-workspace/20 overflow-hidden ${isUploading ? 'cursor-wait opacity-50' : 'cursor-pointer'}`}
            >
                {wallpaperUrl && (
                    <img
                        src={wallpaperUrl}
                        className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity"
                        alt="Wallpaper Preview"
                    />
                )}
                <div className="relative z-10">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                        {isUploading ? '⏳' : '🖼️'}
                    </div>
                    <p className="text-text-main font-bold">
                        {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                    </p>
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
                            onClick={() => handlePresetSelect(preset.url)}
                            disabled={isUploading}
                            className={`group relative w-32 h-20 rounded-xl border-2 transition-all overflow-hidden ${wallpaperUrl === preset.url ? 'border-brand shadow-md' : 'border-surface-border hover:border-brand/50'
                                } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
    );
};
