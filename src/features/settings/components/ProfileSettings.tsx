import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { useUpdateSettings } from '@/features/settings/hooks/useSettings';
import type { UserSettings } from '@/features/settings/types/settingsTypes';
import { useToastStore } from '@/store/useToastStore';
import { useAuthStore } from '@/store/useAuthStore';
import { FormSection } from '@/features/settings/components/FormSection';

interface ProfileSettingsProps {
    settings: UserSettings;
    isLoading: boolean;
}

export const ProfileSettings = ({ settings, isLoading }: ProfileSettingsProps) => {
    const updateSettingsMutation = useUpdateSettings();
    const showToast = useToastStore((state) => state.showToast);
    const updateUser = useAuthStore((state) => state.updateUser);

    const [name, setName] = useState(settings?.name || '');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    useEffect(() => {
        if (settings?.name) {
            setName(settings.name);
        }
    }, [settings?.name]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // We type assert here to allow password fields which are sent but not part of UserSettings state
        const payload: any = {};

        if (name && name !== settings.name) {
            payload.name = name;
        }

        if (password) {
            if (password !== passwordConfirmation) {
                showToast('Passwords do not match', 'error');
                return;
            }
            if (password.length < 8) {
                showToast('Password must be at least 8 characters', 'error');
                return;
            }
            payload.password = password;
            payload.password_confirmation = passwordConfirmation;
        }

        if (Object.keys(payload).length === 0) {
            return; // Nothing to update
        }

        updateSettingsMutation.mutate(payload, {
            onSuccess: () => {
                showToast('Profile updated successfully', 'success');
                if (payload.name) {
                    updateUser({ name: payload.name });
                }
                setPassword('');
                setPasswordConfirmation('');
            },
        });
    };

    return (
        <div className="bg-surface p-8 rounded-3xl border border-surface-border shadow-sm transition-colors duration-300">
            <div className="mb-8">
                <h2 className="text-xl font-bold text-text-main mb-2">Profile Details</h2>
                <p className="opacity-60 text-sm">Update your personal information and security settings.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                <FormSection hasTopBorder={false}>
                    <div className="max-w-md">
                        <Input
                            label="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isLoading || updateSettingsMutation.isPending}
                            placeholder="John Doe"
                        />
                    </div>
                </FormSection>

                <FormSection
                    title="Change Password"
                    description="Leave blank if you don't want to change it."
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            type="password"
                            label="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading || updateSettingsMutation.isPending}
                            placeholder="••••••••"
                        />

                        <Input
                            type="password"
                            label="Confirm New Password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            disabled={isLoading || updateSettingsMutation.isPending}
                            placeholder="••••••••"
                        />
                    </div>
                </FormSection>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading || updateSettingsMutation.isPending || Boolean(!name && !password) || Boolean(password && password !== passwordConfirmation)}
                        className="bg-brand text-bg-main px-6 py-2.5 rounded-lg font-medium transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center min-w-[120px]"
                    >
                        {updateSettingsMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};
