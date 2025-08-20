import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, ArrowRight, Sparkles, ArrowLeft, CheckCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { validateEmail, validatePhone } from '../lib/validation';
import { useAuth } from '../contexts/AuthContext';

interface FormData {
  emailOrPhone: string;
}

interface FormErrors {
  emailOrPhone?: string;
  general?: string;
}

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    emailOrPhone: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = 'Email or phone number is required';
    } else {
      const isEmail = formData.emailOrPhone.includes('@');
      if (isEmail && !validateEmail(formData.emailOrPhone)) {
        newErrors.emailOrPhone = 'Please enter a valid email address';
      } else if (!isEmail && !validatePhone(formData.emailOrPhone)) {
        newErrors.emailOrPhone = 'Please enter a valid Nigerian phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (value: string) => {
    setFormData({ emailOrPhone: value });
    if (errors.emailOrPhone) {
      setErrors(prev => ({ ...prev, emailOrPhone: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const isEmail = formData.emailOrPhone.includes('@');
      
      if (!isEmail) {
        setErrors({ 
          general: 'Password reset is only available for email addresses. Please use your email instead.' 
        });
        return;
      }

      const { error } = await resetPassword(formData.emailOrPhone);
      
      if (error) {
        setErrors({ general: error.message });
        return;
      }

      setIsSuccess(true);
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

        {/* Back to Home Button */}
        <Link 
          to="/"
          className="absolute top-6 left-6 z-20 flex items-center gap-2 text-charcoal-black hover:text-deep-orange transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">Back to Home</span>
        </Link>

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
              Check Your Email
            </h1>
            
            <p className="text-warm-gray mb-6">
              We've sent a password reset link to <strong>{formData.emailOrPhone}</strong>. 
              Click the link in the email to reset your password.
            </p>

            <div className="space-y-4">
              <Link 
                to="/login"
                className="w-full gradient-orange-yellow text-on-gradient py-3 px-6 rounded-xl font-semibold hover:shadow-2xl hover:shadow-deep-orange/25 hover:scale-105 transition-all duration-300 inline-block"
              >
                Back to Login
              </Link>
              
              <button 
                onClick={() => {
                  setIsSuccess(false);
                  setFormData({ emailOrPhone: '' });
                }}
                className="w-full text-deep-orange hover:text-brick-red font-medium transition-colors"
              >
                Try Different Email
              </button>
            </div>
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
            Forgot Your Password?
          </h1>
          <p className="text-warm-gray text-lg">
            No worries! Enter your email and we'll send you a reset link
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

            {/* Email or Phone Field */}
            <div className="space-y-2">
              <label htmlFor="emailOrPhone" className="block text-sm font-medium text-charcoal-black">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {formData.emailOrPhone.includes('@') ? (
                    <Mail className="h-5 w-5 text-warm-gray" />
                  ) : (
                    <Phone className="h-5 w-5 text-warm-gray" />
                  )}
                </div>
                <input
                  id="emailOrPhone"
                  type="text"
                  value={formData.emailOrPhone}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className={cn(
                    "block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm placeholder-warm-gray focus:outline-none focus:ring-2 focus:ring-deep-orange focus:border-deep-orange transition-colors",
                    errors.emailOrPhone 
                      ? "border-brick-red bg-brick-red/5" 
                      : "border-light-sand bg-creamy-white hover:border-deep-orange/50"
                  )}
                  placeholder="Enter your email address"
                />
              </div>
              {errors.emailOrPhone && (
                <p className="text-brick-red text-sm">{errors.emailOrPhone}</p>
              )}
              <p className="text-xs text-warm-gray">
                We'll send a password reset link to this email address
              </p>
            </div>

            {/* Send Reset Link Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full gradient-orange-yellow text-on-gradient py-3 px-6 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-deep-orange/25 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-creamy-white/30 border-t-creamy-white rounded-full animate-spin"></div>
                  Sending Reset Link...
                </>
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Navigation Links */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-warm-gray">
              Remember your password?{' '}
              <Link 
                to="/login" 
                className="text-deep-orange hover:text-brick-red font-semibold transition-colors hover:underline"
              >
                Back to Login
              </Link>
            </p>
            <p className="text-warm-gray">
              New here?{' '}
              <Link 
                to="/signup" 
                className="text-deep-orange hover:text-brick-red font-semibold transition-colors hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;