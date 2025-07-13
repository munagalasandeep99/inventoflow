import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const ResetPasswordPage: React.FC = () => {
    const { confirmPassword } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email] = useState(location.state?.email || '');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError("Email not found. Please start the forgot password process again.");
            return;
        }
        if (newPassword !== repeatPassword) {
            setError("New passwords do not match.");
            return;
        }
        setError(null);
        setIsLoading(true);
        try {
            await confirmPassword(email, code, newPassword);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-center text-secondary">Set New Password</h1>
                
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
                {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">Password reset successfully! Redirecting to login...</div>}

                {!success && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="code" className="text-sm font-medium text-gray-700">Verification Code</label>
                            <input id="code" type="text" required value={code} onChange={e => setCode(e.target.value)} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm" placeholder="123456" />
                        </div>
                        <div>
                            <label htmlFor="new-password" className="text-sm font-medium text-gray-700">New Password</label>
                            <input id="new-password" type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm" placeholder="••••••••" />
                        </div>
                        <div>
                            <label htmlFor="repeat-password" className="text-sm font-medium text-gray-700">Repeat New Password</label>
                            <input id="repeat-password" type="password" required value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm" placeholder="••••••••" />
                        </div>
                        <div>
                            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover disabled:opacity-50">
                                {isLoading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </div>
                    </form>
                )}
                
                 <p className="text-center text-sm text-gray-600">
                    Go back to <Link to="/login" className="font-medium text-primary hover:text-primary-hover">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
