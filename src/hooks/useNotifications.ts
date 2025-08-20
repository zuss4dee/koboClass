import { useState, useEffect, useCallback } from 'react';

interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

interface PushNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  data?: any;
}

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>({
    granted: false,
    denied: false,
    default: true
  });
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    setIsSupported('Notification' in window);

    if ('Notification' in window) {
      const currentPermission = Notification.permission;
      setPermission({
        granted: currentPermission === 'granted',
        denied: currentPermission === 'denied',
        default: currentPermission === 'default'
      });
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      console.warn('Notifications are not supported in this browser');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      const newPermission = {
        granted: result === 'granted',
        denied: result === 'denied',
        default: result === 'default'
      };
      
      setPermission(newPermission);
      return newPermission.granted;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, [isSupported]);

  const showNotification = useCallback((options: PushNotificationOptions) => {
    if (!permission.granted) {
      console.warn('Notification permission not granted');
      return null;
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/favicon.ico',
        badge: options.badge || '/favicon.ico',
        tag: options.tag,
        requireInteraction: options.requireInteraction || false,
        data: options.data
      });

      // Handle notification click
      notification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        
        // Handle custom actions based on notification data
        if (options.data?.action === 'join-class' && options.data?.classId) {
          window.location.href = `/class/${options.data.classId}/live`;
        } else if (options.data?.action === 'rate-class' && options.data?.classId) {
          // Open rating modal or navigate to rating page
          console.log('Open rating for class:', options.data.classId);
        }
        
        notification.close();
      };

      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
      return null;
    }
  }, [permission.granted]);

  // Predefined notification templates
  const showClassReminder = useCallback((classData: {
    id: string;
    title: string;
    hostName: string;
    time: string;
    minutesUntil: number;
  }) => {
    const isUrgent = classData.minutesUntil <= 10;
    
    return showNotification({
      title: isUrgent ? '⏰ Final Call - Class Starting Soon!' : '🔔 Class Reminder',
      body: `${classData.title} with ${classData.hostName} starts ${isUrgent ? 'in 10 minutes' : 'in 1 hour'}`,
      icon: '/favicon.ico',
      tag: `class-reminder-${classData.id}`,
      requireInteraction: isUrgent,
      data: {
        action: 'join-class',
        classId: classData.id,
        type: isUrgent ? 'final-call' : 'reminder'
      }
    });
  }, [showNotification]);

  const showRatingRequest = useCallback((classData: {
    id: string;
    title: string;
    hostName: string;
  }) => {
    return showNotification({
      title: '⭐ Rate Your Experience',
      body: `How was "${classData.title}" with ${classData.hostName}? Share your feedback!`,
      icon: '/favicon.ico',
      tag: `rating-request-${classData.id}`,
      requireInteraction: true,
      data: {
        action: 'rate-class',
        classId: classData.id,
        type: 'rating'
      }
    });
  }, [showNotification]);

  return {
    isSupported,
    permission,
    requestPermission,
    showNotification,
    showClassReminder,
    showRatingRequest
  };
};