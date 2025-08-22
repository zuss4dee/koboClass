import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';
import { convertToKobo } from '../lib/validation';
import { createClass } from '../api/classes';
import { useAuth } from '../contexts/AuthContext';
import { ClassCreationWizard } from '../components/ui/class-creation-wizard';

interface ClassFormData {
  title: string;
  description: string;
  category: string;
  socialLinks: {
    instagram: string;
    twitter: string;
    linkedin: string;
  };
  date: string;
  time: string;
  duration: number;
  price: number;
  coverImage: File | null;
}

const HostClassPage = () => {
  const navigate = useNavigate();
  const { classId } = useParams();
  const { user, userProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const isEditing = !!classId;

  const handleClassSubmission = async (classData: ClassFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!user || !userProfile) {
        setError('You must be logged in to create a class');
        setIsLoading(false);
        return;
      }

      // Prepare class data for submission
      const submissionData = {
        title: classData.title,
        description: classData.description,
        category: classData.category,
        price: convertToKobo(classData.price),
        date: classData.date,
        time: classData.time,
        duration: classData.duration,
        coverImageUrl: classData.coverImage ? 'placeholder-url' : undefined, // TODO: Implement image upload
        socialLinks: classData.socialLinks
      };

      const result = await createClass(user.id, submissionData);
      
      if (result.success) {
        setSubmitSuccess(true);
        // Navigate to host dashboard after a short delay
        setTimeout(() => {
          navigate('/host-dashboard');
        }, 2000);
      } else {
        setError(result.error || 'Failed to create class. Please try again.');
      }
    } catch (error) {
      console.error('Class creation error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/host-dashboard');
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light-sand via-creamy-white to-golden-yellow/20 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-32 h-32 bg-warm-purple/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-deep-orange/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-golden-yellow/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="w-full max-w-md relative z-10">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-forest-green rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-creamy-white" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-charcoal-black mb-2">Class Submitted Successfully!</h2>
            <p className="text-warm-gray">
              Your class has been submitted for review. We'll notify you once it's approved and live.
            </p>
          </div>
          
          <div className="bg-light-sand rounded-xl p-6">
            <h3 className="font-semibold text-charcoal-black mb-2">What happens next?</h3>
            <ul className="text-sm text-warm-gray space-y-1 text-left">
              <li>• Our team will review your class within 24-48 hours</li>
              <li>• You'll receive an email notification once approved</li>
              <li>• Your Whereby video link will be automatically generated</li>
              <li>• Students can then discover and book your class</li>
            </ul>
          </div>
          
          <Link
            to="/host-dashboard"
            className="inline-flex items-center gap-2 gradient-orange-yellow text-on-gradient px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Go to Host Dashboard
            <ArrowRight className="w-5 h-5" />
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
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link 
              to="/host-dashboard"
              className="flex items-center gap-2 text-charcoal-black hover:text-deep-orange transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">Back to Host Dashboard</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-deep-orange" />
              <span className="text-sm font-medium text-warm-gray">
                {isEditing ? 'Edit Class' : 'Create New Class'}
              </span>
            </div>
          </div>

          {/* Class Creation Wizard */}
          <ClassCreationWizard
            onComplete={handleClassSubmission}
            onCancel={handleCancel}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default HostClassPage;