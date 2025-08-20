import React from 'react';

// Email template components for server-side rendering
// These would typically be used with a service like React Email or similar

interface ClassReminderEmailProps {
  studentName: string;
  className: string;
  hostName: string;
  classTime: string;
  classDate: string;
  joinLink: string;
  reminderType: '1hour' | '10min';
}

export const ClassReminderEmail: React.FC<ClassReminderEmailProps> = ({
  studentName,
  className,
  hostName,
  classTime,
  classDate,
  joinLink,
  reminderType
}) => {
  const isUrgent = reminderType === '10min';
  
  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#FAF4EC',
      color: '#1F1F1F'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: isUrgent ? '#C1440E' : '#D9572B',
        padding: '24px',
        textAlign: 'center' as const
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '16px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#FAF4EC',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '18px',
            color: '#D9572B'
          }}>
            K
          </div>
          <span style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#FAF4EC'
          }}>
            KoboClass
          </span>
        </div>
        
        <h1 style={{
          fontSize: isUrgent ? '28px' : '24px',
          fontWeight: 'bold',
          color: '#FAF4EC',
          margin: '0',
          marginBottom: '8px'
        }}>
          {isUrgent ? '⏰ Final Call!' : '🔔 Class Reminder'}
        </h1>
        
        <p style={{
          fontSize: '16px',
          color: '#FAF4EC',
          margin: '0',
          opacity: 0.9
        }}>
          {isUrgent 
            ? 'Your class is starting in 10 minutes!' 
            : 'Your class is starting in 1 hour'
          }
        </p>
      </div>

      {/* Content */}
      <div style={{ padding: '32px 24px' }}>
        <p style={{
          fontSize: '18px',
          marginBottom: '24px',
          color: '#1F1F1F'
        }}>
          Hi {studentName},
        </p>

        <div style={{
          backgroundColor: '#F6E6CE',
          border: `3px solid ${isUrgent ? '#C1440E' : '#D9572B'}`,
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#1F1F1F',
            margin: '0 0 16px 0'
          }}>
            {className}
          </h2>
          
          <div style={{ marginBottom: '16px' }}>
            <p style={{
              margin: '0 0 8px 0',
              color: '#8C8C8C',
              fontSize: '14px'
            }}>
              <strong>Host:</strong> {hostName}
            </p>
            <p style={{
              margin: '0 0 8px 0',
              color: '#8C8C8C',
              fontSize: '14px'
            }}>
              <strong>Date:</strong> {classDate}
            </p>
            <p style={{
              margin: '0',
              color: '#8C8C8C',
              fontSize: '14px'
            }}>
              <strong>Time:</strong> {classTime}
            </p>
          </div>

          <a
            href={joinLink}
            style={{
              display: 'inline-block',
              backgroundColor: isUrgent ? '#C1440E' : '#D9572B',
              color: '#FAF4EC',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '16px',
              marginTop: '16px'
            }}
          >
            {isUrgent ? '🚀 Join Now!' : '📚 Join Class'}
          </a>
        </div>

        <div style={{
          backgroundColor: '#2C6E49',
          color: '#FAF4EC',
          padding: '16px',
          borderRadius: '12px',
          marginBottom: '24px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            margin: '0 0 8px 0'
          }}>
            💡 Quick Tips:
          </h3>
          <ul style={{
            margin: '0',
            paddingLeft: '20px',
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            <li>Join 5 minutes early to test your connection</li>
            <li>Have a notebook ready for taking notes</li>
            <li>Prepare any questions you'd like to ask</li>
          </ul>
        </div>

        <p style={{
          fontSize: '16px',
          color: '#1F1F1F',
          lineHeight: '1.6'
        }}>
          We're excited to see you in class! If you have any questions, feel free to reach out to our support team.
        </p>

        <p style={{
          fontSize: '16px',
          color: '#1F1F1F',
          marginTop: '24px'
        }}>
          Happy learning! 🌟<br />
          <strong>The KoboClass Team</strong>
        </p>
      </div>

      {/* Footer */}
      <div style={{
        backgroundColor: '#1F1F1F',
        color: '#FAF4EC',
        padding: '24px',
        textAlign: 'center' as const,
        fontSize: '14px'
      }}>
        <p style={{ margin: '0 0 16px 0' }}>
          © 2024 KoboClass. All rights reserved.
        </p>
        <p style={{ margin: '0', opacity: 0.7 }}>
          Real Skills. Real People. Real Pay.
        </p>
      </div>
    </div>
  );
};

