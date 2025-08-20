import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  User, 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Eye, 
  Edit3, 
  MoreVertical,
  Star,
  Clock,
  MapPin,
  Sparkles,
  BarChart3,
  Settings,
  Bell,
  Search,
  Filter
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import NotificationSystem from '../components/NotificationSystem';
import StatisticsCard8 from '../components/ui/statistics-card-8';
import { getHostClasses } from '../api/classes';

interface HostedClass {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  studentsEnrolled: number;
  maxStudents: number;
  status: 'upcoming' | 'live' | 'completed' | 'draft';
  rating?: number;
  totalEarnings?: number;
  coverImage?: string;
}

const HostDashboardPage = () => {
  const navigate = useNavigate();
  const { signOut, user, userProfile } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hostedClasses, setHostedClasses] = useState<HostedClass[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  // Load host classes
  React.useEffect(() => {
    const loadHostClasses = async () => {
      if (!user) return;
      
      setIsLoadingClasses(true);
      try {
        const result = await getHostClasses(user.id);
        
        if (result.success && result.data) {
          // Transform the data to match our interface
          const transformedClasses: HostedClass[] = result.data.map((classItem: any) => ({
            id: classItem.id,
            title: classItem.title,
            description: classItem.description,
            category: classItem.categories?.name || 'Uncategorized',
            date: classItem.date_time.split('T')[0],
            time: new Date(classItem.date_time).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            }),
            duration: classItem.duration_minutes,
            price: classItem.price / 100, // Convert from kobo to naira
            studentsEnrolled: 0, // TODO: Get actual enrollment count
            maxStudents: classItem.max_students || 50,
            status: getClassStatus(classItem),
            rating: 4.8, // TODO: Calculate actual rating
            totalEarnings: 0, // TODO: Calculate actual earnings
            coverImage: classItem.cover_image_url
          }));
          
          setHostedClasses(transformedClasses);
        }
      } catch (error) {
        console.error('Error loading host classes:', error);
      } finally {
        setIsLoadingClasses(false);
      }
    };

    loadHostClasses();
  }, [user]);

  const getClassStatus = (classItem: any): HostedClass['status'] => {
    const now = new Date();
    const classDateTime = new Date(classItem.date_time);
    
    if (classItem.status === 'draft') return 'draft';
    if (classItem.status === 'pending_approval') return 'draft'; // Show as draft until approved
    if (classItem.status === 'rejected') return 'draft'; // Show as draft if rejected
    
    // For approved classes, determine if upcoming, live, or completed
    if (classItem.status === 'approved') {
      const timeDiff = classDateTime.getTime() - now.getTime();
      const minutesDiff = timeDiff / (1000 * 60);
      
      if (minutesDiff > classItem.duration_minutes) {
        return 'upcoming';
      } else if (minutesDiff > 0 && minutesDiff <= classItem.duration_minutes) {
        return 'live';
      } else {
        return 'completed';
      }
    }
    
    return 'draft';
  };

  // Mock stats
  const stats = {
    totalEarnings: 141200,
    thisMonth: 51200,
    totalStudents: 77,
    averageRating: 4.85,
    totalClasses: 12,
    upcomingClasses: 3
  };

  const filterOptions = [
    { value: 'all', label: 'All Classes' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'live', label: 'Live' },
    { value: 'completed', label: 'Completed' },
    { value: 'draft', label: 'Drafts' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-deep-orange text-creamy-white';
      case 'live': return 'bg-brick-red text-creamy-white animate-pulse';
      case 'completed': return 'bg-forest-green text-creamy-white';
      case 'draft': return 'bg-warm-gray text-creamy-white';
      default: return 'bg-light-sand text-charcoal-black';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Upcoming';
      case 'live': return '🔴 Live';
      case 'completed': return 'Completed';
      case 'draft': return 'Draft';
      default: return status;
    }
  };

  const filteredClasses = hostedClasses.filter(classItem => {
    const matchesFilter = selectedFilter === 'all' || classItem.status === selectedFilter;
    const matchesSearch = classItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         classItem.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleClassAction = (classId: string, action: string) => {
    switch (action) {
      case 'view':
        navigate(`/class/${classId}`);
        break;
      case 'edit':
        navigate(`/host/edit/${classId}`);
        break;
      case 'start':
        navigate(`/class/${classId}/live`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-sand via-creamy-white to-golden-yellow/10">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-creamy-white/95 backdrop-blur-sm border-b border-light-sand/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-7 h-7 bg-deep-orange rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-creamy-white font-bold text-sm">K</span>
              </div>
              <span className="text-lg font-bold text-charcoal-black group-hover:text-deep-orange transition-colors">KoboClass</span>
            </Link>

            {/* Right Side */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <NotificationSystem />

              {/* Profile Menu */}
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 p-1.5 text-warm-gray hover:text-deep-orange transition-colors rounded-lg hover:bg-light-sand"
                >
                  <User className="w-5 h-5" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-1 w-44 bg-creamy-white rounded-lg shadow-lg border border-light-sand py-1 z-50">
                    <Link to="/settings" className="block px-3 py-2 text-sm text-charcoal-black hover:bg-light-sand transition-colors">
                      Settings
                    </Link>
                    <Link to="/dashboard" className="block px-3 py-2 text-sm text-charcoal-black hover:bg-light-sand transition-colors">
                      Learner Dashboard
                    </Link>
                    <hr className="my-1 border-light-sand" />
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-sm text-brick-red hover:bg-light-sand transition-colors"
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-deep-orange" />
            <span className="text-xs font-medium text-warm-gray uppercase tracking-wide">Host Dashboard</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-charcoal-black mb-1">
                Welcome back!
              </h1>
              <p className="text-base text-warm-gray">
                Manage your classes and grow your teaching business
              </p>
            </div>
            
            {/* Create Class Button */}
            <Link
              to="/host"
              className="flex items-center gap-2 gradient-orange-yellow text-on-gradient px-4 py-2.5 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 group"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              <span className="hidden sm:inline">Create New Class</span>
              <span className="sm:hidden">Create</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <StatisticsCard8 className="mb-6" />

        {/* Filters and Search */}
        <div className="mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h2 className="text-xl font-bold text-charcoal-black">Your Classes</h2>
            
            <div className="flex gap-3 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:w-56">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-warm-gray" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search classes..."
                  className="w-full pl-9 pr-3 py-2 border border-light-sand rounded-lg focus:outline-none focus:ring-1 focus:ring-deep-orange focus:border-deep-orange text-sm"
                />
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedFilter(option.value)}
                className={cn(
                  "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap",
                  selectedFilter === option.value
                    ? "bg-deep-orange text-creamy-white"
                    : "bg-light-sand text-charcoal-black hover:bg-golden-yellow/20 hover:text-deep-orange"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Classes Grid */}
        {isLoadingClasses ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-deep-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-warm-gray">Loading your classes...</p>
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-light-sand rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-warm-gray" />
            </div>
            <h3 className="text-lg font-semibold text-charcoal-black mb-2">
              {hostedClasses.length === 0 ? 'No classes yet' : 'No classes found'}
            </h3>
            <p className="text-warm-gray mb-6">
              {hostedClasses.length === 0 
                ? 'Start sharing your expertise by creating your first class'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
            {hostedClasses.length === 0 && (
              <Link
                to="/host"
                className="inline-flex items-center gap-2 gradient-orange-yellow text-on-gradient px-4 py-2.5 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                Create Your First Class
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredClasses.map((classItem) => (
              <div
                key={classItem.id}
                className="bg-creamy-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden group cursor-pointer border border-light-sand/50"
              >
                {/* Card Header */}
                <div className="relative p-4">
                  <div className="absolute top-3 right-3 flex gap-1.5">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      getStatusColor(classItem.status),
                      classItem.status === 'draft' && classItem.id ? 'bg-golden-yellow text-charcoal-black' : ''
                    )}>
                      {classItem.status === 'draft' && classItem.id ? 'Pending Review' : getStatusText(classItem.status)}
                    </span>
                    
                    <div className="relative">
                      <button className="w-8 h-8 rounded-full bg-light-sand hover:bg-golden-yellow/20 flex items-center justify-center transition-colors">
                        <MoreVertical className="w-3 h-3 text-warm-gray" />
                      </button>
                    </div>
                  </div>

                  {/* Class Info */}
                  <div className="mb-3">
                    <span className="text-xs text-deep-orange font-medium uppercase tracking-wide">{classItem.category}</span>
                    <h3 className="text-base font-bold text-charcoal-black mb-1 group-hover:text-deep-orange transition-colors line-clamp-2">
                      {classItem.title}
                    </h3>
                    <p className="text-warm-gray text-xs mb-3 line-clamp-2">
                      {classItem.description}
                    </p>
                  </div>

                  {/* Meta Info */}
                  <div className="space-y-1 text-xs text-warm-gray mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(classItem.date).toLocaleDateString()}</span>
                      <Clock className="w-3 h-3 ml-2" />
                      <span>{classItem.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3 h-3" />
                      <span>{classItem.studentsEnrolled}/{classItem.maxStudents} students</span>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-deep-orange">₦{classItem.price.toLocaleString()}</span>
                      {classItem.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-golden-yellow fill-current" />
                          <span className="text-xs font-medium">{classItem.rating}</span>
                        </div>
                      )}
                    </div>
                    {classItem.totalEarnings && (
                      <div className="text-right">
                        <p className="text-xs text-warm-gray">Earned</p>
                        <p className="text-sm font-semibold text-forest-green">₦{classItem.totalEarnings.toLocaleString()}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-1.5">
                    {classItem.status === 'live' && (
                      <button
                        onClick={() => handleClassAction(classItem.id, 'start')}
                        className="flex-1 bg-forest-green text-creamy-white py-2 px-3 rounded-lg text-xs font-medium hover:bg-forest-green/90 transition-colors"
                      >
                        Join Live Class
                      </button>
                    )}
                    {classItem.status === 'upcoming' && (
                      <button
                        onClick={() => handleClassAction(classItem.id, 'start')}
                        className="flex-1 bg-deep-orange text-creamy-white py-2 px-3 rounded-lg text-xs font-medium hover:bg-brick-red transition-colors"
                      >
                        Start Class
                      </button>
                    )}
                    {classItem.status === 'draft' && (
                      <button
                        onClick={() => handleClassAction(classItem.id, 'edit')}
                        className="flex-1 bg-deep-orange text-creamy-white py-2 px-3 rounded-lg text-xs font-medium hover:bg-brick-red transition-colors"
                      >
                        {classItem.id ? 'Under Review' : 'Continue Setup'}
                      </button>
                    )}
                    <button
                      onClick={() => handleClassAction(classItem.id, 'view')}
                      className="flex items-center justify-center gap-1 bg-light-sand text-charcoal-black py-2 px-3 rounded-lg hover:bg-golden-yellow/20 transition-colors text-xs font-medium"
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </button>
                    <button
                      onClick={() => handleClassAction(classItem.id, 'edit')}
                      className="flex items-center justify-center gap-1 bg-light-sand text-charcoal-black py-2 px-3 rounded-lg hover:bg-golden-yellow/20 transition-colors text-xs font-medium"
                    >
                      <Edit3 className="w-3 h-3" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Create Button (Mobile) */}
      <Link
        to="/host"
        className="fixed bottom-4 right-4 md:hidden bg-gradient-to-r from-deep-orange to-golden-yellow text-creamy-white p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-50 group"
      >
        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
      </Link>
    </div>
  );
};

export default HostDashboardPage;