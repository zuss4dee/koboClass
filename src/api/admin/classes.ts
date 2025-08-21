import { supabase } from '../lib/supabase';

export interface PendingClass {
  id: string;
  title: string;
  description: string;
  host_id: string;
  category_id: string;
  price: number;
  currency: string;
  date_time: string;
  duration_minutes: number;
  status: 'pending_approval';
  cover_image_url?: string;
  max_students?: number;
  created_at: string;
  host: {
    full_name: string;
    email: string;
    avatar_url?: string;
  };
  category: {
    name: string;
  };
}

export interface ApprovalResult {
  success: boolean;
  error?: string;
}

/**
 * Get all classes pending approval
 */
export async function getPendingClasses(): Promise<{ success: boolean; data?: PendingClass[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('classes')
      .select(`
        *,
        host:users!classes_host_id_fkey(full_name, email, avatar_url),
        category:categories!classes_category_id_fkey(name)
      `)
      .eq('status', 'pending_approval')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending classes:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as PendingClass[] };
  } catch (error) {
    console.error('Error fetching pending classes:', error);
    return { success: false, error: 'Failed to fetch pending classes' };
  }
}

/**
 * Approve a class
 */
export async function approveClass(classId: string, adminId: string, adminNotes?: string): Promise<ApprovalResult> {
  try {
    const { error } = await supabase
      .from('classes')
      .update({
        status: 'approved',
        approved_by: adminId,
        approved_at: new Date().toISOString(),
        admin_notes: adminNotes || null
      })
      .eq('id', classId)
      .eq('status', 'pending_approval');

    if (error) {
      console.error('Error approving class:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error approving class:', error);
    return { success: false, error: 'Failed to approve class' };
  }
}

/**
 * Reject a class
 */
export async function rejectClass(classId: string, adminId: string, adminNotes: string): Promise<ApprovalResult> {
  try {
    const { error } = await supabase
      .from('classes')
      .update({
        status: 'rejected',
        approved_by: adminId,
        approved_at: new Date().toISOString(),
        admin_notes: adminNotes
      })
      .eq('id', classId)
      .eq('status', 'pending_approval');

    if (error) {
      console.error('Error rejecting class:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error rejecting class:', error);
    return { success: false, error: 'Failed to reject class' };
  }
}

/**
 * Get class details for admin review
 */
export async function getClassForReview(classId: string): Promise<{ success: boolean; data?: PendingClass; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('classes')
      .select(`
        *,
        host:users!classes_host_id_fkey(full_name, email, avatar_url),
        category:categories!classes_category_id_fkey(name)
      `)
      .eq('id', classId)
      .single();

    if (error) {
      console.error('Error fetching class for review:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as PendingClass };
  } catch (error) {
    console.error('Error fetching class for review:', error);
    return { success: false, error: 'Failed to fetch class details' };
  }
}