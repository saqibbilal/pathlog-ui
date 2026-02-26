import { ResetPasswordForm } from '../features/auth/components/ResetPasswordForm';

const ResetPasswordPage = () => {
    return (
        <div className="relative min-h-screen flex items-center justify-center bg-workspace px-6 py-12 transition-colors duration-500">
            {/* Background Accents - Matching Login/Forgot Pages */}
            <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] rounded-full bg-brand/10 blur-[120px]" />
                <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-brand/5 blur-[120px]" />
            </div>

            <div className="w-full max-w-md p-10 bg-surface rounded-3xl shadow-2xl border border-surface-border transition-colors duration-500">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-black text-text-main tracking-tighter">
                        New <span className="text-brand">Password</span>
                    </h2>
                    <p className="text-text-main opacity-60 mt-3 font-medium text-lg">
                        Choose a secure password for your journey.
                    </p>
                </div>

                <ResetPasswordForm />
            </div>
        </div>
    );
};

export default ResetPasswordPage;