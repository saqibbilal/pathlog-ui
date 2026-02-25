import { ForgotPasswordForm } from '../features/auth/components/ForgotPasswordForm';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Reset your password
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Enter your email address and we'll send you a link to get back into your account.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <ForgotPasswordForm />

                    <div className="mt-6 text-center">
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Remember your password? Log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;