import React, { useState } from 'react';
import { User, Plus, Filter, TrendingUp, Clock, Sparkles, Star, Users, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import NotificationSystem from '../components/NotificationSystem';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

interface DashboardPageProps {}

const DashboardPage: React.FC<DashboardPageProps> = () => {
interface ClassCard {
  id: string;
  hostImage: string;
  hostName: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  price: string;
  rating: number;
  studentsCount: number;
  isLive?: boolean;
  isTrending?: boolean;
}

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Trending');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { userProfile, signOut } = useAuth();
  const navigate = useNavigate();

  // Check for error messages in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const showHostApplication = urlParams.get('showHostApplication');
    
    if (error === 'host-approval-pending') {
      // Show notification that host approval is pending
      console.log('Host approval is pending');
    }
    
    if (showHostApplication === 'true') {
      // Redirect to settings with host application tab
      navigate('/settings?tab=host-application');
    }
  }, []);

  const categories = ['All', 'Design', 'Tech', 'Business', 'Career', 'Creative', 'Music', 'Fashion'];
  const sortOptions = ['Trending', 'Starting Soon', 'Newest', 'Price: Low to High'];

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  const mockClasses: ClassCard[] = [
    {
      id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      hostImage: 'https://images.pexels.com/photos/3184334/pexels-photo-3184334.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      hostName: 'Chioma Okeke',
      title: 'Master Professional Makeup Artistry',
      description: 'Learn advanced makeup techniques from a certified professional makeup artist with 8+ years experience.',
      category: 'Creative',
      date: 'Today',
      time: '7:00 PM',
      price: '₦2,500',
      rating: 4.9,
      studentsCount: 45,
      isLive: true,
      isTrending: true
    },
    {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      hostImage: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      hostName: 'Ibrahim Sule',
      title: 'Build Your First Website in 2 Hours',
      description: 'Complete beginner-friendly web development class. No coding experience required!',
      category: 'Tech',
      date: 'Tomorrow',
      time: '6:00 PM',
      price: '₦3,500',
      rating: 4.8,
      studentsCount: 78,
      isTrending: true
    },
    {
      id: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
      hostImage: 'https://images.pexels.com/photos/3184301/pexels-photo-3184301.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      hostName: 'Tunde Bakare',
      title: 'Music Production Masterclass',
      description: 'Create professional beats and learn mixing techniques using free software.',
      category: 'Music',
      date: 'Dec 20',
      time: '8:00 PM',
      price: '₦4,000',
      rating: 4.7,
      studentsCount: 32
    },
    {
      id: 'c3d4e5f6-g7h8-9012-cdef-345678901234',
      hostImage: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      hostName: 'Fatima Hassan',
      title: 'Start Your Online Business Today',
      description: 'Step-by-step guide to launching a profitable online business with minimal capital.',
      category: 'Business',
      date: 'Dec 22',
      time: '5:00 PM',
      price: '₦1,500',
      rating: 4.6,
      studentsCount: 67
    },
    {
      id: 'd4e5f6g7-h8i9-0123-defg-456789012345',
      hostImage: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      hostName: 'Kemi Adeyemi',
      title: 'Photography for Social Media',
      description: 'Take stunning photos with just your phone and grow your Instagram following.',
      category: 'Creative',
      date: 'Dec 25',
      time: '4:00 PM',
      price: '₦2,000',
      rating: 4.8,
      studentsCount: 89
    },
    {
      id: 'e5f6g7h8-i9j0-1234-efgh-567890123456',
      hostImage: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      hostName: 'Adebayo Kemi',
      title: 'UI/UX Design Fundamentals',
      description: 'Learn design thinking and create beautiful user interfaces that convert.',
      category: 'Design',
      date: 'Dec 28',
      time: '7:30 PM',
      price: '₦5,000',
      rating: 4.9,
      studentsCount: 156
    }
  ];

  const filteredClasses = mockClasses.filter(classItem => 
    selectedCategory === 'All' || classItem.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-sand via-creamy-white to-golden-yellow/10">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-creamy-white/90 backdrop-blur-sm border-b border-light-sand shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-deep-orange rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <span className="text-creamy-white font-bold text-lg">K</span>
              </div>
              <span className="text-xl font-bold text-charcoal-black group-hover:text-deep-orange transition-colors">KoboClass</span>
            </Link>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <NotificationSystem />

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
                    <Link to="/settings" className="block px-4 py-2 text-charcoal-black hover:bg-light-sand transition-colors">
                      Settings
                    </Link>
                    {(userProfile?.role === 'host' || userProfile?.role === 'both') && (
                      <Link to="/host-dashboard" className="block px-4 py-2 text-charcoal-black hover:bg-light-sand transition-colors">
                        Host Dashboard
                      </Link>
                    )}
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
            <span className="text-sm font-medium text-warm-gray">
              Welcome back{userProfile?.full_name ? `, ${userProfile.full_name}` : ''}!
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-charcoal-black mb-2">
            Discover Live Classes
          </h1>
          <p className="text-lg text-warm-gray">
            Join masterclasses taught by Nigeria's most talented creatives
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Sort Options */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-warm-gray" />
              <span className="text-sm font-medium text-charcoal-black">Sort by:</span>
            </div>
            {sortOptions.map((option) => (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  sortBy === option
                    ? "bg-deep-orange text-creamy-white shadow-lg"
                    : "bg-light-sand text-charcoal-black hover:bg-golden-yellow/20 hover:text-deep-orange"
                )}
              >
                {option === 'Trending' && <TrendingUp className="w-4 h-4 inline mr-1" />}
                {option === 'Starting Soon' && <Clock className="w-4 h-4 inline mr-1" />}
                {option}
              </button>
            ))}
          </div>

          {/* Category Filters */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "flex-shrink-0 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap",
                  selectedCategory === category
                    ? "bg-gradient-to-r from-deep-orange to-golden-yellow text-creamy-white shadow-lg scale-105"
                    : "bg-creamy-white border border-light-sand text-charcoal-black hover:border-deep-orange hover:text-deep-orange hover:scale-105"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Class Feed */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredClasses.map((classItem) => (
            <div
              key={classItem.id}
              className="bg-creamy-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group cursor-pointer border border-light-sand/50"
            >
              {/* Card Header */}
              <div className="relative p-6 pb-4">
                <div className="absolute top-4 right-4 flex gap-2">
                  {classItem.isLive && (
                    <span className="bg-brick-red text-creamy-white px-2 py-1 rounded-full text-xs font-medium animate-pulse">
                      🔴 LIVE
                    </span>
                  )}
                  {classItem.isTrending && (
                    <span className="bg-golden-yellow text-charcoal-black px-2 py-1 rounded-full text-xs font-medium">
                      🔥 Trending
                    </span>
                  )}
                </div>

                {/* Host Info */}
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={classItem.hostImage}
                    alt={classItem.hostName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-light-sand"
                  />
                  <div>
                    <h3 className="font-semibold text-charcoal-black">{classItem.hostName}</h3>
                    <span className="text-sm text-warm-gray">{classItem.category}</span>
                  </div>
                </div>

                {/* Class Info */}
                <h4 className="text-lg font-bold text-charcoal-black mb-2 group-hover:text-deep-orange transition-colors">
                  {classItem.title}
                </h4>
                <p className="text-warm-gray text-sm mb-4 line-clamp-2">
                  {classItem.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-warm-gray mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{classItem.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{classItem.time}</span>
                    </div>
                  </div>
                </div>

                {/* Rating & Students */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-golden-yellow fill-current" />
                      <span className="text-sm font-medium">{classItem.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-warm-gray">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{classItem.studentsCount}</span>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-deep-orange">{classItem.price}</span>
                </div>

                {/* Buy Ticket Button */}
                {classItem.isLive ? (
                  <Link 
                    to={`/class/${classItem.id}/live`}
                    className="w-full bg-gradient-to-r from-forest-green to-deep-orange text-creamy-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 text-center block"
                  >
                    Join Live Class
                  </Link>
                ) : (
                  <Link 
                    to={`/class/${classItem.id}/checkout`}
                    className="w-full bg-gradient-to-r from-deep-orange to-golden-yellow text-creamy-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 text-center block"
                  >
                    Buy Ticket
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-light-sand text-charcoal-black px-8 py-3 rounded-xl font-medium hover:bg-golden-yellow/20 hover:text-deep-orange transition-all duration-300">
            Load More Classes
          </button>
        </div>
      </div>

      {/* Floating CTA Button */}
      <Link
        to="/host"
        className="fixed bottom-6 right-6 bg-gradient-to-r from-forest-green to-deep-orange text-creamy-white p-4 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 z-50 group"
      >
        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        <span className="absolute -top-12 right-0 bg-charcoal-black text-creamy-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Host a Class
        </span>
      </Link>
    </div>
  );
};

export default DashboardPage;