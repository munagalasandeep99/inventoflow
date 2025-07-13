import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const ConfirmSignUpPage: React.FC = () => {
  const { confirmSignUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState(location.state?.email || '');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await confirmSignUp(email, code);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to confirm sign up.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-secondary">Confirm your Account</h1>
        <p className="text-center text-sm text-gray-600">
          A confirmation code has been sent to your email. Please enter it below.
        </p>
        
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">Account confirmed successfully! Redirecting to login...</div>}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
              <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm" placeholder="you@example.com" />
            </div>
            <div>
              <label htmlFor="code" className="text-sm font-medium text-gray-700">Confirmation Code</label>
              <input id="code" type="text" required value={code} onChange={e => setCode(e.target.value)} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm" placeholder="123456" />
            </div>
            <div>
              <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover disabled:opacity-50">
                {isLoading ? 'Confirming...' : 'Confirm Account'}
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

export default ConfirmSignUpPage;
