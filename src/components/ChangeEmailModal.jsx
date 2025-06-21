import React, { useState } from 'react';
import authService from '../services/authService';

const ChangeEmailModal = ({ isOpen, onClose, onEmailChanged }) => {
  const [step, setStep] = useState(1); // 1: Enter email/password, 2: Enter OTP
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInitiateChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authService.changeEmail({ newEmail, password });
      if (response.success) {
        setSuccess('An OTP has been sent to your new email address.');
        setStep(2);
      } else {
        setError(response.message || 'Failed to initiate email change.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authService.verifyOtp({ email: newEmail, otp });
      if (response.success) {
        setSuccess('Email changed successfully!');
        setTimeout(() => {
          onEmailChanged(newEmail);
          handleClose();
        }, 1500);
      } else {
        setError(response.message || 'Invalid OTP.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during OTP verification.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleClose = () => {
    // Reset state before closing
    setStep(1);
    setNewEmail('');
    setPassword('');
    setOtp('');
    setError('');
    setSuccess('');
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        {step === 1 ? (
          <form onSubmit={handleInitiateChange}>
            <h2 className="text-2xl font-bold mb-4">Change Email Address</h2>
            <p className="mb-6 text-gray-600">Enter your new email and current password to begin.</p>
            {error && <div className="p-3 mb-4 text-red-700 bg-red-100 rounded">{error}</div>}
            {success && <div className="p-3 mb-4 text-green-700 bg-green-100 rounded">{success}</div>}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="newEmail">New Email Address</label>
              <input
                type="email"
                id="newEmail"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="password">Current Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="flex justify-end gap-4">
              <button type="button" onClick={handleClose} disabled={loading} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                {loading ? 'Sending...' : 'Continue'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <h2 className="text-2xl font-bold mb-4">Verify Your New Email</h2>
            <p className="mb-6 text-gray-600">An OTP was sent to <strong>{newEmail}</strong>. Please enter it below.</p>
            {error && <div className="p-3 mb-4 text-red-700 bg-red-100 rounded">{error}</div>}
            {success && <div className="p-3 mb-4 text-green-700 bg-green-100 rounded">{success}</div>}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="otp">Verification Code (OTP)</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="flex justify-end gap-4">
               <button type="button" onClick={handleClose} disabled={loading} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                {loading ? 'Verifying...' : 'Verify & Change Email'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangeEmailModal; 