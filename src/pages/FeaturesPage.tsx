import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowLeft,
  Brain, 
  DollarSign, 
  Users, 
  Video, 
  Calendar, 
  Star,
  Shield,
  Smartphone,
  Globe,
  Zap,
  Heart,
  TrendingUp,
  BookOpen,
  MessageCircle,
  Award,
  Target,
  Sparkles,
  Play,
  CheckCircle,
  Clock,
  MapPin,
  Camera,
  Mic,
  Share2,
  Download,
  Bell,
  Settings,
  CreditCard,
  BarChart3
} from 'lucide-react';
import { cn } from '../lib/utils';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Feature {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
  category: 'learning' | 'teaching' | 'platform' | 'community';
  gradient: string;
  accentColor: string;
  image: string;
  stats?: {
    label: string;
    value: string;
  }[];
}

const FeaturesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Features', icon: Sparkles },
    { id: 'learning', name: 'For Learners', icon: BookOpen },
    { id: 'teaching', name: 'For Creators', icon: Users },
    { id: 'platform', name: 'Platform', icon: Zap },
    { id: 'community', name: 'Community', icon: Heart }
  ];

  const features: Feature[] = [
    {
      id: 'live-classes',
      icon: <Video className="w-8 h-8" />,
      title: 'Live Interactive Classes',
      description: 'Join real-time classes where you can ask questions, get feedback, and learn alongside other passionate students.',
      benefits: [
        'Real-time interaction with instructors',
        'Ask questions and get instant answers',
        'Learn with a community of peers',
        'Record sessions for later review',
        'Interactive whiteboards and screen sharing'
      ],
      category: 'learning',
      gradient: 'from-deep-orange via-brick-red to-golden-yellow',
      accentColor: 'text-deep-orange',
      image: 'https://images.pexels.com/photos/3184299/pexels-photo-3184299.jpeg?auto=compress&cs=tinysrgb&w=600',
      stats: [
        { label: 'Average Class Size', value: '15-30 students' },
        { label: 'Success Rate', value: '95%' },
        { label: 'Satisfaction', value: '4.8/5 stars' }
      ]
    },
    {
      id: 'instant-earnings',
      icon: <DollarSign className="w-8 h-8" />,
      title: 'Instant Earnings',
      description: 'Start earning from your skills immediately. Get paid 80% of class fees directly to your bank account.',
      benefits: [
        'Keep 80% of all class fees',
        'Weekly automatic payouts',
        'No hidden fees or charges',
        'Multiple payment methods supported',
        'Transparent earnings dashboard'
      ],
      category: 'teaching',
      gradient: 'from-forest-green via-golden-yellow to-deep-orange',
      accentColor: 'text-forest-green',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600',
      stats: [
        { label: 'Average Host Earnings', value: '₦45,000/month' },
        { label: 'Top Earner', value: '₦180,000/month' },
        { label: 'Payout Time', value: '1-3 business days' }
      ]
    },
    {
      id: 'mobile-first',
      icon: <Smartphone className="w-8 h-8" />,
      title: 'Mobile-First Experience',
      description: 'Learn and teach from anywhere with our mobile-optimized platform designed for Nigerian internet speeds.',
      benefits: [
        'Optimized for slow internet connections',
        'Works on any smartphone or tablet',
        'Offline content download',
        'Data-saving video quality options',
        'Touch-friendly interface'
      ],
      category: 'platform',
      gradient: 'from-warm-purple via-rich-plum to-deep-orange',
      accentColor: 'text-warm-purple',
      image: 'https://images.pexels.com/photos/3184334/pexels-photo-3184334.jpeg?auto=compress&cs=tinysrgb&w=600',
      stats: [
        { label: 'Mobile Users', value: '85%' },
        { label: 'Data Usage', value: '50% less' },
        { label: 'Load Time', value: '< 3 seconds' }
      ]
    },
    {
      id: 'nigerian-focused',
      icon: <Globe className="w-8 h-8" />,
      title: 'Built for Nigerians',
      description: 'Local pricing in Naira, Nigerian payment methods, and content that speaks to our culture and context.',
      benefits: [
        'Pricing in Nigerian Naira (₦)',
        'Local payment methods (USSD, Bank Transfer)',
        'Nigerian cultural context',
        'Local time zones and scheduling',
        'Pidgin English support'
      ],
      category: 'platform',
      gradient: 'from-golden-yellow via-forest-green to-deep-orange',
      accentColor: 'text-golden-yellow',
      image: 'https://images.pexels.com/photos/3184301/pexels-photo-3184301.jpeg?auto=compress&cs=tinysrgb&w=600',
      stats: [
        { label: 'Nigerian Creators', value: '100+' },
        { label: 'Local Payment Methods', value: '5+' },
        { label: 'Cities Covered', value: '20+' }
      ]
    },
    {
      id: 'community-driven',
      icon: <Heart className="w-8 h-8" />,
      title: 'Community-Powered Learning',
      description: 'Connect with like-minded Nigerians, build lasting relationships, and grow together in a supportive environment.',
      benefits: [
        'Join study groups and communities',
        'Network with fellow learners',
        'Mentorship opportunities',
        'Peer-to-peer learning',
        'Success story sharing'
      ],
      category: 'community',
      gradient: 'from-rich-plum via-warm-purple to-golden-yellow',
      accentColor: 'text-rich-plum',
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600',
      stats: [
        { label: 'Active Communities', value: '25+' },
        { label: 'Monthly Connections', value: '1,000+' },
        { label: 'Success Stories', value: '500+' }
      ]
    },
    {
      id: 'smart-scheduling',
      icon: <Calendar className="w-8 h-8" />,
      title: 'Smart Scheduling',
      description: 'AI-powered scheduling that finds the perfect time for your classes based on student availability and preferences.',
      benefits: [
        'Automatic optimal time suggestions',
        'Calendar integration',
        'Timezone management',
        'Reminder notifications',
        'Rescheduling flexibility'
      ],
      category: 'platform',
      gradient: 'from-deep-orange via-golden-yellow to-forest-green',
      accentColor: 'text-deep-orange',
      image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600',
      stats: [
        { label: 'Scheduling Accuracy', value: '98%' },
        { label: 'Time Saved', value: '2 hours/week' },
        { label: 'Show-up Rate', value: '92%' }
      ]
    },
    {
      id: 'quality-assurance',
      icon: <Shield className="w-8 h-8" />,
      title: 'Quality Assurance',
      description: 'Every creator is verified and every class is quality-checked to ensure you get the best learning experience.',
      benefits: [
        'Verified creator profiles',
        'Quality-checked content',
        'Student feedback system',
        'Continuous improvement',
        'Money-back guarantee'
      ],
      category: 'platform',
      gradient: 'from-forest-green via-deep-orange to-golden-yellow',
      accentColor: 'text-forest-green',
      image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600',
      stats: [
        { label: 'Creator Approval Rate', value: '15%' },
        { label: 'Quality Score', value: '4.8/5' },
        { label: 'Refund Rate', value: '< 2%' }
      ]
    },
    {
      id: 'practical-skills',
      icon: <Target className="w-8 h-8" />,
      title: 'Practical Skills Focus',
      description: 'Learn skills that actually matter in the real world. No theory - just practical, actionable knowledge you can use immediately.',
      benefits: [
        'Real-world applicable skills',
        'Hands-on projects and assignments',
        'Portfolio building guidance',
        'Industry-relevant techniques',
        'Immediate implementation'
      ],
      category: 'learning',
      gradient: 'from-golden-yellow via-deep-orange to-brick-red',
      accentColor: 'text-golden-yellow',
      image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600',
      stats: [
        { label: 'Job Placement Rate', value: '78%' },
        { label: 'Skill Application', value: '90%' },
        { label: 'Portfolio Projects', value: '3-5 per class' }
      ]
    }
  ];

  const filteredFeatures = selectedCategory === 'all' 
    ? features 
    : features.filter(feature => feature.category === selectedCategory);

  const handleFeatureSelect = (featureId: string) => {
    setSelectedFeature(selectedFeature === featureId ? null : featureId);
  };

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
              <span className="text-sm font-medium text-warm-gray">Platform Features</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal-black leading-tight mb-6">
              Everything You Need to <span className="text-deep-orange">Learn</span><br />
              <span className="bg-gradient-to-r from-forest-green to-golden-yellow bg-clip-text text-transparent">
                and Teach Successfully
              </span>
            </h1>
            
            <p className="text-xl text-warm-gray leading-relaxed max-w-3xl mx-auto mb-8">
              Discover all the powerful features that make KoboClass the best platform for 
              Nigerian creatives to share knowledge and build thriving businesses.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-deep-orange mb-1">8+</div>
                <div className="text-sm text-warm-gray">Core Features</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-forest-green mb-1">95%</div>
                <div className="text-sm text-warm-gray">User Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-golden-yellow mb-1">24/7</div>
                <div className="text-sm text-warm-gray">Platform Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-light-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "flex items-center gap-3 px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105",
                    selectedCategory === category.id
                      ? "bg-deep-orange text-creamy-white shadow-lg"
                      : "bg-creamy-white border border-light-sand text-charcoal-black hover:border-deep-orange hover:text-deep-orange"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-creamy-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredFeatures.map((feature, index) => (
              <div
                key={feature.id}
                className="group relative bg-creamy-white/70 backdrop-blur-sm border border-light-sand/50 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-deep-orange/10 transition-all duration-500 hover:-translate-y-2"
              >
                {/* Gradient background overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                <div className="relative z-10 p-8">
                  {/* Header */}
                  <div className="flex items-start gap-6 mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      {feature.icon}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-charcoal-black mb-2 group-hover:text-charcoal-black transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-warm-gray leading-relaxed group-hover:text-charcoal-black/70 transition-colors">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {/* Feature Image */}
                  <div className="relative mb-6 overflow-hidden rounded-2xl">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-black/60 via-transparent to-transparent"></div>
                    
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 bg-creamy-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                        <Play className="w-8 h-8 text-deep-orange ml-1" />
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  {feature.stats && (
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {feature.stats.map((stat, statIndex) => (
                        <div key={statIndex} className="text-center">
                          <div className="text-lg font-bold text-charcoal-black">{stat.value}</div>
                          <div className="text-xs text-warm-gray">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Benefits Toggle */}
                  <button
                    onClick={() => handleFeatureSelect(feature.id)}
                    className="w-full flex items-center justify-between p-4 bg-light-sand rounded-xl hover:bg-golden-yellow/20 transition-colors group/button"
                  >
                    <span className="font-medium text-charcoal-black">
                      {selectedFeature === feature.id ? 'Hide Details' : 'View Key Benefits'}
                    </span>
                    <ArrowRight className={cn(
                      "w-5 h-5 text-deep-orange transition-transform duration-300",
                      selectedFeature === feature.id ? "rotate-90" : "group-hover/button:translate-x-1"
                    )} />
                  </button>

                  {/* Expandable Benefits */}
                  {selectedFeature === feature.id && (
                    <div className="mt-4 space-y-3 animate-in slide-in-from-top-2 duration-300">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center gap-3 p-3 bg-light-sand/50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-forest-green flex-shrink-0" />
                          <span className="text-sm text-charcoal-black">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 bg-light-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal-black mb-4">
              Why Choose KoboClass?
            </h2>
            <p className="text-xl text-warm-gray">
              See how we compare to other learning platforms
            </p>
          </div>

          <div className="bg-creamy-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-light-sand">
                  <tr>
                    <th className="text-left p-6 font-semibold text-charcoal-black">Features</th>
                    <th className="text-center p-6 font-semibold text-deep-orange">KoboClass</th>
                    <th className="text-center p-6 font-semibold text-warm-gray">Others</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-sand">
                  {[
                    { feature: 'Live Interactive Classes', kobo: true, others: false },
                    { feature: 'Nigerian-Focused Content', kobo: true, others: false },
                    { feature: 'Instant Payouts (80%)', kobo: true, others: false },
                    { feature: 'Mobile-First Design', kobo: true, others: true },
                    { feature: 'Local Payment Methods', kobo: true, others: false },
                    { feature: 'Community Features', kobo: true, others: true },
                    { feature: 'Quality Assurance', kobo: true, others: true },
                    { feature: 'Affordable Pricing', kobo: true, others: false }
                  ].map((row, index) => (
                    <tr key={index} className="hover:bg-light-sand/30 transition-colors">
                      <td className="p-6 font-medium text-charcoal-black">{row.feature}</td>
                      <td className="p-6 text-center">
                        {row.kobo ? (
                          <CheckCircle className="w-6 h-6 text-forest-green mx-auto" />
                        ) : (
                          <div className="w-6 h-6 bg-warm-gray/30 rounded-full mx-auto"></div>
                        )}
                      </td>
                      <td className="p-6 text-center">
                        {row.others ? (
                          <CheckCircle className="w-6 h-6 text-warm-gray mx-auto" />
                        ) : (
                          <div className="w-6 h-6 bg-warm-gray/30 rounded-full mx-auto"></div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 bg-creamy-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal-black mb-4">
              Powered by Modern Technology
            </h2>
            <p className="text-xl text-warm-gray">
              Built with cutting-edge tools for the best experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Video className="w-8 h-8" />,
                title: 'HD Video Streaming',
                description: 'Crystal clear video quality optimized for Nigerian internet speeds',
                color: 'text-deep-orange'
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Bank-Level Security',
                description: 'Your data and payments are protected with enterprise-grade encryption',
                color: 'text-forest-green'
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Lightning Fast',
                description: 'Optimized performance ensures smooth learning even on slow connections',
                color: 'text-golden-yellow'
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: 'Global Standards',
                description: 'Built to international standards while serving local needs',
                color: 'text-warm-purple'
              }
            ].map((tech, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-light-sand hover:bg-golden-yellow/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-light-sand to-golden-yellow/30 flex items-center justify-center mx-auto mb-4 ${tech.color} group-hover:scale-110 transition-transform duration-300`}>
                  {tech.icon}
                </div>
                <h3 className="text-lg font-bold text-charcoal-black mb-2">{tech.title}</h3>
                <p className="text-warm-gray text-sm leading-relaxed">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-deep-orange via-golden-yellow to-forest-green relative overflow-hidden">
        <div className="absolute inset-0 bg-charcoal-black/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-creamy-white mb-4">
            Ready to Experience These Features?
          </h2>
          <p className="text-xl text-light-sand mb-8 max-w-2xl mx-auto">
            Join thousands of Nigerian creatives who are already building their futures with KoboClass.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center gap-3 bg-creamy-white text-deep-orange px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
            >
              <span>Start Learning Today</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              to="/signup?redirect=host"
              className="inline-flex items-center gap-3 border-2 border-creamy-white text-creamy-white px-8 py-4 rounded-2xl font-semibold hover:bg-creamy-white hover:text-deep-orange hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
            >
              <span>Become a Creator</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FeaturesPage;