import React from 'react';
import { Demo } from '../components/Demo';
import Features from '../components/Features';
import ProgramHighlight from '../components/ProgramHighlight';
import CreatorSpotlight from '../components/CreatorSpotlight';
import Partners from '../components/Partners';
import Categories from '../components/Categories';
import Testimonials from '../components/Testimonials';
import CTABanner from '../components/CTABanner';
import Footer from '../components/Footer';
import Header from '../components/Header';

const LandingPage = () => {
  return (
    <>
      <Header />
      <Demo />
      <CreatorSpotlight />
      <Features />
      <Categories />
      <ProgramHighlight />
      <Testimonials />
      <Partners />
      <CTABanner />
      <Footer />
    </>
  );
};

export default LandingPage;