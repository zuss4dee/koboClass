import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Calendar, 
  DollarSign,
  MessageSquare,
  Eye,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';
import { getPendingClasses, approveClass, rejectClass } from '../api/admin/classes';

interface PendingClass {
  id: string;
  title: string;
  description: string;
  host_id: string;
  category_id: string;
  price: number;
  date_time: string;
  duration_minutes: number;
  cover_image_url?: string;
  created_at: string;
  categories: {
    name: string;
    slug: string;
  };
  users: {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
  };
}

interface AdminClassApprovalProps {
  adminId: string;
  onClassApproved?: (classId: string) => void;
  onClassRejected?: (classId: string) => void;
}

const AdminClassApproval: React.FC<AdminClassApprovalProps> = ({
  adminId,
  onClassApproved,
  onClassRejected
}) => {
  const [pendingClasses, setPendingClasses] = useState<PendingClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingClassId, setProcessingClassId] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<PendingClass | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionNotes, setRejectionNotes] = useState('');

  useEffect(() => {
    loadPendingClasses();
  }, []);

  const loadPendingClasses = async () => {
    setIsLoading(true);
    try {
      const result = await getPendingClasses();
      
      if (result.success && result.data) {
        setPendingClasses(result.data);
      }
    } catch (error) {
      console.error('Error loading pending classes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (classId: string) => {
    setProcessingClassId(classId);
    
    try {
      const result = await approveClass(classId, adminId);
      
      if (result.success) {
        // Remove from pending list
        setPendingClasses(prev => prev.filter(c => c.id !== classId));
        onClassApproved?.(classId);
      } else {
        alert(result.error || 'Failed to approve class');
      }
    } catch (error) {
      console.error('Error approving class:', error);
      alert('An unexpected error occurred');
    } finally {
      setProcessingClassId(null);
    }
  };

  const handleReject = async () => {
    if (!selectedClass) return;
    
    setProcessingClassId(selectedClass.id);
    
    try {
      const result = await rejectClass(selectedClass.id, adminId, rejectionNotes);
      
      if (result.success) {
        // Remove from pending list
        setPendingClasses(prev => prev.filter(c => c.id !== selectedClass.id));
        setShowRejectModal(false);
        setRejectionNotes('');
        setSelectedClass(null);
        onClassRejected?.(selectedClass.id);
      } else {
        alert(result.error || 'Failed to reject class');
      }
    } catch (error) {
      console.error('Error rejecting class:', error);
      alert('An unexpected error occurred');
    } finally {
      setProcessingClassId(null);
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-2 border-deep-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-warm-gray">Loading pending classes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-6 h-6 text-deep-orange" />
        <h2 className="text-2xl font-bold text-charcoal-black">
          Pending Class Approvals
        </h2>
        <span className="bg-golden-yellow text-charcoal-black px-3 py-1 rounded-full text-sm font-medium">
          {pendingClasses.length} pending
        </span>
      </div>

      {pendingClasses.length === 0 ? (
        <div className="text-center py-12 bg-light-sand rounded-2xl">
          <CheckCircle className="w-16 h-16 text-forest-green mx-auto mb-4" />
          <h3 className="text-xl font-bold text-charcoal-black mb-2">All caught up!</h3>
          <p className="text-warm-gray">No classes pending approval at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {pendingClasses.map((classItem) => {
            const { date, time } = formatDateTime(classItem.date_time);
            const isProcessing = processingClassId === classItem.id;
            
            return (
              <div
                key={classItem.id}
                className="bg-creamy-white border border-light-sand rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Class Info */}
                  <div className="lg:col-span-2 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-charcoal-black mb-2">
                          {classItem.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-warm-gray">
                          <span className="bg-deep-orange text-creamy-white px-2 py-1 rounded-full text-xs font-medium">
                            {classItem.categories.name}
                          </span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{date} at {time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{classItem.duration_minutes} mins</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-deep-orange">
                          ₦{(classItem.price / 100).toLocaleString()}
                        </div>
                        <div className="text-sm text-warm-gray">
                          Host earns: ₦{((classItem.price * 0.8) / 100).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Host Info */}
                    <div className="flex items-center gap-3 p-4 bg-light-sand rounded-xl">
                      <div className="w-12 h-12 rounded-full bg-deep-orange flex items-center justify-center">
                        {classItem.users.avatar_url ? (
                          <img 
                            src={classItem.users.avatar_url} 
                            alt={classItem.users.full_name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-creamy-white" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-charcoal-black">
                          {classItem.users.full_name}
                        </h4>
                        <p className="text-sm text-warm-gray">
                          {classItem.users.email}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="font-medium text-charcoal-black mb-2">Class Description:</h4>
                      <p className="text-warm-gray leading-relaxed">
                        {classItem.description}
                      </p>
                    </div>

                    {/* Submission Date */}
                    <div className="text-sm text-warm-gray">
                      <span className="font-medium">Submitted:</span> {new Date(classItem.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-4">
                    <div className="bg-light-sand rounded-xl p-4">
                      <h4 className="font-medium text-charcoal-black mb-3">Review Actions</h4>
                      
                      <div className="space-y-3">
                        <button
                          onClick={() => handleApprove(classItem.id)}
                          disabled={isProcessing}
                          className="w-full flex items-center justify-center gap-2 bg-forest-green text-creamy-white py-3 px-4 rounded-xl font-semibold hover:bg-forest-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isProcessing ? (
                            <>
                              <div className="w-4 h-4 border-2 border-creamy-white/30 border-t-creamy-white rounded-full animate-spin"></div>
                              Approving...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-5 h-5" />
                              Approve Class
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={() => {
                            setSelectedClass(classItem);
                            setShowRejectModal(true);
                          }}
                          disabled={isProcessing}
                          className="w-full flex items-center justify-center gap-2 border border-brick-red text-brick-red py-3 px-4 rounded-xl font-semibold hover:bg-brick-red hover:text-creamy-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <XCircle className="w-5 h-5" />
                          Reject Class
                        </button>
                        
                        <button className="w-full flex items-center justify-center gap-2 bg-light-sand text-charcoal-black py-3 px-4 rounded-xl font-medium hover:bg-golden-yellow/20 transition-colors">
                          <Eye className="w-5 h-5" />
                          Preview Class Page
                        </button>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-creamy-white border border-light-sand rounded-xl p-4">
                      <h4 className="font-medium text-charcoal-black mb-3">Quick Review</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-warm-gray">Title Length:</span>
                          <span className={cn(
                            "font-medium",
                            classItem.title.length >= 5 && classItem.title.length <= 200 
                              ? "text-forest-green" 
                              : "text-brick-red"
                          )}>
                            {classItem.title.length}/200
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-warm-gray">Description:</span>
                          <span className={cn(
                            "font-medium",
                            classItem.description.length >= 20 && classItem.description.length <= 2000 
                              ? "text-forest-green" 
                              : "text-brick-red"
                          )}>
                            {classItem.description.length}/2000
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-warm-gray">Price Range:</span>
                          <span className={cn(
                            "font-medium",
                            classItem.price >= 100000 && classItem.price <= 500000 
                              ? "text-forest-green" 
                              : "text-brick-red"
                          )}>
                            Valid
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-warm-gray">Future Date:</span>
                          <span className={cn(
                            "font-medium",
                            new Date(classItem.date_time) > new Date() 
                              ? "text-forest-green" 
                              : "text-brick-red"
                          )}>
                            {new Date(classItem.date_time) > new Date() ? 'Valid' : 'Past Date'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && selectedClass && (
        <div className="fixed inset-0 bg-charcoal-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-creamy-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-6 h-6 text-brick-red" />
              <h3 className="text-xl font-bold text-charcoal-black">Reject Class</h3>
            </div>
            
            <p className="text-warm-gray mb-4">
              You're about to reject "<strong>{selectedClass.title}</strong>" by {selectedClass.users.full_name}.
            </p>
            
            <div className="space-y-4 mb-6">
              <label className="block text-sm font-medium text-charcoal-black">
                Reason for rejection (optional)
              </label>
              <textarea
                value={rejectionNotes}
                onChange={(e) => setRejectionNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-light-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-deep-orange resize-none"
                placeholder="Provide feedback to help the host improve their class submission..."
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionNotes('');
                  setSelectedClass(null);
                }}
                disabled={processingClassId === selectedClass.id}
                className="flex-1 px-4 py-3 border border-light-sand rounded-xl hover:bg-light-sand transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={processingClassId === selectedClass.id}
                className="flex-1 bg-brick-red text-creamy-white px-4 py-3 rounded-xl hover:bg-brick-red/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processingClassId === selectedClass.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-creamy-white/30 border-t-creamy-white rounded-full animate-spin"></div>
                    Rejecting...
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    Reject Class
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClassApproval;