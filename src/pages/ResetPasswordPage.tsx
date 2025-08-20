import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Lock, ArrowRight, Sparkles, ArrowLeft, CheckCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { validatePassword } from '../lib/validation';
import { supabase } from '../lib/supabase';

interface FormData {
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState<FormData>({
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirm: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Check for access token and refresh token in URL
  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    
    if (!accessToken || !refreshToken) {
      setErrors({ general: 'Invalid reset link. Please request a new password reset.' });
    }
  }, [searchParams]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password
      });
      
      if (error) {
        setErrors({ general: error.message });
        return;
      }

      setIsSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Reset password error:', error);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light-sand via-creamy-white to-golden-yellow/20 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-32 h-32 bg-warm-purple/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-deep-orange/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-golden-yellow/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <Link to="/" className="flex items-center justify-center space-x-2 mb-6 group">
              <div className="w-10 h-10 bg-deep-orange rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-creamy-white font-bold text-xl">K</span>
              </div>
              <span className="text-2xl font-bold text-charcoal-black group-hover:text-deep-orange transition-colors">KoboClass</span>
            </Link>
          </div>

          <div className="bg-creamy-white/70 backdrop-blur-sm border border-light-sand/50 rounded-3xl p-8 shadow-2xl text-center">
            <div className="w-16 h-16 bg-forest-green rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-creamy-white" />
            </div>
            
            <h1 className="text-2xl font-bold text-charcoal-black mb-4">
              Password Reset Successful!
            </h1>
            
            <p className="text-warm-gray mb-6">
              Your password has been updated successfully. You can now login with your new password.
            </p>

            <p className="text-sm text-warm-gray mb-6">
              Redirecting to login page in a few seconds...
            </p>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 gradient-orange-yellow text-on-gradient px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Go to Login
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-sand via-creamy-white to-golden-yellow/20 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-warm-purple/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-deep-orange/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-golden-yellow/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Back to Home Button */}
      <Link 
        to="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-charcoal-black hover:text-deep-orange transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
        <span className="font-medium">Back to Home</span>
      </Link>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-6 group">
            <div className="w-10 h-10 bg-deep-orange rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span className="text-creamy-white font-bold text-xl">K</span>
            </div>
            <span className="text-2xl font-bold text-charcoal-black group-hover:text-deep-orange transition-colors">KoboClass</span>
          </Link>
          
          <div className="inline-flex items-center gap-2 bg-creamy-white/80 backdrop-blur-sm border border-light-sand rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-deep-orange" />
            <span className="text-sm font-medium text-warm-gray">Reset Password</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-charcoal-black mb-2">
            Set New Password
          </h1>
          <p className="text-warm-gray text-lg">
            Enter your new password below
          </p>
        </div>

        {/* Reset Form */}
        <div className="bg-creamy-white/70 backdrop-blur-sm border border-light-sand/50 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error */}
            {errors.general && (
              <div className="bg-brick-red/10 border border-brick-red/30 rounded-lg p-3 text-brick-red text-sm">
                {errors.general}
              </div>
            )}

            {/* New Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-charcoal-black">
                New Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-warm-gray" />
                </div>
                <input
                  id="password"
                  type={showPasswords.password ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={cn(
                    "block w-full pl-10 pr-12 py-3 border rounded-xl shadow-sm placeholder-warm-gray focus:outline-none focus:ring-2 focus:ring-deep-orange focus:border-deep-orange transition-colors",
                    errors.password 
                      ? "border-brick-red bg-brick-red/5" 
                      : "border-light-sand bg-creamy-white hover:border-deep-orange/50"
                  )}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPasswords(prev => ({ ...prev, password: !prev.password }))}
                >
                  {showPasswords.password ? (
                    <EyeOff className="h-5 w-5 text-warm-gray hover:text-deep-orange transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-warm-gray hover:text-deep-orange transition-colors" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-brick-red text-sm">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-charcoal-black">
                Confirm New Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-warm-gray" />
                </div>
                <input
                  id="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={cn(
                    "block w-full pl-10 pr-12 py-3 border rounded-xl shadow-sm placeholder-warm-gray focus:outline-none focus:ring-2 focus:ring-deep-orange focus:border-deep-orange transition-colors",
                    errors.confirmPassword 
                      ? "border-brick-red bg-brick-red/5" 
                      : "border-light-sand bg-creamy-white hover:border-deep-orange/50"
                  )}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-5 w-5 text-warm-gray hover:text-deep-orange transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-warm-gray hover:text-deep-orange transition-colors" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-brick-red text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-light-sand rounded-xl p-4">
              <h4 className="font-medium text-charcoal-black mb-2">Password Requirements:</h4>
              <ul className="text-sm text-warm-gray space-y-1">
                <li>• At least 6 characters long</li>
                <li>• Mix of uppercase and lowercase letters recommended</li>
                <li>• Include numbers and special characters for better security</li>
              </ul>
            </div>

            {/* Update Password Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full gradient-orange-yellow text-on-gradient py-3 px-6 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-deep-orange/25 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-creamy-white/30 border-t-creamy-white rounded-full animate-spin"></div>
                  Updating Password...
                </>
              ) : (
                <>
                  Update Password
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Navigation Links */}
          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="text-deep-orange hover:text-brick-red font-medium transition-colors hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;