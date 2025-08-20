import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, DollarSign, Users, ArrowRight, Sparkles, Target, Zap } from 'lucide-react';
import { TextRotate } from '@/components/ui/text-rotate';

const Features = () => {
  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'Practical Learning',
      description: 'Learn what works in the real world, not theory.',
      gradient: 'from-deep-orange via-brick-red to-golden-yellow',
      accentColor: 'text-deep-orange',
      bgPattern: 'bg-light-sand',
      floatingIcon: <Target className="w-4 h-4" />
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Earn from Your Skills',
      description: 'Anyone can host classes and earn instantly.',
      gradient: 'from-rich-plum via-warm-purple to-forest-green',
      accentColor: 'text-rich-plum',
      bgPattern: 'bg-light-sand',
      floatingIcon: <Zap className="w-4 h-4" />
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Community-Powered',
      description: 'Learn directly from Nigerians like you.',
      gradient: 'from-golden-yellow via-deep-orange to-brick-red',
      accentColor: 'text-golden-yellow',
      bgPattern: 'bg-light-sand',
      floatingIcon: <Sparkles className="w-4 h-4" />
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-light-sand via-creamy-white to-golden-yellow/10 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-warm-purple/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-deep-orange/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-golden-yellow/30 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-creamy-white/80 backdrop-blur-sm border border-light-sand rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-deep-orange" />
            <span className="text-sm font-medium text-warm-gray">Why Choose KoboClass</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-charcoal-black mb-4">
            Built for <TextRotate
              texts={["Real Learning", "Nigerian Creatives", "Skill Building", "Career Growth", "Success Stories"]}
              mainClassName="bg-gradient-to-r from-deep-orange to-golden-yellow bg-clip-text text-transparent inline-flex"
              staggerFrom="center"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              staggerDuration={0.03}
              splitLevelClassName="overflow-hidden"
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              rotationInterval={3000}
            />
          </h2>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-creamy-white/70 backdrop-blur-sm border border-light-sand/50 rounded-3xl p-8 hover:bg-creamy-white/90 transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:shadow-deep-orange/10 overflow-hidden"
            >
              {/* Gradient background overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}></div>
              
              {/* Floating decorative elements */}
              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:rotate-12">
                <div className={`w-8 h-8 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center text-white shadow-lg`}>
                  {feature.floatingIcon}
                </div>
              </div>

              {/* Main icon */}
              <div className="relative mb-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative z-10`}>
                  {feature.icon}
                </div>
                {/* Icon glow effect */}
                <div className={`absolute inset-0 w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-charcoal-black mb-3 group-hover:text-charcoal-black transition-colors">
                  {feature.title}
                </h3>
                <p className="text-warm-gray leading-relaxed mb-6 group-hover:text-charcoal-black/70 transition-colors">
                  {feature.description}
                </p>

                {/* CTA Link */}
                <div className="flex items-center gap-2 text-sm font-medium text-warm-gray group-hover:text-deep-orange transition-all duration-300">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>

              {/* Bottom accent line */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-3xl`}></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Link 
            to="/features"
            className="inline-flex items-center gap-3 gradient-orange-yellow text-on-gradient px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl hover:shadow-deep-orange/25 hover:scale-105 transition-all duration-300 group"
          >
            <span>Explore All Features</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Features;