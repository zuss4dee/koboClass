import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Phone, Lock, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { validateEmail, validatePhone } from '../lib/validation';
import { useAuth } from '../contexts/AuthContext';

interface FormData {
  emailOrPhone: string;
  password: string;
}

interface FormErrors {
  emailOrPhone?: string;
  password?: string;
  general?: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    emailOrPhone: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = 'Email or phone number is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      // Ensure we're using email for login (not phone for now)
      const isEmail = formData.emailOrPhone.includes('@');
      if (!isEmail) {
        setErrors({ general: 'Please use your email address to login. Phone number login is not yet supported.' });
        return;
      }

      const { data, error } = await signIn(formData.emailOrPhone, formData.password);
      
      if (error) {
        console.error('Login failed:', error);
        if (error.message?.includes('Invalid login credentials')) {
          setErrors({ general: 'Invalid email or password. Please check your credentials and try again.' });
        } else if (error.message?.includes('Email not confirmed')) {
          setErrors({ general: 'Please check your email and click the confirmation link before logging in.' });
        } else {
          setErrors({ general: error.message || 'Failed to login. Please check your credentials.' });
        }
        return;
      }

      console.log('Login successful, redirecting...');
      
      // Check if user was trying to access host page
      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get('redirect');
      
      // Decode the redirect path if it exists
      if (redirectTo) {
        if (redirectTo === 'host') {
          navigate('/dashboard?showHostApplication=true');
        } else {
          const decodedPath = decodeURIComponent(redirectTo);
          navigate(decodedPath);
        }
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

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
            <span className="text-sm font-medium text-warm-gray">Welcome Back</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-charcoal-black mb-2">
            Login to Your Account
          </h1>
          <p className="text-warm-gray text-lg">
            Continue your learning journey
          </p>
        </div>

        {/* Login Form */}
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
                Email or Phone Number
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
                  onChange={(e) => handleInputChange('emailOrPhone', e.target.value)}
                  className={cn(
                    "block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm placeholder-warm-gray focus:outline-none focus:ring-2 focus:ring-deep-orange focus:border-deep-orange transition-colors",
                    errors.emailOrPhone 
                      ? "border-brick-red bg-brick-red/5" 
                      : "border-light-sand bg-creamy-white hover:border-deep-orange/50"
                  )}
                  placeholder="Enter email or phone number"
                />
              </div>
              {errors.emailOrPhone && (
                <p className="text-brick-red text-sm">{errors.emailOrPhone}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-charcoal-black">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-warm-gray" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={cn(
                    "block w-full pl-10 pr-12 py-3 border rounded-xl shadow-sm placeholder-warm-gray focus:outline-none focus:ring-2 focus:ring-deep-orange focus:border-deep-orange transition-colors",
                    errors.password 
                      ? "border-brick-red bg-brick-red/5" 
                      : "border-light-sand bg-creamy-white hover:border-deep-orange/50"
                  )}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
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

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full gradient-orange-yellow text-on-gradient py-3 px-6 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-deep-orange/25 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-creamy-white/30 border-t-creamy-white rounded-full animate-spin"></div>
                  Logging in...
                </>
              ) : (
                <>
                  Login
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-warm-gray">
              New here?{' '}
              <Link
                to={`/signup${window.location.search}`}
                className="text-deep-orange hover:text-brick-red font-semibold transition-colors hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-warm-gray">
          <div className="flex justify-center space-x-4">
            <Link 
              to="/forgot-password"
              className="hover:text-deep-orange transition-colors"
            >
              Forgot Password?
            </Link>
            <span>•</span>
            <button className="hover:text-deep-orange transition-colors">Need Help?</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;