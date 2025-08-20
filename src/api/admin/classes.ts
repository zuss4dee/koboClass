import { supabase } from '../../lib/supabase';

export const getPendingClasses = async () => {
  try {
    const { data, error } = await supabase
      .from('classes')
      .select(`
        *,
        categories (
          name,
          slug
        ),
        users!classes_host_id_fkey (
          full_name,
          email,
          avatar_url
        )
      `)
      .eq('status', 'pending_approval')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending classes:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in getPendingClasses:', error);
    return { success: false, error: 'Failed to fetch pending classes' };
  }
};

export interface ClassApprovalData {
  status: 'approved' | 'rejected';
  adminNotes?: string;
  adminId: string;
}

export interface ClassApprovalResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// Mock Whereby API integration
const generateWherebyLink = async (classTitle: string, classDateTime: string): Promise<{ url: string; roomId: string } | null> => {
  try {
    // In production, replace this with actual Whereby API call
    // Example Whereby API call:
    // const response = await fetch('https://api.whereby.dev/v1/meetings', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.WHEREBY_API_KEY}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     endDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
    //     fields: ['hostRoomUrl'],
    //     isLocked: false,
    //     roomNamePrefix: 'koboclass',
    //     roomMode: 'group'
    //   })
    // });
    
    // Mock implementation
    const roomId = `koboclass-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const url = `https://koboclass.whereby.com/${roomId}`;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`Generated Whereby link for "${classTitle}":`, url);
    
    return { url, roomId };
  } catch (error) {
    console.error('Error generating Whereby link:', error);
    return null;
  }
};

// Mock email service
const sendClassApprovalEmail = async (
  hostEmail: string, 
  hostName: string, 
  classData: any, 
  wherebyUrl?: string
) => {
  try {
    // In production, replace with actual Resend API call
    console.log('Sending class approval email to:', hostEmail);
    
    const emailContent = {
      to: hostEmail,
      subject: `🎉 Your class "${classData.title}" is now live!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(90deg, #D9572B, #F4B400); padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Class Approved!</h1>
          </div>
          
          <div style="background: #FAF4EC; padding: 24px; border-radius: 0 0 12px 12px;">
            <h2 style="color: #1F1F1F; margin-bottom: 16px;">Hi ${hostName},</h2>
            
            <p style="color: #1F1F1F; margin-bottom: 16px;">
              Great news! Your class "<strong>${classData.title}</strong>" has been approved and is now live on KoboClass.
            </p>
            
            <div style="background: #F6E6CE; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <h3 style="color: #1F1F1F; margin-bottom: 8px;">Class Details:</h3>
              <p style="color: #8C8C8C; margin: 4px 0;"><strong>Date:</strong> ${new Date(classData.date_time).toLocaleDateString()}</p>
              <p style="color: #8C8C8C; margin: 4px 0;"><strong>Time:</strong> ${new Date(classData.date_time).toLocaleTimeString()}</p>
              <p style="color: #8C8C8C; margin: 4px 0;"><strong>Duration:</strong> ${classData.duration_minutes} minutes</p>
              <p style="color: #8C8C8C; margin: 4px 0;"><strong>Price:</strong> ₦${(classData.price / 100).toLocaleString()}</p>
            </div>
            
            ${wherebyUrl ? `
              <div style="background: #2C6E49; color: white; padding: 16px; border-radius: 8px; margin: 16px 0;">
                <h3 style="margin-bottom: 8px;">🎥 Your Class Link:</h3>
                <p style="margin: 4px 0;">Your Whereby video link has been generated and is available in your host dashboard.</p>
                <p style="margin: 4px 0; font-size: 12px;">Share this link with students 5 minutes before class starts.</p>
              </div>
            ` : ''}
            
            <p style="color: #1F1F1F; margin: 16px 0;">
              Students can now discover and book your class. You'll receive notifications when students enroll.
            </p>
            
            <div style="text-align: center; margin: 24px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://koboclass.com'}/host-dashboard" 
                 style="background: #D9572B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                View in Host Dashboard
              </a>
            </div>
            
            <p style="color: #1F1F1F;">
              Happy teaching!<br>
              <strong>The KoboClass Team</strong>
            </p>
          </div>
        </div>
      `
    };
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { success: true };
  } catch (error) {
    console.error('Error sending class approval email:', error);
    return { success: false, error: 'Failed to send approval email' };
  }
};

const sendClassRejectionEmail = async (
  hostEmail: string, 
  hostName: string, 
  classData: any, 
  adminNotes?: string
) => {
  try {
    console.log('Sending class rejection email to:', hostEmail);
    
    const emailContent = {
      to: hostEmail,
      subject: `Class Update: "${classData.title}" requires revision`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #C1440E; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Class Needs Revision</h1>
          </div>
          
          <div style="background: #FAF4EC; padding: 24px; border-radius: 0 0 12px 12px;">
            <h2 style="color: #1F1F1F; margin-bottom: 16px;">Hi ${hostName},</h2>
            
            <p style="color: #1F1F1F; margin-bottom: 16px;">
              Thank you for submitting your class "<strong>${classData.title}</strong>". 
              After review, we need you to make some adjustments before we can approve it.
            </p>
            
            ${adminNotes ? `
              <div style="background: #F6E6CE; padding: 16px; border-radius: 8px; margin: 16px 0;">
                <h3 style="color: #1F1F1F; margin-bottom: 8px;">Feedback from our team:</h3>
                <p style="color: #8C8C8C;">${adminNotes}</p>
              </div>
            ` : ''}
            
            <p style="color: #1F1F1F; margin: 16px 0;">
              Please review the feedback and resubmit your class. We're here to help you create an amazing learning experience!
            </p>
            
            <div style="text-align: center; margin: 24px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://koboclass.com'}/host-dashboard" 
                 style="background: #D9572B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Edit Your Class
              </a>
            </div>
            
            <p style="color: #1F1F1F;">
              Keep creating!<br>
              <strong>The KoboClass Team</strong>
            </p>
          </div>
        </div>
      `
    };
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { success: true };
  } catch (error) {
    console.error('Error sending class rejection email:', error);
    return { success: false, error: 'Failed to send rejection email' };
  }
};

export const approveClass = async (classId: string, adminId: string, adminNotes?: string) => {
  return approveOrRejectClass(classId, {
    status: 'approved',
    adminNotes,
    adminId
  });
};

export const rejectClass = async (classId: string, adminId: string, adminNotes?: string) => {
  const result = await approveOrRejectClass(classId, {
    status: 'rejected',
    adminNotes,
    adminId
  });
  
  // Send rejection email if successful
  if (result.success && result.data) {
    const { data: classData } = await supabase
      .from('classes')
      .select(`
        *,
        users!classes_host_id_fkey (
          email,
          full_name
        )
      `)
      .eq('id', classId)
      .single();
    
    if (classData && classData.users) {
      await sendClassRejectionEmail(
        classData.users.email,
        classData.users.full_name || 'Host',
        classData,
        adminNotes
      );
    }
  }
  
  return result;
};