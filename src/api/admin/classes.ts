import { supabase } from '../../lib/supabase';

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

// Mock Whereby API integration - replace with actual Whereby API calls
const generateWherebyLink = async (classTitle: string): Promise<{ url: string; roomId: string } | null> => {
  try {
    // In production, this would be an actual Whereby API call
    // For now, we'll generate a mock link
    const roomId = `koboclass-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const url = `https://koboclass.whereby.com/${roomId}`;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { url, roomId };
  } catch (error) {
    console.error('Error generating Whereby link:', error);
    return null;
  }
};

// Mock email service - replace with actual Resend integration
const sendHostApprovalEmail = async (hostEmail: string, hostName: string, classData: any) => {
  try {
    // In production, this would use Resend API
    console.log('Sending approval email to:', hostEmail);
    console.log('Class approved:', classData.title);
    
    // Mock email content
    const emailContent = {
      to: hostEmail,
      subject: `🎉 Your class "${classData.title}" has been approved!`,
      html: `
        <h1>Congratulations ${hostName}!</h1>
        <p>Your class "${classData.title}" has been approved and is now live on KoboClass.</p>
        <p>Students can now discover and book your class.</p>
        <p>Your Whereby link will be available in your host dashboard.</p>
        <p>Happy teaching!</p>
        <p>The KoboClass Team</p>
      `
    };
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { success: true };
  } catch (error) {
    console.error('Error sending approval email:', error);
    return { success: false, error: 'Failed to send approval email' };
  }
};

export const approveOrRejectClass = async (
  classId: string,
  approvalData: ClassApprovalData
): Promise<ClassApprovalResponse> => {
  try {
    // Validate input
    if (!classId) {
      return { success: false, error: 'Class ID is required' };
    }
    
    if (!['approved', 'rejected'].includes(approvalData.status)) {
      return { success: false, error: 'Invalid status. Must be approved or rejected' };
    }

    // Fetch the class details first
    const { data: classData, error: fetchError } = await supabase
      .from('classes')
      .select(`
        *,
        users!classes_host_id_fkey (
          id,
          email,
          full_name
        )
      `)
      .eq('id', classId)
      .single();

    if (fetchError || !classData) {
      console.error('Error fetching class for approval:', fetchError);
      return { success: false, error: 'Class not found' };
    }

    // Check if class is in pending status
    if (classData.status !== 'pending_approval') {
      return { success: false, error: 'Class is not pending approval' };
    }

    let wherebyUrl = null;
    let roomId = null;

    // If approving, generate Whereby link
    if (approvalData.status === 'approved') {
      const wherebyResult = await generateWherebyLink(classData.title);
      
      if (!wherebyResult) {
        return { success: false, error: 'Failed to generate video conference link' };
      }
      
      wherebyUrl = wherebyResult.url;
      roomId = wherebyResult.roomId;

      // Store Whereby link in database
      const { error: wherebyError } = await supabase
        .from('whereby_links')
        .insert([
          {
            class_id: classId,
            whereby_url: wherebyUrl,
            room_id: roomId,
            status: 'active',
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
          }
        ]);

      if (wherebyError) {
        console.error('Error storing Whereby link:', wherebyError);
        return { success: false, error: 'Failed to store video conference link' };
      }
    }

    // Update class status
    const { data: updatedClass, error: updateError } = await supabase
      .from('classes')
      .update({
        status: approvalData.status,
        admin_notes: approvalData.adminNotes,
        approved_by: approvalData.adminId,
        approved_at: new Date().toISOString()
      })
      .eq('id', classId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating class status:', updateError);
      return { success: false, error: 'Failed to update class status' };
    }

    // Send email notification to host if approved
    if (approvalData.status === 'approved' && classData.users) {
      await sendHostApprovalEmail(
        classData.users.email,
        classData.users.full_name || 'Host',
        classData
      );
    }

    return { 
      success: true, 
      data: { 
        ...updatedClass, 
        wherebyUrl: wherebyUrl 
      } 
    };
  } catch (error) {
    console.error('Unexpected error in class approval:', error);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
};

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
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .eq('status', 'pending_approval')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching pending classes:', error);
      return { success: false, error: 'Failed to fetch pending classes' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error fetching pending classes:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export { getPendingClasses }