import React from 'react';
import { Link } from 'react-router-dom';
import { Particles } from '@/components/ui/highlighter';
import { HighlightGroup, HighlighterItem } from '@/components/ui/highlighter';

const CTABanner = () => {
  return (
    <section className="py-16 gradient-green-red relative overflow-hidden">
      {/* Interactive Particles Background */}
      <Particles
        className="absolute inset-0"
        quantity={80}
        staticity={30}
        ease={40}
        color="#FAF4EC"
        vx={0.1}
        vy={-0.1}
      />

      <HighlightGroup className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <HighlighterItem className="rounded-3xl">
          <div className="flex flex-col lg:flex-row gap-12 items-center justify-between p-12 bg-charcoal-black/20 backdrop-blur-sm rounded-3xl border border-creamy-white/10">
            <div className="text-center lg:text-left space-y-8 flex-1 max-w-2xl">
              <div className="inline-flex items-center gap-3 bg-creamy-white/15 backdrop-blur-sm border border-creamy-white/30 rounded-full px-6 py-3 shadow-lg">
                <span className="text-2xl">🚀</span>
                <span className="text-base font-semibold text-creamy-white tracking-wide">Join the Movement</span>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-creamy-white leading-none tracking-tight">
                  <span className="inline-block transform hover:scale-105 transition-transform duration-300">
                    Ready to
                  </span>
                </h2>
                <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 text-4xl md:text-5xl lg:text-6xl font-black">
                  <span className="inline-block text-golden-yellow transform hover:scale-110 transition-all duration-300 cursor-pointer hover:text-deep-orange" 
                        style={{
                          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
                        }}>
                    Learn,
                  </span>
                  <span className="inline-block text-forest-green transform hover:scale-110 transition-all duration-300 cursor-pointer hover:text-golden-yellow"
                        style={{
                          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
                        }}>
                    Teach,
                  </span>
                  <span className="inline-block text-creamy-white transform hover:scale-110 transition-all duration-300 cursor-pointer">
                    or
                  </span>
                  <span className="inline-block text-warm-purple transform hover:scale-110 transition-all duration-300 cursor-pointer hover:text-deep-orange"
                        style={{
                          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
                        }}>
                    Earn?
                  </span>
                </div>
              </div>
              
              <div className="space-y-6">
                <p className="text-xl md:text-2xl text-light-sand/90 leading-relaxed font-medium">
                  <span className="inline-block text-golden-yellow font-bold">
                    KoboClass
                  </span>
                  <span className="ml-2">is where you start your journey.</span>
                </p>
                
                <Link to="/signup?redirect=host" className="group relative bg-creamy-white text-forest-green px-10 py-5 rounded-2xl text-xl font-bold hover:bg-light-sand transition-all duration-300 hover:shadow-2xl hover:scale-105 shadow-xl transform hover:-translate-y-1 inline-block">
                  <span className="relative z-10">Join KoboClass Now</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-golden-yellow/20 to-deep-orange/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            </div>
            
            <div className="relative flex justify-center lg:justify-end flex-shrink-0">
              <div className="relative">
                <img 
                  src="/tcn7cwlLS9Omo2Ij2J_bHg-ezgif.com-webp-to-jpg-converter (1).jpg"
                  alt="KoboClass community learning together"
                  className="w-80 md:w-96 lg:w-80 xl:w-96 h-auto rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border-4 border-creamy-white/20"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-forest-green/10 via-transparent to-golden-yellow/10 rounded-3xl"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-golden-yellow via-deep-orange to-forest-green rounded-3xl opacity-20 blur-lg"></div>
              </div>
            </div>
          </div>
        </HighlighterItem>
      </HighlightGroup>
    </section>
  );
};

export default CTABanner;