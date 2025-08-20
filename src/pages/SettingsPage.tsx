import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Lock, 
  CreditCard, 
  BarChart3, 
  LogOut,
  Camera,
  Eye,
  EyeOff,
  Save,
  Instagram,
  Twitter,
  Linkedin,
  Sparkles,
  CheckCircle,
  AlertCircle,
  BookOpen,
  DollarSign,
  Users,
  Star
} from 'lucide-react';
import { cn } from '../lib/utils';
import { validateEmail, validatePhone, validatePassword, validateFullName } from '../lib/validation';
import { useAuth } from '../contexts/AuthContext';
import { submitHostApplication, getHostApplicationStatus } from '../api/hostApplications';

interface ProfileData {
  fullName: string;
  bio: string;
  profileImage: File | null;
  socialLinks: {
    instagram: string;
    twitter: string;
    linkedin: string;
  };
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PayoutData {
  bankName: string;
  accountNumber: string;
  accountName: string;
  routingNumber: string;
}

interface HostApplicationData {
  bio: string;
  socialLinks: {
    instagram: string;
    twitter: string;
    linkedin: string;
  };
}

interface FormErrors {
  [key: string]: string;
}

const SettingsPage = () => {
  const navigate = useNavigate();
  const { userProfile, updateProfile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  
  // Get user role from auth context - default to learner if no profile
  const userRole = userProfile?.role || 'learner';
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [hostApplicationData, setHostApplicationData] = useState<HostApplicationData>({
    bio: '',
    socialLinks: {
      instagram: '',
      twitter: '',
      linkedin: ''
    }
  });
  const [hasAppliedForHost, setHasAppliedForHost] = useState(false);
  const [hostApplicationStatus, setHostApplicationStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);

  // Form data states
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: userProfile?.full_name || '',
    bio: userProfile?.bio || '',
    profileImage: null,
    socialLinks: {
      instagram: '',
      twitter: '',
      linkedin: ''
    }
  });

  // Update form data when userProfile changes
  React.useEffect(() => {
    if (userProfile) {
      setProfileData(prev => ({
        ...prev,
        fullName: userProfile.full_name || '',
        bio: userProfile.bio || '',
      }));
      
      // Check if user has already applied for host status
      checkHostApplicationStatus();
    }
  }, [userProfile]);

  // Check for URL params to show host application
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const showHostApplication = urlParams.get('showHostApplication');
    
