import React, { useState, useEffect } from 'react';
import { Bell, X, Clock, Star, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface Notification {
  id: string;
  type: 'reminder' | 'final-call' | 'rating' | 'general';
  title: string;
  message: string;
  classId?: string;
  className?: string;
  hostName?: string;
  time?: string;
  timestamp: Date;
  read: boolean;
  actionRequired?: boolean;
}

interface NotificationSystemProps {
  className?: string;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ className }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock notifications - in real app, these would come from your backend/push service
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'final-call',
      title: '⏰ Final Call - Class Starting Soon!',
      message: 'Master Professional Makeup Artistry starts in 10 minutes. Join now!',
      classId: '1',
      className: 'Master Professional Makeup Artistry',
      hostName: 'Chioma Okeke',
      time: '7:00 PM',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      read: false,
      actionRequired: true
    },
    {
      id: '2',
      type: 'reminder',
      title: '🔔 Class Reminder',
      message: 'Build Your First Website in 2 Hours starts in 1 hour. Get ready!',
      classId: '2',
      className: 'Build Your First Website in 2 Hours',
      hostName: 'Ibrahim Sule',
      time: '6:00 PM',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      read: false,
      actionRequired: false
    },
    {
      id: '3',
      type: 'rating',
      title: '⭐ Rate Your Experience',
      message: 'How was your Music Production Masterclass? Share your feedback!',
      classId: '3',
      className: 'Music Production Masterclass',
      hostName: 'Tunde Bakare',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      actionRequired: true
    },
    {
      id: '4',
      type: 'general',
      title: '🎉 Welcome to KoboClass!',
      message: 'Explore amazing classes and start your learning journey today.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      read: true,
      actionRequired: false
    }
  ];

  useEffect(() => {
    // Initialize with mock notifications
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);

    // Simulate receiving new notifications
    const interval = setInterval(() => {
      // In real app, this would be handled by your push notification service
      // For demo, we'll occasionally add a new notification
      if (Math.random() > 0.95) { // 5% chance every interval
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: 'reminder',
          title: '🔔 New Class Available',
          message: 'A new class has been added to your interests!',
          timestamp: new Date(),
          read: false,
          actionRequired: false
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const removeNotification = (notificationId: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'reminder':
        return <Clock className="w-5 h-5 text-deep-orange" />;
      case 'final-call':
        return <AlertCircle className="w-5 h-5 text-brick-red" />;
      case 'rating':
        return <Star className="w-5 h-5 text-golden-yellow" />;
      default:
        return <Bell className="w-5 h-5 text-forest-green" />;
    }
  };

  const getNotificationStyle = (type: Notification['type']) => {
    switch (type) {
      case 'final-call':
        return 'border-l-4 border-brick-red bg-brick-red/5';
      case 'reminder':
        return 'border-l-4 border-deep-orange bg-deep-orange/5';
      case 'rating':
        return 'border-l-4 border-golden-yellow bg-golden-yellow/5';
      default:
        return 'border-l-4 border-forest-green bg-forest-green/5';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleNotificationAction = (notification: Notification) => {
    if (notification.type === 'final-call' && notification.classId) {
      // Navigate to live class
      window.location.href = `/class/${notification.classId}/live`;
    } else if (notification.type === 'rating' && notification.classId) {
      // Navigate to rating page
      window.location.href = `/class/${notification.classId}/rating`;
    }
    markAsRead(notification.id);
  };

  return (
    <div className={cn("relative", className)}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-warm-gray hover:text-deep-orange transition-colors rounded-lg hover:bg-light-sand"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-brick-red text-creamy-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Notification Panel */}
          <div className="absolute right-0 top-12 w-96 max-w-[90vw] bg-creamy-white border border-light-sand rounded-2xl shadow-2xl z-50 max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-light-sand bg-light-sand">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-charcoal-black flex items-center gap-2">
                  <Bell className="w-5 h-5 text-deep-orange" />
                  Notifications
                </h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-deep-orange hover:text-brick-red font-medium transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-warm-gray hover:text-charcoal-black transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-warm-gray mx-auto mb-4 opacity-50" />
                  <p className="text-warm-gray">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-light-sand">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 hover:bg-light-sand/50 transition-colors cursor-pointer",
                        !notification.read && "bg-creamy-white",
                        getNotificationStyle(notification.type)
                      )}
                      onClick={() => {
                        if (notification.actionRequired) {
                          handleNotificationAction(notification);
                        } else {
                          markAsRead(notification.id);
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={cn(
                              "text-sm font-semibold text-charcoal-black line-clamp-1",
                              !notification.read && "font-bold"
                            )}>
                              {notification.title}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                              }}
                              className="text-warm-gray hover:text-brick-red transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <p className="text-sm text-warm-gray mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          
                          {notification.className && (
                            <div className="flex items-center gap-2 mt-2 text-xs text-deep-orange">
                              <Calendar className="w-3 h-3" />
                              <span>{notification.className}</span>
                              {notification.time && (
                                <span className="text-warm-gray">• {notification.time}</span>
                              )}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-warm-gray">
                              {formatTime(notification.timestamp)}
                            </span>
                            
                            {notification.actionRequired && (
                              <span className="text-xs bg-deep-orange text-creamy-white px-2 py-1 rounded-full font-medium">
                                Action Required
                              </span>
                            )}
                            
                            {!notification.read && (
                              <div className="w-2 h-2 bg-deep-orange rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-light-sand bg-light-sand">
                <button className="w-full text-center text-sm text-deep-orange hover:text-brick-red font-medium transition-colors">
                  View All Notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationSystem;