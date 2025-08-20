import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, BarChart3, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

export default function Header() {
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      setShowProfileMenu(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-creamy-white/95 backdrop-blur-sm border-b border-light-sand/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-deep-orange rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
              <span className="text-creamy-white font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-bold text-charcoal-black group-hover:text-deep-orange transition-colors">KoboClass</span>
          </Link>

          {/* Center Navigation - Desktop Only */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-charcoal-black hover:text-deep-orange transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              to="/creators" 
              className="text-charcoal-black hover:text-deep-orange transition-colors font-medium"
            >
              Creators
            </Link>
            <Link 
              to="/features" 
              className="text-charcoal-black hover:text-deep-orange transition-colors font-medium"
            >
              Features
            </Link>
            {user && (
              <Link 
                to="/dashboard" 
                className="text-charcoal-black hover:text-deep-orange transition-colors font-medium"
              >
                Dashboard
              </Link>
            )}
            {user && userProfile && ['host', 'both'].includes(userProfile.role) && userProfile.is_approved_host && (
              <Link 
                to="/host" 
                className="text-charcoal-black hover:text-deep-orange transition-colors font-medium"
              >
                Host
              </Link>
            )}
          </nav>

          {/* Right Side - Auth Section */}
          <div className="flex items-center">
            {user ? (
              // Authenticated User Menu
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 bg-light-sand/60 backdrop-blur-sm border border-light-sand rounded-full px-3 py-2 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                >
                  <div className="w-7 h-7 bg-deep-orange rounded-full flex items-center justify-center">
                    {userProfile?.avatar_url ? (
                      <img 
                        src={userProfile.avatar_url} 
                        alt={userProfile.full_name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-creamy-white" />
                    )}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-semibold text-charcoal-black truncate max-w-24">
                      {userProfile?.full_name || 'User'}
                    </div>
                    <div className="text-xs text-warm-gray capitalize">
                      {userProfile?.role || 'learner'}
                    </div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowProfileMenu(false)}
                    />
                    
                    {/* Menu */}
                    <div className="absolute right-0 top-12 w-52 bg-creamy-white border border-light-sand rounded-xl shadow-xl z-50 overflow-hidden">
                      {/* User Info Header */}
                      <div className="p-3 bg-light-sand border-b border-light-sand">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-deep-orange rounded-full flex items-center justify-center">
                            {userProfile?.avatar_url ? (
                              <img 
                                src={userProfile.avatar_url} 
                                alt={userProfile.full_name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <User className="w-4 h-4 text-creamy-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-charcoal-black truncate">
                              {userProfile?.full_name || 'User'}
                            </div>
                            <div className="text-xs text-warm-gray truncate">
                              {user.email}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-xs bg-deep-orange text-creamy-white px-2 py-0.5 rounded-full capitalize">
                                {userProfile?.role || 'learner'}
                              </span>
                              {userProfile?.role !== 'learner' && (
                                <span className={cn(
                                  "text-xs px-2 py-0.5 rounded-full",
                                  userProfile?.is_approved_host 
                                    ? "bg-forest-green text-creamy-white" 
                                    : "bg-golden-yellow text-charcoal-black"
                                )}>
                                  {userProfile?.is_approved_host ? 'Approved' : 'Pending'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <Link 
                          to="/dashboard" 
                          className="flex items-center gap-2 px-3 py-2 text-charcoal-black hover:bg-light-sand transition-colors text-sm"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <BarChart3 className="w-4 h-4 text-deep-orange" />
                          <span>Dashboard</span>
                        </Link>
                        
                        {userProfile && ['host', 'both'].includes(userProfile.role) && (
                          <Link 
                            to="/host-dashboard" 
                            className="flex items-center gap-2 px-3 py-2 text-charcoal-black hover:bg-light-sand transition-colors text-sm"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <BookOpen className="w-4 h-4 text-deep-orange" />
                            <span>Host Dashboard</span>
                          </Link>
                        )}
                        
                        <Link 
                          to="/settings" 
                          className="flex items-center gap-2 px-3 py-2 text-charcoal-black hover:bg-light-sand transition-colors text-sm"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <Settings className="w-4 h-4 text-deep-orange" />
                          <span>Settings</span>
                        </Link>
                        
                        <hr className="my-1 border-light-sand" />
                        
                        <button 
                          onClick={handleLogout}
                          className="flex items-center gap-2 px-3 py-2 text-brick-red hover:bg-brick-red/10 transition-colors w-full text-left text-sm"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              // Unauthenticated User Buttons
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="bg-light-sand/60 backdrop-blur-sm border border-light-sand text-charcoal-black px-4 py-2 rounded-full font-medium hover:bg-light-sand hover:text-deep-orange transition-all duration-300 hover:scale-105 shadow-sm text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="gradient-orange-yellow text-on-gradient px-4 py-2 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-sm text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}