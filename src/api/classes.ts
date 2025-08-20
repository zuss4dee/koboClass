import { supabase } from '../lib/supabase';

export interface ClassCreationData {
  title: string;
  description: string;
  category: string;
  price: number; // in kobo
  date: string;
  time: string;
  duration: number;
  coverImageUrl?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface ClassCreationResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export const createClass = async (
  hostId: string,
  classData: ClassCreationData
): Promise<ClassCreationResponse> => {
  try {
    // Validate required fields
    if (!classData.title.trim()) {
      return { success: false, error: 'Class title is required' };
    }
    
    if (classData.title.length < 5 || classData.title.length > 200) {
      return { success: false, error: 'Title must be between 5 and 200 characters' };
    }
    
    if (!classData.description.trim()) {
      return { success: false, error: 'Class description is required' };
    }
    
    if (classData.description.length < 20 || classData.description.length > 2000) {
      return { success: false, error: 'Description must be between 20 and 2000 characters' };
    }
    
    if (!classData.category) {
      return { success: false, error: 'Category is required' };
    }
    
    if (classData.price < 100000 || classData.price > 500000) {
      return { success: false, error: 'Price must be between ₦1,000 and ₦5,000' };
    }
    
    if (classData.duration < 30 || classData.duration > 240) {
      return { success: false, error: 'Duration must be between 30 and 240 minutes' };
    }

    // Validate date/time is in the future
    const classDateTime = new Date(`${classData.date}T${classData.time}`);
    if (classDateTime <= new Date()) {
      return { success: false, error: 'Class date and time must be in the future' };
    }

    // Get category ID
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('name', classData.category)
      .single();

    if (categoryError || !categoryData) {
      return { success: false, error: 'Invalid category selected' };
    }

    // Create the class
    const { data, error } = await supabase
      .from('classes')
      .insert([
        {
          title: classData.title.trim(),
          description: classData.description.trim(),
          host_id: hostId,
          category_id: categoryData.id,
          price: classData.price,
          currency: 'NGN',
          date_time: classDateTime.toISOString(),
          duration_minutes: classData.duration,
          status: 'pending_approval',
          cover_image_url: classData.coverImageUrl,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating class:', error);
      return { success: false, error: 'Failed to create class. Please try again.' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error creating class:', error);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
};

export const getHostClasses = async (hostId: string) => {
  try {
    const { data, error } = await supabase
      .from('classes')
      .select(`
        *,
        categories (
          name,
          slug
        ),
        whereby_links (
          whereby_url,
          room_id,
          status
        )
      `)
      .eq('host_id', hostId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching host classes:', error);
      return { success: false, error: 'Failed to fetch classes' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error fetching host classes:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export const getClassById = async (classId: string) => {
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
          avatar_url,
          bio
        ),
        whereby_links (
          whereby_url,
          room_id,
          status
        )
      `)
      .eq('id', classId)
      .single();

    if (error) {
      console.error('Error fetching class:', error);
      return { success: false, error: 'Class not found' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error fetching class:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
};