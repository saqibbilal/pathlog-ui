import { LoginForm } from '@/features/auth/components/LoginForm';

const LoginPage = () => {
    return (
        <div className="relative min-h-screen flex items-center justify-center bg-slate-50 px-6 py-12">
            {/* Soft Background Accents */}
            <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] rounded-full bg-blue-100/40 blur-[120px]" />
                <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-indigo-100/40 blur-[120px]" />
            </div>

            <LoginForm />
        </div>
    );
};

export default LoginPage;