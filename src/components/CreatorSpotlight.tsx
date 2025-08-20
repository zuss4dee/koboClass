import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatedTooltip } from '@/components/ui/animated-tooltip';
import { DisplayCardsDemo } from '@/components/ui/display-cards-demo';
import { Star, Users, TrendingUp } from 'lucide-react';

const CreatorSpotlight = () => {
  // Data for animated tooltip
  const topCreators = [
    {
      id: 1,
      name: "Tunde Bakare",
      designation: "Music Producer", 
      image: "https://images.pexels.com/photos/3184301/pexels-photo-3184301.jpeg?auto=compress&cs=tinysrgb&w=300"
    },
    {
      id: 2,
      name: "Chioma Okeke",
      designation: "Fashion Designer",
      image: "https://images.pexels.com/photos/3184334/pexels-photo-3184334.jpeg?auto=compress&cs=tinysrgb&w=300"
    },
    {
      id: 3,
      name: "Ibrahim Sule",
      designation: "Tech Instructor",
      image: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=300"
    },
    {
      id: 4,
      name: "Fatima Hassan",
      designation: "Business Coach",
      image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=300"
    }
  ];

  const stats = [
    {
      icon: <Star className="w-5 h-5" />,
      number: "4.9",
      label: "Average Rating",
      color: "text-golden-yellow"
    },
    {
      icon: <Users className="w-5 h-5" />,
      number: "100+",
      label: "Expert Creators",
      color: "text-deep-orange"
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      number: "95%",
      label: "Success Rate",
      color: "text-forest-green"
    }
  ];

  return (
    <section className="py-16 bg-creamy-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-light-sand border border-deep-orange/30 rounded-full px-4 py-2">
                <span className="text-2xl">🌟</span>
                <span className="text-sm font-medium text-deep-orange">Meet Our Community</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-charcoal-black leading-tight">
                Learn from the <span className="text-deep-orange">best creators</span> in Nigeria
              </h2>
              
              <p className="text-xl text-warm-gray leading-relaxed">
                Connect with talented Nigerians who've turned their passions into thriving careers. Real skills from real people.
              </p>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-light-sand flex items-center justify-center ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-charcoal-black">{stat.number}</div>
                    <div className="text-sm text-warm-gray">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Creator Avatars */}
            <div className="space-y-4">
              <p className="text-sm font-medium text-charcoal-black">Featured Creators:</p>
              <div className="flex items-center gap-4">
                <AnimatedTooltip items={topCreators} />
                <span className="text-sm text-warm-gray">+96 more creators</span>
              </div>
            </div>

            <button className="bg-deep-orange text-creamy-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-brick-red transition-all duration-300 hover:shadow-xl hover:scale-105">
              <Link to="/creators" className="block">
                Browse All Creators
              </Link>
            </button>
          </div>

          {/* Right Side - Interactive Cards */}
          <div className="relative min-h-[500px] flex items-center justify-center">
            <DisplayCardsDemo />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreatorSpotlight;