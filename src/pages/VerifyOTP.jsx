import { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

export default function VerifyOTP() {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { state } = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authService.verifyOtp({
                email: state.email,
                otp: otp,
            });

            if (response.success) {
                // For registration, automatically log in
                const loginResponse = await authService.login({
                    email: state.email,
                    password: state.password,
                    rememberMe: false
                }); if (loginResponse.accessToken) {
                    login(loginResponse, loginResponse.accessToken);
                    navigate('/profile');
                }
            } else {
                setError(response.message || 'Verification failed');
            }
        } catch (err) {
            console.error('Verification error:', err);
            setError(err.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    // Redirect if no email in state
    if (!state?.email) {
        return <Navigate to="/" />;
    }

    return (
        <div className="min-h-[80vh] flex items-center">
            <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border border-gray-200 rounded-lg text-zinc-600 text-sm shadow-lg">
                <div className="w-1 h-8 bg-[#5F6FFF] rounded mb-2"></div>
                <h1 className="text-2xl font-semibold">Verify Email</h1>
                <p className="text-gray-600 mb-4">
                    Please enter the verification code sent to your email.
                </p>

                {error && (
                    <div className="w-full p-3 text-red-700 bg-red-100 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="w-full">
                    <div className="w-full mb-4">
                        <p>Verification Code</p>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="border border-zinc-300 rounded w-full p-2 mt-1 outline-0"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#5F6FFF] text-white px-8 py-3 rounded-md font-light w-full cursor-pointer text-medium hover:opacity-[0.8] disabled:opacity-50"
                    >
                        {loading ? 'Verifying...' : 'Verify'}
                    </button>
                </form>
            </div>
        </div>
    );
}