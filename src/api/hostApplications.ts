import { supabase } from '../lib/supabase';

export interface HostApplicationData {
  bio: string;
  social_links: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface HostApplicationResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export const submitHostApplication = async (
  userId: string,
  applicationData: HostApplicationData
): Promise<HostApplicationResponse> => {
  try {
    // Validate bio length
    if (!applicationData.bio.trim()) {
      return { success: false, error: 'Bio is required' };
    }
    
    if (applicationData.bio.length < 50) {
      return { success: false, error: 'Bio must be at least 50 characters long' };
    }
    
    if (applicationData.bio.length > 1000) {
      return { success: false, error: 'Bio must be less than 1000 characters' };
    }

    // Check if user already has a pending or approved application
    const { data: existingApplication, error: checkError } = await supabase
      .from('host_applications')
      .select('id, status')
      .eq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error checking existing application:', checkError);
      return { success: false, error: 'Failed to check existing application' };
    }

    if (existingApplication) {
      if (existingApplication.status === 'pending') {
        return { success: false, error: 'You already have a pending host application' };
      }
      if (existingApplication.status === 'approved') {
        return { success: false, error: 'You are already an approved host' };
      }
    }

    // Submit new application
    const { data, error } = await supabase
      .from('host_applications')
      .insert([
        {
          user_id: userId,
          bio: applicationData.bio.trim(),
          social_links: applicationData.social_links,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error submitting host application:', error);
      return { success: false, error: 'Failed to submit application. Please try again.' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error submitting host application:', error);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
};

export const getHostApplicationStatus = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('host_applications')
      .select('id, status, created_at, admin_notes, reviewed_at')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error fetching host application:', error);
      return { success: false, error: 'Failed to fetch application status' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error fetching host application:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
};