import React from 'react';
import { FeatureCarousel } from '@/components/ui/animated-feature-carousel';

const ProgramHighlight = () => {
  const images = {
    alt: "KoboClass learning experience",
    step1img1: "/image 4.png",
    step1img2: "/tcn7cwlLS9Omo2Ij2J_bHg-ezgif.com-webp-to-jpg-converter (1).jpg",
    step2img1: "/932b823adcacbe708a9407b58050810be2ddcee8c38d18d4e0044bf64e7cd89c.png",
    step2img2: "/imagelive.png",
    step3img: "/imagep.png",
    step4img: "/imageport.png",
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