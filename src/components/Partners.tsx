import React from 'react';
import { Award, Shield, Zap, Globe } from 'lucide-react';

const Partners = () => {
  const partners = [
    { name: 'Microsoft for Startups', icon: <Award className="w-8 h-8" /> },
    { name: 'Paystack', icon: <Shield className="w-8 h-8" /> },
    { name: 'Google for Startups', icon: <Zap className="w-8 h-8" /> },
    { name: 'TechStars', icon: <Globe className="w-8 h-8" /> }
  ];

  return (
    <section className="py-16 bg-creamy-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-lg font-medium text-warm-gray mb-8">
            Proudly backed by the tech that powers Nigeria
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
          {partners.map((partner, index) => (
            <div 
              key={index}
              className="flex flex-col items-center space-y-4 p-6 rounded-lg hover:bg-light-sand transition-colors grayscale hover:grayscale-0 cursor-pointer"
            >
              <div className="text-warm-gray hover:text-deep-orange transition-colors">
                {partner.icon}
              </div>
              <span className="text-sm font-medium text-warm-gray text-center">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;