    if (showHostApplication === 'true' && !userProfile?.is_host) {
      setActiveTab('host-application');
    }
  }, [userProfile]);

  const checkHostApplicationStatus = async () => {
    if (!userProfile) return;
    
    try {
      const result = await getHostApplicationStatus(userProfile.id);
      
      if (result.success && result.data) {
        setHasAppliedForHost(true);
        setHostApplicationStatus(result.data.status);
      } else {
        setHasAppliedForHost(false);
        setHostApplicationStatus(null);
      }
    } catch (error) {
      console.error('Error checking host application status:', error);
      setHasAppliedForHost(false);
      setHostApplicationStatus(null);
    }
  };

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [payoutData, setPayoutData] = useState<PayoutData>({
    bankName: '',
    accountNumber: '',
    accountName: '',
    routingNumber: ''
  });

  // Filter tabs based on user role
  const allTabs = [
    { id: 'profile', name: 'Profile Info', icon: User },
    { id: 'password', name: 'Password', icon: Lock },
    { id: 'host-application', name: 'Become a Host', icon: BookOpen },
    { id: 'payout', name: 'Payout Setup', icon: CreditCard },
    { id: 'plan', name: 'Plan Details', icon: BarChart3 }
  ];
  
  const tabs = allTabs.filter(tab => {
    if (tab.id === 'payout') {
      return userRole === 'host' && userProfile?.is_approved_host;
    }
    if (tab.id === 'host-application') {
      return !userProfile?.is_host; // Only show if not already a host
    }
    return true;
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileData(prev => ({ ...prev, profileImage: file }));
    }
  };

  const validateProfile = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!validateFullName(profileData.fullName)) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (profileData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters long';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayout = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!payoutData.bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    }
    
    if (!payoutData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (!/^\d{10}$/.test(payoutData.accountNumber)) {
      newErrors.accountNumber = 'Account number must be 10 digits';
    }
    
    if (!payoutData.accountName.trim()) {
      newErrors.accountName = 'Account name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateHostApplication = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!hostApplicationData.bio.trim()) {
      newErrors.hostBio = 'Bio is required to become a host';
    } else if (hostApplicationData.bio.length < 50) {
      newErrors.hostBio = 'Bio must be at least 50 characters long';
    } else if (hostApplicationData.bio.length > 1000) {
      newErrors.hostBio = 'Bio must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    let isValid = false;
    
    switch (activeTab) {
      case 'profile':
        isValid = validateProfile();
        if (isValid) {
          try {
            const { error } = await updateProfile({
              full_name: profileData.fullName,
              bio: profileData.bio,
            });
            
            if (error) {
              setErrors({ general: error.message });
              setIsLoading(false);
              return;
            }
            
            setSuccessMessage('Profile updated successfully!');
          } catch (error) {
            console.error('Profile update error:', error);
            setErrors({ general: 'An unexpected error occurred. Please try again.' });
            setIsLoading(false);
            return;
          }
        }
        break;
      case 'password':
        isValid = validatePassword();
        if (isValid) {
          // Password update would require additional Supabase auth methods
          // For now, just show success message
          setSuccessMessage('Password update not yet implemented!');
        }
        break;
      case 'payout':
        isValid = validatePayout();
        if (isValid) {
          // Payout setup would require additional backend implementation
          setSuccessMessage('Payout setup not yet implemented!');
        }
        break;
      case 'host-application':
        isValid = validateHostApplication();
        if (isValid) {
          try {
            if (!userProfile) {
              setErrors({ general: 'Unable to submit application. Please try again.' });
              setIsLoading(false);
              return;
            }

            const result = await submitHostApplication(userProfile.id, {
              bio: hostApplicationData.bio,
              social_links: hostApplicationData.socialLinks
            });
            
            if (result.success) {
              setSuccessMessage('Host application submitted successfully! We\'ll review it and get back to you soon.');
              setHasAppliedForHost(true);
              setHostApplicationStatus('pending');
            } else {
              setErrors({ general: result.error || 'Failed to submit application. Please try again.' });
              setIsLoading(false);
              return;
            }
          } catch (error) {
            console.error('Host application error:', error);
            setErrors({ general: 'An unexpected error occurred. Please try again.' });
            setIsLoading(false);
            return;
          }
        }
        break;
      default:
        isValid = true;
    }

    // Clear password fields after successful update
    if (activeTab === 'password' && isValid) {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
    
    setIsLoading(false);
  };

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Image */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-charcoal-black">
          Profile Photo
        </label>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-light-sand border-4 border-deep-orange overflow-hidden">
              {profileData.profileImage ? (
                <img 
                  src={URL.createObjectURL(profileData.profileImage)} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-8 h-8 text-warm-gray" />
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="profile-image"
            />
            <label
              htmlFor="profile-image"
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-deep-orange rounded-full flex items-center justify-center cursor-pointer hover:bg-brick-red transition-colors shadow-lg"
            >
              <Camera className="w-4 h-4 text-creamy-white" />
            </label>
          </div>
          <div>
            <p className="text-sm text-charcoal-black font-medium">Upload a new photo</p>
            <p className="text-xs text-warm-gray">JPG, PNG up to 5MB</p>
          </div>
        </div>
      </div>

      {/* Full Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-charcoal-black">
          Full Name *
        </label>
        <input
          type="text"
          value={profileData.fullName}
          onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
          className={cn(
            "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-deep-orange transition-colors",
            errors.fullName ? "border-brick-red" : "border-light-sand"
          )}
          placeholder="Enter your full name"
        />
        {errors.fullName && <p className="text-brick-red text-sm">{errors.fullName}</p>}
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-charcoal-black">
          Bio
        </label>
        <textarea
          value={profileData.bio}
          onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
          rows={4}
          className={cn(
            "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-deep-orange transition-colors resize-none",
            errors.bio ? "border-brick-red" : "border-light-sand"
          )}
          placeholder="Tell others about yourself and your expertise..."
        />
        <div className="flex justify-between items-center">
          {errors.bio && <p className="text-brick-red text-sm">{errors.bio}</p>}
          <p className="text-xs text-warm-gray ml-auto">{profileData.bio.length}/500</p>
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-charcoal-black">
          Social Media Links
        </label>
        
        <div className="space-y-3">
          <div className="relative">
            <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-warm-gray" />
            <input
              type="url"
              value={profileData.socialLinks.instagram}
              onChange={(e) => setProfileData(prev => ({
                ...prev,
                socialLinks: { ...prev.socialLinks, instagram: e.target.value }
              }))}
              className="w-full pl-12 pr-4 py-3 border border-light-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-deep-orange"
              placeholder="Instagram profile URL"
            />
          </div>
          
          <div className="relative">
            <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-warm-gray" />
            <input
              type="url"
              value={profileData.socialLinks.twitter}
              onChange={(e) => setProfileData(prev => ({
                ...prev,
                socialLinks: { ...prev.socialLinks, twitter: e.target.value }
              }))}
              className="w-full pl-12 pr-4 py-3 border border-light-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-deep-orange"
              placeholder="Twitter profile URL"
            />
          </div>
          
          <div className="relative">
            <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-warm-gray" />
            <input
              type="url"
              value={profileData.socialLinks.linkedin}
              onChange={(e) => setProfileData(prev => ({
                ...prev,
                socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
              }))}
              className="w-full pl-12 pr-4 py-3 border border-light-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-deep-orange"
              placeholder="LinkedIn profile URL"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPasswordTab = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-charcoal-black mb-2">Change Password</h3>
        <p className="text-warm-gray">Keep your account secure with a strong password</p>
      </div>

      {/* Current Password */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-charcoal-black">
          Current Password *
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-warm-gray" />
          <input
            type={showPasswords.current ? "text" : "password"}
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
            className={cn(
              "w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-deep-orange transition-colors",
              errors.currentPassword ? "border-brick-red" : "border-light-sand"
            )}
            placeholder="Enter current password"
          />
          <button
            type="button"
            onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {showPasswords.current ? (
              <EyeOff className="w-5 h-5 text-warm-gray hover:text-deep-orange transition-colors" />
            ) : (
              <Eye className="w-5 h-5 text-warm-gray hover:text-deep-orange transition-colors" />
            )}
          </button>
        </div>
        {errors.currentPassword && <p className="text-brick-red text-sm">{errors.currentPassword}</p>}
      </div>

      {/* New Password */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-charcoal-black">
          New Password *
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-warm-gray" />
          <input
            type={showPasswords.new ? "text" : "password"}
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
            className={cn(
              "w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-deep-orange transition-colors",
              errors.newPassword ? "border-brick-red" : "border-light-sand"
            )}
            placeholder="Enter new password"
          />
          <button
            type="button"
            onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {showPasswords.new ? (
              <EyeOff className="w-5 h-5 text-warm-gray hover:text-deep-orange transition-colors" />
            ) : (
              <Eye className="w-5 h-5 text-warm-gray hover:text-deep-orange transition-colors" />
            )}
          </button>
        </div>
        {errors.newPassword && <p className="text-brick-red text-sm">{errors.newPassword}</p>}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-charcoal-black">
          Confirm New Password *
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-warm-gray" />
          <input
            type={showPasswords.confirm ? "text" : "password"}
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            className={cn(
              "w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-deep-orange transition-colors",
              errors.confirmPassword ? "border-brick-red" : "border-light-sand"
            )}
            placeholder="Confirm new password"
          />
          <button
            type="button"
            onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {showPasswords.confirm ? (
              <EyeOff className="w-5 h-5 text-warm-gray hover:text-deep-orange transition-colors" />
            ) : (
              <Eye className="w-5 h-5 text-warm-gray hover:text-deep-orange transition-colors" />
            )}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-brick-red text-sm">{errors.confirmPassword}</p>}
      </div>

      {/* Password Requirements */}
      <div className="bg-light-sand rounded-xl p-4">
        <h4 className="font-medium text-charcoal-black mb-2">Password Requirements:</h4>
        <ul className="text-sm text-warm-gray space-y-1">
          <li>• At least 6 characters long</li>
          <li>• Mix of uppercase and lowercase letters</li>
          <li>• At least one number</li>
          <li>• At least one special character</li>
        </ul>
      </div>
    </div>
  );

  const renderHostApplicationTab = () => {
    if (hasAppliedForHost) {
      return (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-golden-yellow rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="w-10 h-10 text-charcoal-black" />
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-charcoal-black mb-2">
              {hostApplicationStatus === 'pending' && 'Application Under Review'}
              {hostApplicationStatus === 'approved' && 'Application Approved!'}
              {hostApplicationStatus === 'rejected' && 'Application Not Approved'}
            </h3>
            <p className="text-warm-gray">
              {hostApplicationStatus === 'pending' && 'We\'re reviewing your host application. You\'ll hear from us within 2-3 business days.'}
              {hostApplicationStatus === 'approved' && 'Congratulations! You can now start creating and hosting classes.'}
              {hostApplicationStatus === 'rejected' && 'Your application was not approved this time. You can reapply in 30 days.'}
            </p>
          </div>
          
          {hostApplicationStatus === 'approved' && (
            <Link
              to="/host"
              className="inline-flex items-center gap-2 gradient-orange-yellow text-on-gradient px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <BookOpen className="w-5 h-5" />
              Create Your First Class
            </Link>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-charcoal-black mb-2">Become a Host</h3>
          <p className="text-warm-gray">Share your skills and start earning by teaching others</p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-light-sand rounded-xl">
            <DollarSign className="w-8 h-8 text-forest-green mx-auto mb-2" />
            <h4 className="font-semibold text-charcoal-black mb-1">Earn 80%</h4>
            <p className="text-xs text-warm-gray">Keep most of what you earn</p>
          </div>
          <div className="text-center p-4 bg-light-sand rounded-xl">
            <Users className="w-8 h-8 text-deep-orange mx-auto mb-2" />
            <h4 className="font-semibold text-charcoal-black mb-1">Build Community</h4>
            <p className="text-xs text-warm-gray">Connect with learners</p>
          </div>
          <div className="text-center p-4 bg-light-sand rounded-xl">
            <Star className="w-8 h-8 text-golden-yellow mx-auto mb-2" />
            <h4 className="font-semibold text-charcoal-black mb-1">Share Expertise</h4>
            <p className="text-xs text-warm-gray">Teach what you love</p>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-charcoal-black">
            Tell us about yourself *
          </label>
          <textarea
            value={hostApplicationData.bio}
            onChange={(e) => setHostApplicationData(prev => ({ ...prev, bio: e.target.value }))}
            rows={6}
            className={cn(
              "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-deep-orange transition-colors resize-none",
              errors.hostBio ? "border-brick-red" : "border-light-sand"
            )}
            placeholder="Share your experience, skills, and what you'd like to teach. What makes you qualified to host classes? What's your teaching style? (minimum 50 characters)"
          />
          <div className="flex justify-between items-center">
            {errors.hostBio && <p className="text-brick-red text-sm">{errors.hostBio}</p>}
            <p className="text-xs text-warm-gray ml-auto">{hostApplicationData.bio.length}/1000</p>
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-charcoal-black">
            Social Media Links (Optional)
          </label>
          <p className="text-xs text-warm-gray mb-4">
            Help students learn more about you and your work
          </p>
          
          <div className="space-y-3">
            <div className="relative">
              <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-warm-gray" />
              <input
                type="url"
                value={hostApplicationData.socialLinks.instagram}
                onChange={(e) => setHostApplicationData(prev => ({
                  ...prev,
                  socialLinks: { ...prev.socialLinks, instagram: e.target.value }
                }))}
                className="w-full pl-12 pr-4 py-3 border border-light-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-deep-orange"
                placeholder="Instagram profile URL"
              />
            </div>
            
            <div className="relative">
              <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-warm-gray" />
              <input
                type="url"
                value={hostApplicationData.socialLinks.twitter}
                onChange={(e) => setHostApplicationData(prev => ({
                  ...prev,
                  socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                }))}
                className="w-full pl-12 pr-4 py-3 border border-light-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-deep-orange"
                placeholder="Twitter profile URL"
              />
            </div>
            
            <div className="relative">
              <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-warm-gray" />
              <input
                type="url"
                value={hostApplicationData.socialLinks.linkedin}
                onChange={(e) => setHostApplicationData(prev => ({
                  ...prev,
                  socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
                }))}
                className="w-full pl-12 pr-4 py-3 border border-light-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-deep-orange"
                placeholder="LinkedIn profile URL"
              />
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-light-sand rounded-xl p-4">
          <h4 className="font-medium text-charcoal-black mb-2">Host Requirements:</h4>
          <ul className="text-sm text-warm-gray space-y-1">
            <li>• Must have expertise in your chosen field</li>
            <li>• Able to teach engaging, interactive classes</li>
            <li>• Reliable internet connection for live streaming</li>
            <li>• Professional communication skills</li>
            <li>• Commitment to student success</li>
          </ul>
        </div>
      </div>
    );
  };

  const renderPayoutTab = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-charcoal-black mb-2">Payout Setup</h3>
        <p className="text-warm-gray">Add your bank details to receive earnings from your classes</p>
      </div>

      {/* Bank Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-charcoal-black">
          Bank Name *
        </label>
        <select
          value={payoutData.bankName}
          onChange={(e) => setPayoutData(prev => ({ ...prev, bankName: e.target.value }))}
          className={cn(
            "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-deep-orange transition-colors",
            errors.bankName ? "border-brick-red" : "border-light-sand"
          )}
        >
          <option value="">Select your bank</option>
          <option value="Access Bank">Access Bank</option>
          <option value="GTBank">Guaranty Trust Bank</option>
          <option value="First Bank">First Bank of Nigeria</option>
          <option value="UBA">United Bank for Africa</option>
          <option value="Zenith Bank">Zenith Bank</option>
          <option value="Fidelity Bank">Fidelity Bank</option>
          <option value="FCMB">First City Monument Bank</option>
          <option value="Sterling Bank">Sterling Bank</option>
          <option value="Union Bank">Union Bank</option>
          <option value="Wema Bank">Wema Bank</option>
        </select>
        {errors.bankName && <p className="text-brick-red text-sm">{errors.bankName}</p>}
      </div>

      {/* Account Number */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-charcoal-black">
          Account Number *
        </label>
        <input
          type="text"
          value={payoutData.accountNumber}
          onChange={(e) => setPayoutData(prev => ({ ...prev, accountNumber: e.target.value.replace(/\D/g, '') }))}
          maxLength={10}
          className={cn(
            "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-deep-orange transition-colors",
            errors.accountNumber ? "border-brick-red" : "border-light-sand"
          )}
          placeholder="Enter 10-digit account number"
        />
        {errors.accountNumber && <p className="text-brick-red text-sm">{errors.accountNumber}</p>}
      </div>

      {/* Account Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-charcoal-black">
          Account Name *
        </label>
        <input
          type="text"
          value={payoutData.accountName}
          onChange={(e) => setPayoutData(prev => ({ ...prev, accountName: e.target.value }))}
          className={cn(
            "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-deep-orange transition-colors",
            errors.accountName ? "border-brick-red" : "border-light-sand"
          )}
          placeholder="Account holder name"
        />
        {errors.accountName && <p className="text-brick-red text-sm">{errors.accountName}</p>}
      </div>

      {/* Security Notice */}
      <div className="bg-forest-green/10 border border-forest-green/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-forest-green mt-0.5" />
          <div>
            <h4 className="font-medium text-forest-green mb-1">Secure & Encrypted</h4>
            <p className="text-sm text-charcoal-black">
              Your banking information is encrypted and securely stored. We never store your full account details.
            </p>
          </div>
        </div>
      </div>

      {/* Payout Schedule */}
      <div className="bg-light-sand rounded-xl p-4">
        <h4 className="font-medium text-charcoal-black mb-2">Payout Schedule:</h4>
        <ul className="text-sm text-warm-gray space-y-1">
          <li>• Payouts are processed weekly on Fridays</li>
          <li>• Minimum payout amount: ₦5,000</li>
          <li>• Processing time: 1-3 business days</li>
          <li>• You keep 80% of class fees</li>
        </ul>
      </div>
    </div>
  );

  const renderPlanTab = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-charcoal-black mb-2">
          {userRole === 'host' ? 'Plan Details' : 'Learning Progress'}
        </h3>
        <p className="text-warm-gray">
          {userRole === 'host' 
            ? 'View your earnings and commission history' 
            : 'Track your learning journey and completed classes'
          }
        </p>
      </div>

      {userRole === 'host' ? (
        <>
          {/* Earnings Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-forest-green/10 border border-forest-green/30 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-forest-green mb-2">₦45,600</div>
              <div className="text-sm text-charcoal-black">Total Earnings</div>
            </div>
            <div className="bg-deep-orange/10 border border-deep-orange/30 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-deep-orange mb-2">₦8,400</div>
              <div className="text-sm text-charcoal-black">This Month</div>
            </div>
            <div className="bg-golden-yellow/10 border border-golden-yellow/30 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-golden-yellow mb-2">23</div>
              <div className="text-sm text-charcoal-black">Classes Taught</div>
            </div>
          </div>

          {/* Commission History */}
          <div className="bg-creamy-white border border-light-sand rounded-xl p-6">
            <h4 className="font-semibold text-charcoal-black mb-4">Recent Transactions</h4>
            <div className="space-y-4">
              {[
                { class: 'Master Professional Makeup Artistry', date: 'Dec 15, 2024', amount: '₦2,000', status: 'Paid' },
                { class: 'Photography for Social Media', date: 'Dec 12, 2024', amount: '₦1,600', status: 'Paid' },
                { class: 'UI/UX Design Fundamentals', date: 'Dec 10, 2024', amount: '₦4,000', status: 'Pending' },
                { class: 'Build Your First Website', date: 'Dec 8, 2024', amount: '₦2,800', status: 'Paid' }
              ].map((transaction, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-light-sand last:border-b-0">
                  <div>
                    <div className="font-medium text-charcoal-black">{transaction.class}</div>
                    <div className="text-sm text-warm-gray">{transaction.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-charcoal-black">{transaction.amount}</div>
                    <div className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      transaction.status === 'Paid' 
                        ? "bg-forest-green/20 text-forest-green" 
                        : "bg-golden-yellow/20 text-golden-yellow"
                    )}>
                      {transaction.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Commission Structure */}
          <div className="bg-light-sand rounded-xl p-6">
            <h4 className="font-medium text-charcoal-black mb-4">Commission Structure</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-charcoal-black">Your Share</span>
                <span className="font-semibold text-forest-green">80%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-charcoal-black">Platform Fee</span>
                <span className="font-semibold text-warm-gray">20%</span>
              </div>
              <hr className="border-warm-gray/30" />
              <div className="text-sm text-warm-gray">
                Platform fee covers payment processing, hosting, customer support, and platform maintenance.
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Learning Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-deep-orange/10 border border-deep-orange/30 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-deep-orange mb-2">12</div>
              <div className="text-sm text-charcoal-black">Classes Completed</div>
            </div>
            <div className="bg-golden-yellow/10 border border-golden-yellow/30 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-golden-yellow mb-2">28</div>
              <div className="text-sm text-charcoal-black">Hours Learned</div>
            </div>
            <div className="bg-forest-green/10 border border-forest-green/30 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-forest-green mb-2">5</div>
              <div className="text-sm text-charcoal-black">Skills Acquired</div>
            </div>
          </div>

          {/* Recent Classes */}
          <div className="bg-creamy-white border border-light-sand rounded-xl p-6">
            <h4 className="font-semibold text-charcoal-black mb-4">Recent Classes</h4>
            <div className="space-y-4">
              {[
                { class: 'Master Professional Makeup Artistry', date: 'Dec 15, 2024', host: 'Chioma Okeke', rating: 5 },
                { class: 'Build Your First Website', date: 'Dec 12, 2024', host: 'Ibrahim Sule', rating: 4 },
                { class: 'Photography for Social Media', date: 'Dec 10, 2024', host: 'Kemi Adeyemi', rating: 5 },
                { class: 'Music Production Basics', date: 'Dec 8, 2024', host: 'Tunde Bakare', rating: 4 }
              ].map((classItem, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-light-sand last:border-b-0">
                  <div>
                    <div className="font-medium text-charcoal-black">{classItem.class}</div>
                    <div className="text-sm text-warm-gray">with {classItem.host} • {classItem.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={cn(
                          "text-sm",
                          i < classItem.rating ? "text-golden-yellow" : "text-light-sand"
                        )}>
                          ⭐
                        </span>
                      ))}
                    </div>
                    <div className="text-xs bg-forest-green/20 text-forest-green px-2 py-1 rounded-full mt-1">
                      Completed
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Goals */}
          <div className="bg-light-sand rounded-xl p-6">
            <h4 className="font-medium text-charcoal-black mb-4">Learning Journey</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-charcoal-black">Classes This Month</span>
                <span className="font-semibold text-deep-orange">4 classes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-charcoal-black">Favorite Category</span>
                <span className="font-semibold text-golden-yellow">Creative Arts</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-charcoal-black">Next Goal</span>
                <span className="font-semibold text-forest-green">15 Classes</span>
              </div>
              <hr className="border-warm-gray/30" />
              <div className="text-sm text-warm-gray">
                Keep learning to unlock new skills and connect with amazing creators!
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-sand via-creamy-white to-golden-yellow/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-warm-purple/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-deep-orange/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-golden-yellow/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link 
              to="/dashboard"
              className="flex items-center gap-2 text-charcoal-black hover:text-deep-orange transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">Back to Dashboard</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-deep-orange" />
              <span className="text-sm font-medium text-warm-gray">Account Settings</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-creamy-white/70 backdrop-blur-sm border border-light-sand/50 rounded-3xl p-6 shadow-2xl">
                <h2 className="text-xl font-bold text-charcoal-black mb-6">Settings</h2>
                
                {/* Role Toggle for Demo - Remove in production */}
                {userProfile && (
                  <div className="mb-6 p-4 bg-light-sand rounded-xl">
                    <p className="text-sm font-medium text-charcoal-black mb-2">Current Role</p>
                    <div className="flex items-center gap-2">
                      <span className="bg-deep-orange text-creamy-white px-3 py-1 rounded-lg text-xs font-medium capitalize">
                        {userProfile.role}
                      </span>
                      {userProfile.role !== 'learner' && (
                        <span className={cn(
                          "px-3 py-1 rounded-lg text-xs font-medium",
                          userProfile.is_host_approved 
                            ? "bg-forest-green text-creamy-white" 
                            : "bg-golden-yellow text-charcoal-black"
                        )}>
                          {userProfile.is_host_approved ? 'Approved' : 'Pending Approval'}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setErrors({});
                          setSuccessMessage('');
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300",
                          activeTab === tab.id
                            ? "bg-deep-orange text-creamy-white shadow-lg"
                            : "text-charcoal-black hover:bg-light-sand hover:text-deep-orange"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.name}</span>
                      </button>
                    );
                  })}
                  
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 text-brick-red hover:bg-brick-red/10 mt-6 border-t border-light-sand pt-6"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-creamy-white/70 backdrop-blur-sm border border-light-sand/50 rounded-3xl p-8 shadow-2xl">
                {/* Success Message */}
                {successMessage && (
                  <div className="mb-6 bg-forest-green/10 border border-forest-green/30 rounded-lg p-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-forest-green" />
                    <span className="text-forest-green font-medium">{successMessage}</span>
                  </div>
                )}

                {/* General Error */}
                {errors.general && (
                  <div className="mb-6 bg-brick-red/10 border border-brick-red/30 rounded-lg p-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-brick-red" />
                    <span className="text-brick-red font-medium">{errors.general}</span>
                  </div>
                )}

                {/* Tab Content */}
                {activeTab === 'profile' && renderProfileTab()}
                {activeTab === 'password' && renderPasswordTab()}
                {activeTab === 'host-application' && renderHostApplicationTab()}
                {activeTab === 'payout' && userRole === 'host' && renderPayoutTab()}
                {activeTab === 'plan' && renderPlanTab()}

                {/* Save Button */}
                {activeTab !== 'plan' && (activeTab !== 'host-application' || !hasAppliedForHost) && (
                  <div className="mt-8 pt-6 border-t border-light-sand">
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="gradient-orange-yellow text-on-gradient px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-creamy-white/30 border-t-creamy-white rounded-full animate-spin"></div>
                          {activeTab === 'host-application' ? 'Submitting Application...' : 'Saving...'}
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          {activeTab === 'host-application' ? 'Submit Host Application' : 'Save Changes'}
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;