interface RatingRequestEmailProps {
  studentName: string;
  className: string;
  hostName: string;
  ratingLink: string;
}

export const RatingRequestEmail: React.FC<RatingRequestEmailProps> = ({
  studentName,
  className,
  hostName,
  ratingLink
}) => {
  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#FAF4EC',
      color: '#1F1F1F'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#F4B400',
        padding: '24px',
        textAlign: 'center' as const
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '16px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#FAF4EC',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '18px',
            color: '#D9572B'
          }}>
            K
          </div>
          <span style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1F1F1F'
          }}>
            KoboClass
          </span>
        </div>
        
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1F1F1F',
          margin: '0',
          marginBottom: '8px'
        }}>
          ⭐ How was your class?
        </h1>
        
        <p style={{
          fontSize: '16px',
          color: '#1F1F1F',
          margin: '0',
          opacity: 0.8
        }}>
          Share your experience and help others learn
        </p>
      </div>

      {/* Content */}
      <div style={{ padding: '32px 24px' }}>
        <p style={{
          fontSize: '18px',
          marginBottom: '24px',
          color: '#1F1F1F'
        }}>
          Hi {studentName},
        </p>

        <p style={{
          fontSize: '16px',
          color: '#1F1F1F',
          lineHeight: '1.6',
          marginBottom: '24px'
        }}>
          Thank you for attending <strong>{className}</strong> with {hostName}! 
          We hope you had an amazing learning experience.
        </p>

        <div style={{
          backgroundColor: '#F6E6CE',
          border: '3px solid #F4B400',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          textAlign: 'center' as const
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#1F1F1F',
            margin: '0 0 16px 0'
          }}>
            Rate Your Experience
          </h2>
          
          <p style={{
            fontSize: '16px',
            color: '#8C8C8C',
            margin: '0 0 24px 0'
          }}>
            Your feedback helps us improve and helps other learners choose the best classes
          </p>

          <a
            href={ratingLink}
            style={{
              display: 'inline-block',
              backgroundColor: '#F4B400',
              color: '#1F1F1F',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            ⭐ Rate & Review
          </a>
        </div>

        <div style={{
          backgroundColor: '#2C6E49',
          color: '#FAF4EC',
          padding: '16px',
          borderRadius: '12px',
          marginBottom: '24px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            margin: '0 0 8px 0'
          }}>
            🎯 Keep Learning:
          </h3>
          <p style={{
            margin: '0',
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            Explore more classes from {hostName} and other amazing Nigerian creators. 
            Your learning journey is just getting started!
          </p>
        </div>

        <p style={{
          fontSize: '16px',
          color: '#1F1F1F',
          marginTop: '24px'
        }}>
          Keep growing! 🚀<br />
          <strong>The KoboClass Team</strong>
        </p>
      </div>

      {/* Footer */}
      <div style={{
        backgroundColor: '#1F1F1F',
        color: '#FAF4EC',
        padding: '24px',
        textAlign: 'center' as const,
        fontSize: '14px'
      }}>
        <p style={{ margin: '0 0 16px 0' }}>
          © 2024 KoboClass. All rights reserved.
        </p>
        <p style={{ margin: '0', opacity: 0.7 }}>
          Real Skills. Real People. Real Pay.
        </p>
      </div>
    </div>
  );
};