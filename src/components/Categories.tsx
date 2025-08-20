import React from 'react';

const Categories = () => {
  const categories = [
    { name: 'Makeup', emoji: '💄' },
    { name: 'Tech', emoji: '💻' },
    { name: 'Design', emoji: '🎨' },
    { name: 'Photography', emoji: '📸' },
    { name: 'Fashion', emoji: '✂️' },
    { name: 'Podcasting', emoji: '🎙️' },
    { name: 'Music Production', emoji: '🎵' },
    { name: 'Small Business Tips', emoji: '🛍️' },
    { name: 'Car Repairs', emoji: '🔧' },
    { name: 'Cooking', emoji: '👨‍🍳' },
    { name: 'Writing', emoji: '✍️' },
    { name: 'Dance', emoji: '💃' }
  ];

  return (
    <section className="py-16 bg-creamy-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal-black mb-4">
            Explore Categories
          </h2>
          <p className="text-xl text-warm-gray">
            Find your passion and turn it into profit
          </p>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="relative">
          <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((category, index) => (
              <div 
                key={index}
                className="flex-shrink-0 bg-light-sand hover:bg-golden-yellow/20 border border-deep-orange/30 px-6 py-4 rounded-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 group"
              >
                <div className="flex items-center space-x-3 whitespace-nowrap">
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                    {category.emoji}
                  </span>
                  <span className="text-charcoal-black font-medium group-hover:text-deep-orange transition-colors">
                    {category.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Gradient Fade */}
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-creamy-white to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
};

export default Categories;