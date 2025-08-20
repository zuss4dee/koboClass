import React from 'react';
import { FeatureCarousel } from '@/components/ui/animated-feature-carousel';

const ProgramHighlight = () => {
  const images = {
    alt: "KoboClass learning experience",
    step1img1: "/image 4.png",
    step1img2: "/tcn7cwlLS9Omo2Ij2J_bHg-ezgif.com-webp-to-jpg-converter (1).jpg",
    step2img1: "https://images.pexels.com/photos/3184300/pexels-photo-3184300.jpeg?auto=compress&cs=tinysrgb&w=600",
    step2img2: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600",
    step3img: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600",
    step4img: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600",
  };

  return (
    <section className="py-16 bg-light-sand">
      <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal-black mb-4">
            Your Learning Journey
          </h2>
          <p className="text-xl text-warm-gray">
            From discovery to mastery - see how KoboClass transforms your skills
          </p>
        </div>

        <FeatureCarousel image={images} />
      </div>
    </section>
  );
};

export default ProgramHighlight;