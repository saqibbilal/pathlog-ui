import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '@/features/settings/api/settingsApi';
import type { UserSettings } from '@/features/settings/types/settingsTypes';

export const useGetSettings = () => {
    return useQuery({
        queryKey: ['settings'],
        queryFn: settingsApi.getSettings,
    });
};

export const useUpdateSettings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (settings: Partial<UserSettings> | any) => settingsApi.updateSettings(settings),
        onSuccess: (data) => {
            queryClient.setQueryData(['settings'], data);
        },
    });
};

export const useUploadWallpaper = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (file: File) => settingsApi.uploadWallpaper(file),
        onSuccess: (data) => {
            queryClient.setQueryData(['settings'], data);
        },
    });
};
