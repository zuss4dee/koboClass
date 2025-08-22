import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  Calendar, 
  Clock, 
  DollarSign, 
  CheckCircle,
  Instagram,
  Twitter,
  Linkedin,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
  Eye,
  Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CATEGORIES, PRICE_LIMITS, DURATION_LIMITS, COMMISSION_RATES } from '@/lib/constants';
import { validatePrice, validateDuration, convertToKobo, convertFromKobo } from '@/lib/validation';

interface ClassData {
  title: string;
  description: string;
  category: string;
  coverImage: File | null;
  socialLinks: {
    instagram: string;
    twitter: string;
    linkedin: string;
  };
  date: string;
  time: string;
  duration: number;
  price: number;
}

interface FormErrors {
  title?: string;
  description?: string;
  category?: string;
  coverImage?: string;
  date?: string;
  time?: string;
  price?: string;
  general?: string;
}

interface ClassCreationWizardProps {
  onComplete: (classData: ClassData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string;
}

export const ClassCreationWizard: React.FC<ClassCreationWizardProps> = ({
  onComplete,
  onCancel,
  isLoading = false,
  error
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [classData, setClassData] = useState<ClassData>({
    title: '',
    description: '',
    category: '',
    coverImage: null,
    socialLinks: {
      instagram: '',
      twitter: '',
      linkedin: ''
    },
    date: '',
    time: '',
    duration: DURATION_LIMITS.DEFAULT_MINUTES,
    price: PRICE_LIMITS.MIN_NAIRA * 2.5
  });

  const steps = [
    { number: 1, title: 'Class Details', description: 'Basic information about your class' },
    { number: 2, title: 'Schedule', description: 'When will you host this class?' },
    { number: 3, title: 'Set Price', description: 'How much will you charge?' },
    { number: 4, title: 'Review', description: 'Review and publish your class' }
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!classData.title.trim()) {
        newErrors.title = 'Class title is required';
      } else if (classData.title.length < 5 || classData.title.length > 200) {
        newErrors.title = 'Title must be between 5 and 200 characters';
      }
      
      if (!classData.description.trim()) {
        newErrors.description = 'Description is required';
      } else if (classData.description.length < 20 || classData.description.length > 2000) {
        newErrors.description = 'Description must be between 20 and 2000 characters';
      }
      
      if (!classData.category) {
        newErrors.category = 'Please select a category';
      }
    }

    if (step === 2) {
      if (!classData.date) {
        newErrors.date = 'Please select a date';
      } else {
        const selectedDate = new Date(`${classData.date}T${classData.time || '00:00'}`);
        if (selectedDate <= new Date()) {
          newErrors.date = 'Class date must be in the future';
        }
      }
      
      if (!classData.time) {
        newErrors.time = 'Please select a time';
      }
    }

    if (step === 3) {
      if (!validatePrice(convertToKobo(classData.price))) {
        newErrors.price = `Price must be between ₦${PRICE_LIMITS.MIN_NAIRA.toLocaleString()} and ₦${PRICE_LIMITS.MAX_NAIRA.toLocaleString()}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setClassData(prev => ({ ...prev, coverImage: file }));
    }
  };

  const handlePublish = () => {
    if (validateStep(4)) {
      onComplete(classData);
    }
  };

  const calculateEarnings = (price: number) => {
    const hostShare = price * COMMISSION_RATES.HOST_SHARE;
    const platformFee = price * COMMISSION_RATES.PLATFORM_FEE;
    return { hostShare, platformFee };
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
            currentStep >= step.number
              ? "bg-deep-orange text-creamy-white shadow-lg"
              : "bg-light-sand text-warm-gray"
          )}>
            {currentStep > step.number ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              step.number
            )}
          </div>
          {index < steps.length - 1 && (
            <div className={cn(
              "w-16 h-1 mx-2 transition-all duration-300",
              currentStep > step.number ? "bg-deep-orange" : "bg-light-sand"
            )} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-charcoal-black mb-2">Class Details</h2>
        <p className="text-warm-gray">Tell us about your amazing class</p>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-charcoal-black">
          Class Title *
        </label>
        <input
          type="text"
          value={classData.title}
          onChange={(e) => setClassData(prev => ({ ...prev, title: e.target.value }))}
          className={cn(
            "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-deep-orange transition-colors",
            errors.title ? "border-brick-red" : "border-light-sand"
          )}
          placeholder="e.g., Master Professional Makeup Artistry"
        />
        {errors.title && <p className="text-brick-red text-sm">{errors.title}</p>}
        <p className="text-xs text-warm-gray">{classData.title.length}/200 characters</p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-charcoal-black">
          Description *
        </label>
        <textarea
          value={classData.description}
          onChange={(e) => setClassData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          className={cn(
            "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-deep-orange transition-colors resize-none",
            errors.description ? "border-brick-red" : "border-light-sand"
          )}
          placeholder="Describe what students will learn in your class..."
        />
        {errors.description && <p className="text-brick-red text-sm">{errors.description}</p>}
        <p className="text-xs text-warm-gray">{classData.description.length}/2000 characters</p>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-charcoal-black">
          Category *
        </label>
        <div className="grid grid-cols-3 gap-3">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setClassData(prev => ({ ...prev, category }))}
              className={cn(
                "px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                classData.category === category
                  ? "bg-deep-orange text-creamy-white shadow-lg"
                  : "bg-light-sand text-charcoal-black hover:bg-golden-yellow/20"
              )}
            >
              {category}
            </button>
          ))}
        </div>
        {errors.category && <p className="text-brick-red text-sm">{errors.category}</p>}
      </div>

      {/* Cover Image */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-charcoal-black">
          Cover Image (Optional)
        </label>
        <div className="border-2 border-dashed border-light-sand rounded-xl p-8 text-center hover:border-deep-orange transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="cover-image"
          />
          <label htmlFor="cover-image" className="cursor-pointer">
            <ImageIcon className="w-12 h-12 text-warm-gray mx-auto mb-4" />
            <p className="text-charcoal-black font-medium mb-2">
              {classData.coverImage ? classData.coverImage.name : 'Upload Cover Image'}
            </p>
            <p className="text-warm-gray text-sm">PNG, JPG up to 5MB</p>
          </label>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-charcoal-black mb-2">Schedule Your Class</h2>
        <p className="text-warm-gray">When will you host this amazing class?</p>
      </div>

      {/* Date */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-charcoal-black">
          Date *
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-warm-gray" />
          <input
            type="date"
            value={classData.date}
            onChange={(e) => setClassData(prev => ({ ...prev, date: e.target.value }))}
            min={new Date().toISOString().split('T')[0]}
            className={cn(
              "w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-deep-orange",
              errors.date ? "border-brick-red" : "border-light-sand"
            )}
          />
        </div>
        {errors.date && <p className="text-brick-red text-sm">{errors.date}</p>}
      </div>

      {/* Time */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-charcoal-black">
          Time *
        </label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-warm-gray" />
          <input
            type="time"
            value={classData.time}
            onChange={(e) => setClassData(prev => ({ ...prev, time: e.target.value }))}
            className={cn(
              "w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-deep-orange",
              errors.time ? "border-brick-red" : "border-light-sand"
            )}
          />
        </div>
        {errors.time && <p className="text-brick-red text-sm">{errors.time}</p>}
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-charcoal-black">
          Duration (minutes)
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[60, 90, 120].map((duration) => (
            <button
              key={duration}
              type="button"
              onClick={() => setClassData(prev => ({ ...prev, duration }))}
              className={cn(
                "px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                classData.duration === duration
                  ? "bg-deep-orange text-creamy-white shadow-lg"
                  : "bg-light-sand text-charcoal-black hover:bg-golden-yellow/20"
              )}
            >
              {duration} mins
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-light-sand rounded-xl p-6 mt-8">
        <h3 className="font-semibold text-charcoal-black mb-4">Class Schedule Preview</h3>
        <div className="space-y-2 text-sm">
          <p><span className="font-medium">Date:</span> {classData.date || 'Not selected'}</p>
          <p><span className="font-medium">Time:</span> {classData.time || 'Not selected'}</p>
          <p><span className="font-medium">Duration:</span> {classData.duration} minutes</p>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => {
    const { hostShare, platformFee } = calculateEarnings(classData.price);
    
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-charcoal-black mb-2">Set Your Ticket Price</h2>
          <p className="text-warm-gray">How much will you charge for this class?</p>
        </div>

        {/* Price Slider */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-charcoal-black">
            Ticket Price
          </label>
          <div className="text-center mb-4">
            <span className="text-4xl font-bold text-deep-orange">₦{classData.price.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="1000"
            max="5000"
            step="100"
            value={classData.price}
            onChange={(e) => setClassData(prev => ({ ...prev, price: parseInt(e.target.value) }))}
            className="w-full h-2 bg-light-sand rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-sm text-warm-gray">
            <span>₦1,000</span>
            <span>₦5,000</span>
          </div>
        </div>

        {/* Earnings Breakdown */}
        <div className="bg-light-sand rounded-xl p-6">
          <h3 className="font-semibold text-charcoal-black mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-deep-orange" />
            Earnings Breakdown
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-charcoal-black">Ticket Price</span>
              <span className="font-semibold">₦{classData.price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-warm-gray">Platform Fee (20%)</span>
              <span className="text-warm-gray">-₦{platformFee.toLocaleString()}</span>
            </div>
            <hr className="border-warm-gray/30" />
            <div className="flex justify-between items-center">
              <span className="font-semibold text-charcoal-black">You Earn (80%)</span>
              <span className="font-bold text-forest-green text-lg">₦{hostShare.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Price Suggestions */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-charcoal-black">
            Quick Price Options
          </label>
          <div className="grid grid-cols-4 gap-3">
            {[1500, 2000, 2500, 3000].map((price) => (
              <button
                key={price}
                type="button"
                onClick={() => setClassData(prev => ({ ...prev, price }))}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                  classData.price === price
                    ? "bg-deep-orange text-creamy-white shadow-lg"
                    : "bg-creamy-white border border-light-sand text-charcoal-black hover:border-deep-orange"
                )}
              >
                ₦{price.toLocaleString()}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-charcoal-black mb-2">Ready to Publish!</h2>
        <p className="text-warm-gray">Review your class details before publishing</p>
      </div>

      {/* General Error */}
      {error && (
        <div className="bg-brick-red/10 border border-brick-red/30 rounded-lg p-3 flex items-center gap-2 mb-6">
          <AlertCircle className="w-5 h-5 text-brick-red" />
          <span className="text-brick-red font-medium">{error}</span>
        </div>
      )}

      {/* Class Preview */}
      <div className="bg-creamy-white border border-light-sand rounded-2xl p-6 shadow-lg">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 bg-light-sand rounded-xl flex items-center justify-center">
            {classData.coverImage ? (
              <img 
                src={URL.createObjectURL(classData.coverImage)} 
                alt="Cover" 
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <ImageIcon className="w-8 h-8 text-warm-gray" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-charcoal-black mb-2">{classData.title}</h3>
            <p className="text-warm-gray text-sm mb-2">{classData.description}</p>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-deep-orange text-creamy-white px-2 py-1 rounded-full text-xs font-medium">
                {classData.category}
              </span>
              <span className="text-sm text-warm-gray">
                {classData.duration} minutes
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-light-sand">
          <div className="text-sm text-warm-gray">
            {classData.date} at {classData.time}
          </div>
          <div className="text-2xl font-bold text-deep-orange">
            ₦{classData.price.toLocaleString()}
          </div>
        </div>
      </div>

      {/* What Happens Next */}
      <div className="bg-light-sand rounded-xl p-6">
        <h3 className="font-semibold text-charcoal-black mb-4">What happens next?</h3>
        <ul className="space-y-2 text-sm text-warm-gray">
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-forest-green" />
            Your class will be submitted for review
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-forest-green" />
            We'll review it within 24-48 hours
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-forest-green" />
            Once approved, students can discover and book your class
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-forest-green" />
            You'll receive a Whereby video link for hosting
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button className="flex items-center justify-center gap-2 px-6 py-3 border border-light-sand rounded-xl text-charcoal-black hover:bg-light-sand transition-colors">
          <Eye className="w-5 h-5" />
          Preview Class Page
        </button>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-forest-green text-creamy-white rounded-xl hover:bg-forest-green/90 transition-colors">
          <Share2 className="w-5 h-5" />
          Get Shareable Link
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Step Content */}
      <div className="bg-creamy-white/70 backdrop-blur-sm border border-light-sand/50 rounded-3xl p-8 shadow-2xl">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-light-sand">
          <button
            onClick={currentStep === 1 ? onCancel : handlePrevious}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300",
              "text-charcoal-black hover:bg-light-sand"
            )}
          >
            <ArrowLeft className="w-5 h-5" />
            {currentStep === 1 ? 'Cancel' : 'Previous'}
          </button>

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 gradient-orange-yellow text-on-gradient px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handlePublish}
              disabled={isLoading}
              className="flex items-center gap-2 bg-forest-green text-creamy-white px-8 py-3 rounded-xl font-semibold hover:bg-forest-green/90 hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-creamy-white/30 border-t-creamy-white rounded-full animate-spin"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Publish Class
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #D9572B;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(217, 87, 43, 0.3);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #D9572B;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(217, 87, 43, 0.3);
        }
      `}</style>
    </div>
  );
};