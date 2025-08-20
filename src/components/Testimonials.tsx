import React from 'react';
import { TestimonialsSection } from '@/components/ui/testimonials-with-marquee';

const Testimonials = () => {
  const testimonials = [
    {
      author: {
        name: "Teni Adebayo",
        handle: "Host (Design Class)",
        avatar: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face"
      },
      text: "I made ₦18,000 in one weekend teaching what I love. KoboClass changed my life!"
    },
    {
      author: {
        name: "Samuel Okafor",
        handle: "Learner (Video Editing)",
        avatar: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face"
      },
      text: "Finally took a class I could afford. Best ₦1,500 ever spent. The instructor was amazing!"
    },
    {
      author: {
        name: "Chioma Okeke",
        handle: "Host (Makeup Class)",
        avatar: "https://images.pexels.com/photos/3184334/pexels-photo-3184334.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face"
      },
      text: "The community here is amazing. Real people sharing real skills. I've learned so much!"
    },
    {
      author: {
        name: "Ibrahim Sule",
        handle: "Learner (Tech Skills)",
        avatar: "https://images.pexels.com/photos/3184301/pexels-photo-3184301.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face"
      },
      text: "From zero to hero in web development. The live classes made all the difference."
    },
    {
      author: {
        name: "Fatima Hassan",
        handle: "Host (Business Coach)",
        avatar: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face"
      },
      text: "Teaching on KoboClass has been incredibly rewarding. The students are so engaged!"
    },
    {
      author: {
        name: "Kemi Adeyemi",
        handle: "Learner (Photography)",
        avatar: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face"
      },
      text: "The photography class transformed my Instagram game. Now I'm getting paid gigs!"
    }
  ];

  return (
    <TestimonialsSection
      title="What Our Community Says"
      description="Real stories from real people building their futures"
      testimonials={testimonials}
      className="py-16 bg-light-sand"
    />
  );
};

export default Testimonials;