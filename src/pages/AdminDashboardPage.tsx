import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  BookOpen, 
  DollarSign, 
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  Sparkles,
  User,
  LogOut
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import AdminClassApproval from '../components/AdminClassApproval';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [activeTab, setActiveTab] = useState('classes');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const tabs = [
    { id: 'classes', name: 'Class Approvals', icon: BookOpen },
    { id: 'hosts', name: 'Host Applications', icon: Users },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'transactions', name: 'Transactions', icon: DollarSign }
  ];

  // Mock admin stats
  const stats = {
    pendingClasses: 5,
    pendingHosts: 3,
    totalRevenue: 2450000, // in kobo
    activeUsers: 1247
  };

  const renderClassesTab = () => (
    <AdminClassApproval 
      adminId={user?.id || 'admin-user-id'}
      onClassApproved={(classId) => {
        console.log('Class approved:', classId);
        // Could trigger a notification or update stats
      }}
      onClassRejected={(classId) => {
        console.log('Class rejected:', classId);
        // Could trigger a notification or update stats
      }}
    />
  );

  const renderHostsTab = () => (
    <div className="text-center py-12">
      <Users className="w-16 h-16 text-warm-gray mx-auto mb-4" />
      <h3 className="text-xl font-bold text-charcoal-black mb-2">Host Applications</h3>
      <p className="text-warm-gray mb-6">
        Host application approval will be implemented in the next phase.
      </p>
      <div className="bg-light-sand rounded-xl p-6 max-w-md mx-auto">
        <h4 className="font-medium text-charcoal-black mb-2">Coming Soon:</h4>
        <ul className="text-sm text-warm-gray space-y-1 text-left">
          <li>• Review host applications</li>
          <li>• Approve/reject potential hosts</li>
          <li>• Send onboarding emails</li>
          <li>• Manage host verification</li>
        </ul>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="text-center py-12">
      <BarChart3 className="w-16 h-16 text-warm-gray mx-auto mb-4" />
      <h3 className="text-xl font-bold text-charcoal-black mb-2">Analytics Dashboard</h3>
      <p className="text-warm-gray">
        Detailed analytics and reporting features will be added in future phases.
      </p>
    </div>
  );

  const renderTransactionsTab = () => (
    <div className="text-center py-12">
      <DollarSign className="w-16 h-16 text-warm-gray mx-auto mb-4" />
      <h3 className="text-xl font-bold text-charcoal-black mb-2">Transaction Management</h3>
      <p className="text-warm-gray">
        Transaction monitoring and management will be implemented with Stripe integration.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-sand via-creamy-white to-golden-yellow/10">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-creamy-white/95 backdrop-blur-sm border-b border-light-sand/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-deep-orange rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-creamy-white font-bold text-lg">K</span>
              </div>
              <span className="text-xl font-bold text-charcoal-black group-hover:text-deep-orange transition-colors">KoboClass</span>
              <span className="bg-brick-red text-creamy-white px-2 py-1 rounded-full text-xs font-bold">ADMIN</span>
            </Link>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Profile Menu */}
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 p-2 text-warm-gray hover:text-deep-orange transition-colors rounded-lg hover:bg-light-sand"
                >
                  <User className="w-6 h-6" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-creamy-white rounded-xl shadow-lg border border-light-sand py-2 z-50">
                    <Link to="/dashboard" className="block px-4 py-2 text-charcoal-black hover:bg-light-sand transition-colors">
                      User Dashboard
                    </Link>
                    <hr className="my-2 border-light-sand" />
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-brick-red hover:bg-light-sand transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-deep-orange" />
            <span className="text-sm font-medium text-warm-gray uppercase tracking-wide">Admin Dashboard</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-charcoal-black mb-2">
            Platform Management
          </h1>
          <p className="text-lg text-warm-gray">
            Review and manage classes, hosts, and platform activity
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-creamy-white rounded-xl p-6 shadow-lg border border-light-sand">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-golden-yellow" />
              <span className="bg-golden-yellow text-charcoal-black px-2 py-1 rounded-full text-xs font-bold">
                {stats.pendingClasses}
              </span>
            </div>
            <div className="text-2xl font-bold text-charcoal-black mb-1">
              {stats.pendingClasses}
            </div>
            <div className="text-sm text-warm-gray">Pending Classes</div>
          </div>

          <div className="bg-creamy-white rounded-xl p-6 shadow-lg border border-light-sand">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-deep-orange" />
              <span className="bg-deep-orange text-creamy-white px-2 py-1 rounded-full text-xs font-bold">
                {stats.pendingHosts}
              </span>
            </div>
            <div className="text-2xl font-bold text-charcoal-black mb-1">
              {stats.pendingHosts}
            </div>
            <div className="text-sm text-warm-gray">Pending Hosts</div>
          </div>

          <div className="bg-creamy-white rounded-xl p-6 shadow-lg border border-light-sand">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-forest-green" />
            </div>
            <div className="text-2xl font-bold text-charcoal-black mb-1">
              ₦{(stats.totalRevenue / 100).toLocaleString()}
            </div>
            <div className="text-sm text-warm-gray">Total Revenue</div>
          </div>

          <div className="bg-creamy-white rounded-xl p-6 shadow-lg border border-light-sand">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-8 h-8 text-warm-purple" />
            </div>
            <div className="text-2xl font-bold text-charcoal-black mb-1">
              {stats.activeUsers.toLocaleString()}
            </div>
            <div className="text-sm text-warm-gray">Active Users</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap",
                    activeTab === tab.id
                      ? "bg-deep-orange text-creamy-white shadow-lg"
                      : "bg-light-sand text-charcoal-black hover:bg-golden-yellow/20 hover:text-deep-orange"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-creamy-white/70 backdrop-blur-sm border border-light-sand/50 rounded-3xl p-8 shadow-2xl">
          {activeTab === 'classes' && renderClassesTab()}
          {activeTab === 'hosts' && renderHostsTab()}
          {activeTab === 'analytics' && renderAnalyticsTab()}
          {activeTab === 'transactions' && renderTransactionsTab()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;