import api from '@/api/axios';
import type { UserSettings } from '@/features/settings/types/settingsTypes';

export const settingsApi = {
    getSettings: async (): Promise<UserSettings> => {
        const response = await api.get('/settings');
        return response.data.data;
    },

    updateSettings: async (settings: Partial<UserSettings>): Promise<UserSettings> => {
        const response = await api.put('/settings', settings);
        return response.data.data;
    },

    uploadWallpaper: async (file: File): Promise<UserSettings> => {
        const formData = new FormData();
        formData.append('wallpaper', file);

        const response = await api.post('/settings/wallpaper', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    }
};
