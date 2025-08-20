import React from 'react';
import { Mail, Twitter, Instagram, Youtube, ArrowRight } from 'lucide-react';

const Footer = () => {
  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contact', href: '#contact' },
    { name: 'Twitter', href: '#twitter' }
  ];

  const socialLinks = [
    { icon: <Twitter className="w-5 h-5" />, href: '#twitter' },
    { icon: <Instagram className="w-5 h-5" />, href: '#instagram' },
    { icon: <Youtube className="w-5 h-5" />, href: '#youtube' }
  ];

  return (
    <footer className="bg-charcoal-black text-creamy-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-12 mb-12">
          {/* Left - Logo and Tagline */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-deep-orange rounded-lg flex items-center justify-center">
                <span className="text-creamy-white font-bold text-lg">K</span>
              </div>
              <span className="text-xl font-bold">KoboClass</span>
            </div>
            <p className="text-light-sand text-lg">
              Real Skills. Real People. Real Pay.
            </p>
            <p className="text-warm-gray">
              Connecting Nigerian creatives to build, learn, and earn together.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-warm-gray/20 rounded-lg flex items-center justify-center hover:bg-deep-orange transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Center - Navigation */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="space-y-4">
              {navLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.href}
                  className="block text-light-sand hover:text-creamy-white transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Right - Newsletter */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Stay in the Loop</h3>
            <p className="text-light-sand">
              Get the latest updates on new classes and features.
            </p>
            <form className="space-y-4">
              <div className="flex">
                <input 
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-warm-gray/20 border border-warm-gray/30 rounded-l-lg px-4 py-3 text-creamy-white placeholder-warm-gray focus:outline-none focus:border-deep-orange"
                />
                <button 
                  type="submit"
                  className="bg-deep-orange hover:bg-brick-red px-6 py-3 rounded-r-lg transition-colors flex items-center"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom - Copyright */}
        <div className="border-t border-warm-gray/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-warm-gray">
              © 2024 KoboClass. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#privacy" className="text-warm-gray hover:text-creamy-white transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="text-warm-gray hover:text-creamy-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;