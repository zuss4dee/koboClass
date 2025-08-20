import React from 'react';
import { GraduationCap, Smartphone, Globe } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      icon: <GraduationCap className="w-8 h-8" />,
      emoji: '🎓',
      title: 'No Degree Required',
      description: 'Just real skill',
      bgColor: 'bg-orange-500',
      bgLight: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      emoji: '📱',
      title: 'Mobile-First Experience',
      description: 'Learn anywhere, anytime',
      bgColor: 'bg-purple-500',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      emoji: '🌍',
      title: 'Built for Nigerians',
      description: 'Local pricing, payment, lingo',
      bgColor: 'bg-yellow-500',
      bgLight: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className={`${benefit.bgLight} p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center border border-gray-100`}
            >
              <div className={`${benefit.bgColor} w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg`}>
                <span className="text-2xl">{benefit.emoji}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;