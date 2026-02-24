import { RegisterForm } from '@/features/auth/components/RegisterForm';

const RegisterPage = () => {
    return (
        <div className="min-h-screen bg-workspace flex flex-col justify-center items-center p-4 relative overflow-hidden transition-colors duration-500">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Registration Form */}
            <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <RegisterForm />
            </div>

            {/* Footer / Copyright */}
            <div className="absolute bottom-8 text-text-main opacity-30 text-sm font-medium">
                © {new Date().getFullYear()} PathLog. All rights reserved.
            </div>
        </div>
    );
};

export default RegisterPage;
