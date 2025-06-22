import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import authService from '../services/authService';

const ForgotPassword2 = () => {
  const navigate = useNavigate();
  const { step } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');

  // Load email from localStorage on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('forgotPasswordEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  // Step 1: Email Form
  const emailFormik = useFormik({
    initialValues: {
      email: email || ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required')
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      setSuccess('');

      try {
        console.log('Calling authService.initiateForgotPassword2 with email:', values.email);
        const response = await authService.initiateForgotPassword2(values.email);
        console.log('API Response:', response);
        
        if (response.success) {
          setEmail(values.email);
          localStorage.setItem('forgotPasswordEmail', values.email);
          setSuccess('If the email address exists in our system, you will receive an OTP shortly.');
          setTimeout(() => {
            navigate('/forgot-password2/verify');
          }, 2000);
        } else {
          setError(response.message || 'Failed to initiate password reset.');
        }
      } catch (err) {
        console.error('Error in email submission:', err);
        setError(err.response?.data?.message || 'An error occurred.');
      } finally {
        setLoading(false);
      }
    }
  });

  // Step 2: OTP Form
  const otpFormik = useFormik({
    initialValues: {
      otp: ''
    },
    validationSchema: Yup.object({
      otp: Yup.string()
        .required('OTP is required')
        .length(6, 'OTP must be 6 digits')
        .matches(/^\d+$/, 'OTP must contain only numbers')
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      setSuccess('');

      try {
        const response = await authService.verifyForgotPassword2Otp(email, values.otp);
        if (response.success) {
          setResetToken(response.resetToken);
          localStorage.setItem('forgotPasswordResetToken', response.resetToken);
          setSuccess('OTP verified successfully. You can now set your new password.');
          setTimeout(() => {
            navigate('/forgot-password2/reset');
          }, 2000);
        } else {
          setError(response.message || 'Invalid OTP.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred during OTP verification.');
      } finally {
        setLoading(false);
      }
    }
  });

  // Step 3: Password Reset Form
  const passwordFormik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .required('New password is required')
        .min(6, 'Password must be at least 6 characters'),
      confirmPassword: Yup.string()
        .required('Please confirm your password')
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      setSuccess('');

      try {
        const savedResetToken = localStorage.getItem('forgotPasswordResetToken');
        const response = await authService.completeForgotPassword2(
          email, 
          savedResetToken, 
          values.newPassword, 
          values.confirmPassword
        );
        
        if (response.success) {
          setSuccess('Password has been reset successfully! You will be redirected to login.');
          // Clear localStorage
          localStorage.removeItem('forgotPasswordEmail');
          localStorage.removeItem('forgotPasswordResetToken');
          
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          setError(response.message || 'Failed to reset password.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred during password reset.');
      } finally {
        setLoading(false);
      }
    }
  });

  const handleBackToLogin = () => {
    // Clear localStorage
    localStorage.removeItem('forgotPasswordEmail');
    localStorage.removeItem('forgotPasswordResetToken');
    navigate('/login');
  };

  const handleBack = () => {
    if (step === 'verify') {
      navigate('/forgot-password2');
    } else if (step === 'reset') {
      navigate('/forgot-password2/verify');
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authService.initiateForgotPassword2(email);
      if (response.success) {
        setSuccess('OTP has been resent to your email.');
      } else {
        setError(response.message || 'Failed to resend OTP.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while resending OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Progress indicator
  const getProgressStep = () => {
    if (!step) return 1;
    if (step === 'verify') return 2;
    if (step === 'reset') return 3;
    return 1;
  };

  const currentStep = getProgressStep();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Forgot Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Reset your password in 3 simple steps
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-4">
          <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
              1
            </div>
            <span className="ml-2 text-sm font-medium">Email</span>
          </div>
          <div className={`w-8 h-0.5 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 2 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
              2
            </div>
            <span className="ml-2 text-sm font-medium">OTP</span>
          </div>
          <div className={`w-8 h-0.5 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 3 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
              3
            </div>
            <span className="ml-2 text-sm font-medium">Password</span>
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {/* Step 1: Email Input */}
        {!step && (
          <form onSubmit={emailFormik.handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                onChange={emailFormik.handleChange}
                onBlur={emailFormik.handleBlur}
                value={emailFormik.values.email}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  emailFormik.touched.email && emailFormik.errors.email 
                    ? 'border-red-300' 
                    : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Enter your email address"
              />
              {emailFormik.touched.email && emailFormik.errors.email && (
                <p className="mt-2 text-sm text-red-600">{emailFormik.errors.email}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Back to Login
              </button>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#5F6FFF] hover:opacity-[0.8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'verify' && (
          <form onSubmit={otpFormik.handleSubmit} className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md bg-gray-50 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Verification Code (OTP)
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                autoComplete="one-time-code"
                required
                maxLength="6"
                onChange={otpFormik.handleChange}
                onBlur={otpFormik.handleBlur}
                value={otpFormik.values.otp}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  otpFormik.touched.otp && otpFormik.errors.otp 
                    ? 'border-red-300' 
                    : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Enter 6-digit code"
              />
              {otpFormik.touched.otp && otpFormik.errors.otp && (
                <p className="mt-2 text-sm text-red-600">{otpFormik.errors.otp}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#5F6FFF] hover:opacity-[0.8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="text-sm text-blue-600 hover:text-blue-500 disabled:opacity-50"
              >
                Didn't receive the code? Resend
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Password Reset */}
        {step === 'reset' && (
          <form onSubmit={passwordFormik.handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                required
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                value={passwordFormik.values.newPassword}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  passwordFormik.touched.newPassword && passwordFormik.errors.newPassword 
                    ? 'border-red-300' 
                    : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Enter new password"
              />
              {passwordFormik.touched.newPassword && passwordFormik.errors.newPassword && (
                <p className="mt-2 text-sm text-red-600">{passwordFormik.errors.newPassword}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                value={passwordFormik.values.confirmPassword}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword 
                    ? 'border-red-300' 
                    : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Confirm new password"
              />
              {passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">{passwordFormik.errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#5F6FFF] hover:opacity-[0.8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword2; 