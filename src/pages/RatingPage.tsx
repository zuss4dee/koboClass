import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Send, 
  Heart, 
  UserPlus, 
  CheckCircle,
  Sparkles,
  MessageCircle,
  ThumbsUp
} from 'lucide-react';
import { cn } from '../lib/utils';

const RatingPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock class data - in real app, fetch based on classId
  const classData = {
    id: classId,
    title: "Master Professional Makeup Artistry",
    hostName: "Chioma Okeke",
    hostImage: "https://images.pexels.com/photos/3184334/pexels-photo-3184334.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
    duration: "90 minutes",
    category: "Creative",
    hostFollowers: 1247,
    hostClasses: 23
  };

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating: number) => {
    setHoveredRating(starRating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Auto redirect after 3 seconds
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return "Poor";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Very Good";
      case 5: return "Excellent";
      default: return "Rate this class";
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating <= 2) return "text-brick-red";
    if (rating === 3) return "text-deep-orange";
    if (rating === 4) return "text-golden-yellow";
    return "text-forest-green";
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light-sand via-creamy-white to-golden-yellow/20 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-32 h-32 bg-warm-purple/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-deep-orange/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-golden-yellow/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="w-full max-w-md relative z-10 text-center">
          <div className="bg-creamy-white/70 backdrop-blur-sm border border-light-sand/50 rounded-3xl p-8 shadow-2xl">
            <div className="w-20 h-20 bg-forest-green rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-creamy-white" />
            </div>
            
            <h1 className="text-2xl font-bold text-charcoal-black mb-4">
              Thank You for Your Feedback!
            </h1>
            
            <p className="text-warm-gray mb-6">
              Your rating helps other learners discover amazing classes and helps {classData.hostName} improve their teaching.
            </p>

            <div className="flex items-center justify-center gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "w-6 h-6 transition-colors duration-300",
                    star <= rating ? "text-golden-yellow fill-current" : "text-light-sand"
                  )}
                />
              ))}
              <span className={cn("ml-2 font-semibold", getRatingColor(rating))}>
                {getRatingText(rating)}
              </span>
            </div>

            <p className="text-sm text-warm-gray mb-6">
              Redirecting to dashboard in a few seconds...
            </p>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 gradient-orange-yellow text-on-gradient px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Back to Dashboard
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-sand via-creamy-white to-golden-yellow/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-warm-purple/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-deep-orange/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-golden-yellow/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link 
              to="/dashboard"
              className="flex items-center gap-2 text-charcoal-black hover:text-deep-orange transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">Back to Dashboard</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-deep-orange" />
              <span className="text-sm font-medium text-warm-gray">Rate Your Experience</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-creamy-white/70 backdrop-blur-sm border border-light-sand/50 rounded-3xl p-8 shadow-2xl">
            {/* Class Summary */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-4 mb-6">
                <img
                  src={classData.hostImage}
                  alt={classData.hostName}
                  className="w-16 h-16 rounded-full object-cover border-3 border-light-sand shadow-lg"
                />
                <div className="text-left">
                  <h1 className="text-2xl font-bold text-charcoal-black mb-1">
                    {classData.title}
                  </h1>
                  <p className="text-warm-gray">
                    with {classData.hostName} • {classData.duration}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Rating Section */}
              <div className="text-center">
                <h2 className="text-xl font-bold text-charcoal-black mb-4">
                  How would you rate this class?
                </h2>
                
                <div className="flex items-center justify-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => handleStarHover(star)}
                      onMouseLeave={handleStarLeave}
                      className="transition-all duration-300 hover:scale-125 focus:outline-none focus:scale-125"
                    >
                      <Star
                        className={cn(
                          "w-12 h-12 transition-all duration-300",
                          star <= (hoveredRating || rating)
                            ? "text-golden-yellow fill-current drop-shadow-lg"
                            : "text-light-sand hover:text-golden-yellow/50"
                        )}
                      />
                    </button>
                  ))}
                </div>
                
                <p className={cn(
                  "text-lg font-semibold transition-colors duration-300",
                  rating > 0 ? getRatingColor(rating) : "text-warm-gray"
                )}>
                  {getRatingText(hoveredRating || rating)}
                </p>
              </div>

              {/* Feedback Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-charcoal-black">
                  Share your thoughts (optional)
                </label>
                <div className="relative">
                  <MessageCircle className="absolute top-3 left-3 w-5 h-5 text-warm-gray" />
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                    className="w-full pl-12 pr-4 py-3 border border-light-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-deep-orange focus:border-deep-orange transition-colors resize-none bg-creamy-white"
                    placeholder="What did you love about this class? Any suggestions for improvement?"
                  />
                </div>
                <p className="text-xs text-warm-gray">
                  Your feedback helps {classData.hostName} improve their classes and helps other learners make informed decisions.
                </p>
              </div>

              {/* Follow Host Section */}
              <div className="bg-light-sand rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={classData.hostImage}
                      alt={classData.hostName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-deep-orange"
                    />
                    <div>
                      <h3 className="font-semibold text-charcoal-black">{classData.hostName}</h3>
                      <p className="text-sm text-warm-gray">
                        {classData.hostClasses} classes • {classData.hostFollowers.toLocaleString()} followers
                      </p>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleFollow}
                    className={cn(
                      "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105",
                      isFollowing
                        ? "bg-forest-green text-creamy-white"
                        : "bg-deep-orange text-creamy-white hover:bg-brick-red"
                    )}
                  >
                    {isFollowing ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Follow Host
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={rating === 0 || isSubmitting}
                className="w-full gradient-orange-yellow text-on-gradient py-4 px-6 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-deep-orange/25 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-creamy-white/30 border-t-creamy-white rounded-full animate-spin"></div>
                    Submitting Rating...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Rating
                  </>
                )}
              </button>
            </form>

            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-light-sand">
              <div className="flex items-center justify-center gap-4 text-sm">
                <Link 
                  to="/dashboard" 
                  className="text-warm-gray hover:text-deep-orange transition-colors"
                >
                  Skip for now
                </Link>
                <span className="text-light-sand">•</span>
                <button className="text-warm-gray hover:text-deep-orange transition-colors">
                  Report an issue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingPage;