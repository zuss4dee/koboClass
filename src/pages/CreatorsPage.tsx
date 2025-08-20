import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  Users, 
  BookOpen, 
  MapPin, 
  Instagram, 
  Twitter, 
  Linkedin,
  Filter,
  Search,
  TrendingUp,
  Award,
  Heart,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Play,
  Calendar
} from 'lucide-react';
import { cn } from '../lib/utils';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Creator {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  coverImage: string;
  category: string;
  rating: number;
  totalStudents: number;
  totalClasses: number;
  totalEarnings: number;
  location: string;
  isVerified: boolean;
  isTopRated: boolean;
  socialLinks: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  recentClasses: Array<{
    id: string;
    title: string;
    price: number;
    date: string;
    studentsEnrolled: number;
  }>;
  specialties: string[];
}

const CreatorsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Top Rated');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Tech', 'Creative', 'Business', 'Music', 'Fashion', 'Design', 'Photography', 'Cooking'];
  const sortOptions = ['Top Rated', 'Most Students', 'Newest', 'Most Classes'];

  const creators: Creator[] = [
    {
      id: '1',
      name: 'Chioma Okeke',
      title: 'Professional Makeup Artist & Beauty Coach',
      bio: 'Certified makeup artist with 8+ years experience. Specializing in bridal makeup, special effects, and beauty education. Featured in Vogue Nigeria.',
      avatar: 'https://images.pexels.com/photos/3184334/pexels-photo-3184334.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&crop=face',
      coverImage: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      category: 'Creative',
      rating: 4.9,
      totalStudents: 1247,
      totalClasses: 23,
      totalEarnings: 450000,
      location: 'Lagos, Nigeria',
      isVerified: true,
      isTopRated: true,
      socialLinks: {
        instagram: '#',
        twitter: '#'
      },
      recentClasses: [
        { id: '1', title: 'Master Professional Makeup Artistry', price: 2500, date: 'Dec 20', studentsEnrolled: 45 },
        { id: '2', title: 'Bridal Makeup Masterclass', price: 3500, date: 'Dec 25', studentsEnrolled: 32 }
      ],
      specialties: ['Bridal Makeup', 'Special Effects', 'Color Theory', 'Beauty Photography']
    },
    {
      id: '2',
      name: 'Ibrahim Sule',
      title: 'Full-Stack Developer & Tech Educator',
      bio: 'Senior software engineer at Paystack with 6+ years experience. Passionate about teaching practical coding skills and helping Nigerians break into tech.',
      avatar: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&crop=face',
      coverImage: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      category: 'Tech',
      rating: 4.8,
      totalStudents: 2156,
      totalClasses: 34,
      totalEarnings: 680000,
      location: 'Abuja, Nigeria',
      isVerified: true,
      isTopRated: true,
      socialLinks: {
        twitter: '#',
        linkedin: '#'
      },
      recentClasses: [
        { id: '3', title: 'Build Your First Website in 2 Hours', price: 3500, date: 'Dec 22', studentsEnrolled: 78 },
        { id: '4', title: 'React for Beginners', price: 4000, date: 'Dec 28', studentsEnrolled: 156 }
      ],
      specialties: ['React', 'Node.js', 'JavaScript', 'Web Development']
    },
    {
      id: '3',
      name: 'Tunde Bakare',
      title: 'Music Producer & Audio Engineer',
      bio: 'Award-winning music producer who has worked with top Nigerian artists. Teaching the next generation of music creators using industry-standard techniques.',
      avatar: 'https://images.pexels.com/photos/3184301/pexels-photo-3184301.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&crop=face',
      coverImage: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      category: 'Music',
      rating: 4.7,
      totalStudents: 892,
      totalClasses: 18,
      totalEarnings: 320000,
      location: 'Lagos, Nigeria',
      isVerified: true,
      isTopRated: false,
      socialLinks: {
        instagram: '#',
        twitter: '#'
      },
      recentClasses: [
        { id: '5', title: 'Music Production Masterclass', price: 4000, date: 'Dec 20', studentsEnrolled: 32 },
        { id: '6', title: 'Beat Making with FL Studio', price: 3000, date: 'Dec 30', studentsEnrolled: 67 }
      ],
      specialties: ['Music Production', 'Audio Engineering', 'Beat Making', 'Mixing & Mastering']
    },
    {
      id: '4',
      name: 'Fatima Hassan',
      title: 'Business Strategist & Entrepreneur',
      bio: 'Serial entrepreneur and business coach. Founded 3 successful startups and now helps others build profitable online businesses from scratch.',
      avatar: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&crop=face',
      coverImage: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      category: 'Business',
      rating: 4.6,
      totalStudents: 1543,
      totalClasses: 28,
      totalEarnings: 520000,
      location: 'Kano, Nigeria',
      isVerified: true,
      isTopRated: false,
      socialLinks: {
        linkedin: '#',
        twitter: '#'
      },
      recentClasses: [
        { id: '7', title: 'Start Your Online Business Today', price: 1500, date: 'Dec 22', studentsEnrolled: 67 },
        { id: '8', title: 'Digital Marketing for Beginners', price: 2000, date: 'Dec 26', studentsEnrolled: 89 }
      ],
      specialties: ['Business Strategy', 'Digital Marketing', 'E-commerce', 'Startup Funding']
    },
    {
      id: '5',
      name: 'Kemi Adeyemi',
      title: 'Professional Photographer & Visual Storyteller',
      bio: 'Award-winning photographer specializing in portraits and lifestyle photography. Teaching mobile photography and social media content creation.',
      avatar: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&crop=face',
      coverImage: 'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      category: 'Creative',
      rating: 4.8,
      totalStudents: 967,
      totalClasses: 15,
      totalEarnings: 290000,
      location: 'Port Harcourt, Nigeria',
      isVerified: true,
      isTopRated: true,
      socialLinks: {
        instagram: '#',
        twitter: '#'
      },
      recentClasses: [
        { id: '9', title: 'Photography for Social Media', price: 2000, date: 'Dec 25', studentsEnrolled: 89 },
        { id: '10', title: 'Mobile Photography Masterclass', price: 1800, date: 'Dec 29', studentsEnrolled: 124 }
      ],
      specialties: ['Portrait Photography', 'Mobile Photography', 'Social Media Content', 'Photo Editing']
    },
    {
      id: '6',
      name: 'Adebayo Kemi',
      title: 'UI/UX Designer & Product Design Lead',
      bio: 'Lead designer at Flutterwave with expertise in user experience design. Passionate about teaching design thinking and creating beautiful digital products.',
      avatar: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&crop=face',
      coverImage: 'https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      category: 'Design',
      rating: 4.9,
      totalStudents: 1834,
      totalClasses: 31,
      totalEarnings: 620000,
      location: 'Lagos, Nigeria',
      isVerified: true,
      isTopRated: true,
      socialLinks: {
        linkedin: '#',
        twitter: '#',
        instagram: '#'
      },
      recentClasses: [
        { id: '11', title: 'UI/UX Design Fundamentals', price: 5000, date: 'Dec 28', studentsEnrolled: 156 },
        { id: '12', title: 'Design Systems Workshop', price: 4500, date: 'Jan 2', studentsEnrolled: 98 }
      ],
      specialties: ['UI/UX Design', 'Design Systems', 'Figma', 'User Research']
    }
  ];

  const filteredCreators = creators.filter(creator => {
    const matchesCategory = selectedCategory === 'All' || creator.category === selectedCategory;
    const matchesSearch = creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         creator.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         creator.specialties.some(specialty => 
                           specialty.toLowerCase().includes(searchQuery.toLowerCase())
                         );
    return matchesCategory && matchesSearch;
  });

  const sortedCreators = [...filteredCreators].sort((a, b) => {
    switch (sortBy) {
      case 'Top Rated':
        return b.rating - a.rating;
      case 'Most Students':
        return b.totalStudents - a.totalStudents;
      case 'Most Classes':
        return b.totalClasses - a.totalClasses;
      case 'Newest':
        return new Date(b.recentClasses[0]?.date || '').getTime() - new Date(a.recentClasses[0]?.date || '').getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-sand via-creamy-white to-golden-yellow/10">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-creamy-white via-light-sand to-golden-yellow/20 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-32 h-32 bg-warm-purple/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-deep-orange/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-golden-yellow/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-creamy-white/80 backdrop-blur-sm border border-light-sand rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-deep-orange" />
              <span className="text-sm font-medium text-warm-gray">Meet Our Community</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal-black leading-tight mb-6">
              Discover <span className="text-deep-orange">Talented Nigerian</span><br />
              <span className="bg-gradient-to-r from-forest-green to-golden-yellow bg-clip-text text-transparent">
                Creators & Educators
              </span>
            </h1>
            
            <p className="text-xl text-warm-gray leading-relaxed max-w-3xl mx-auto mb-8">
              Connect with skilled professionals who've turned their passions into thriving careers. 
              Learn from real people with real experience.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-deep-orange mb-1">100+</div>
                <div className="text-sm text-warm-gray">Expert Creators</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-forest-green mb-1">4.8★</div>
                <div className="text-sm text-warm-gray">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-golden-yellow mb-1">10,000+</div>
                <div className="text-sm text-warm-gray">Students Taught</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-8 bg-light-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-warm-gray" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search creators by name, skill, or specialty..."
                className="w-full pl-12 pr-4 py-3 border border-light-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-deep-orange focus:border-deep-orange bg-creamy-white"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-warm-gray" />
                <span className="text-sm font-medium text-charcoal-black">Filter:</span>
              </div>
              
              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap",
                      selectedCategory === category
                        ? "bg-deep-orange text-creamy-white shadow-lg"
                        : "bg-creamy-white border border-light-sand text-charcoal-black hover:border-deep-orange hover:text-deep-orange"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-light-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-deep-orange bg-creamy-white text-charcoal-black"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Creators Grid */}
      <section className="py-16 bg-creamy-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {sortedCreators.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-light-sand rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-12 h-12 text-warm-gray" />
              </div>
              <h3 className="text-2xl font-bold text-charcoal-black mb-4">No creators found</h3>
              <p className="text-warm-gray mb-8">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="bg-deep-orange text-creamy-white px-6 py-3 rounded-xl font-semibold hover:bg-brick-red transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedCreators.map((creator) => (
                <div
                  key={creator.id}
                  className="bg-creamy-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 overflow-hidden group cursor-pointer border border-light-sand/50"
                >
                  {/* Cover Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={creator.coverImage}
                      alt={`${creator.name} cover`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-black/60 via-transparent to-transparent"></div>
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      {creator.isVerified && (
                        <span className="bg-forest-green text-creamy-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                      {creator.isTopRated && (
                        <span className="bg-golden-yellow text-charcoal-black px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Top Rated
                        </span>
                      )}
                    </div>

                    {/* Category */}
                    <div className="absolute top-4 right-4">
                      <span className="bg-deep-orange text-creamy-white px-3 py-1 rounded-full text-xs font-medium">
                        {creator.category}
                      </span>
                    </div>

                    {/* Avatar */}
                    <div className="absolute -bottom-8 left-6">
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        className="w-16 h-16 rounded-full border-4 border-creamy-white shadow-lg object-cover"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-12 pb-6 px-6">
                    {/* Header */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-charcoal-black group-hover:text-deep-orange transition-colors line-clamp-1">
                          {creator.name}
                        </h3>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-golden-yellow fill-current" />
                          <span className="text-sm font-medium">{creator.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-deep-orange font-medium text-sm mb-2">{creator.title}</p>
                      <p className="text-warm-gray text-sm line-clamp-2 leading-relaxed">{creator.bio}</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-lg font-bold text-charcoal-black">{creator.totalStudents.toLocaleString()}</div>
                        <div className="text-xs text-warm-gray">Students</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-charcoal-black">{creator.totalClasses}</div>
                        <div className="text-xs text-warm-gray">Classes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-charcoal-black">₦{(creator.totalEarnings / 1000).toFixed(0)}k</div>
                        <div className="text-xs text-warm-gray">Earned</div>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {creator.specialties.slice(0, 3).map((specialty, index) => (
                          <span
                            key={index}
                            className="bg-light-sand text-charcoal-black px-2 py-1 rounded-full text-xs font-medium"
                          >
                            {specialty}
                          </span>
                        ))}
                        {creator.specialties.length > 3 && (
                          <span className="text-xs text-warm-gray">+{creator.specialties.length - 3} more</span>
                        )}
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 mb-6">
                      <MapPin className="w-4 h-4 text-warm-gray" />
                      <span className="text-sm text-warm-gray">{creator.location}</span>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-3">
                        {creator.socialLinks.instagram && (
                          <a href={creator.socialLinks.instagram} className="text-warm-gray hover:text-deep-orange transition-colors">
                            <Instagram className="w-4 h-4" />
                          </a>
                        )}
                        {creator.socialLinks.twitter && (
                          <a href={creator.socialLinks.twitter} className="text-warm-gray hover:text-deep-orange transition-colors">
                            <Twitter className="w-4 h-4" />
                          </a>
                        )}
                        {creator.socialLinks.linkedin && (
                          <a href={creator.socialLinks.linkedin} className="text-warm-gray hover:text-deep-orange transition-colors">
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                      </div>

                      <button className="bg-deep-orange text-creamy-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brick-red transition-all duration-300 hover:shadow-lg group">
                        <span>View Profile</span>
                        <ArrowRight className="w-4 h-4 inline ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More */}
          {sortedCreators.length > 0 && (
            <div className="text-center mt-16">
              <button className="bg-light-sand text-charcoal-black px-8 py-4 rounded-xl font-semibold hover:bg-golden-yellow/20 hover:text-deep-orange transition-all duration-300 hover:shadow-lg">
                Load More Creators
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-deep-orange via-golden-yellow to-forest-green relative overflow-hidden">
        <div className="absolute inset-0 bg-charcoal-black/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-creamy-white mb-4">
            Ready to Share Your Skills?
          </h2>
          <p className="text-xl text-light-sand mb-8 max-w-2xl mx-auto">
            Join our community of talented Nigerian creators and start earning from your expertise today.
          </p>
          <Link
            to="/signup?redirect=host"
            className="inline-flex items-center gap-3 bg-creamy-white text-deep-orange px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
          >
            <span>Become a Creator</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CreatorsPage;