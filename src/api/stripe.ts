import { supabase } from '../lib/supabase';

export interface CreateCheckoutSessionData {
  classId: string;
  userId: string;
  userEmail: string;
  className: string;
  hostName: string;
  amount: number; // in kobo
  currency: string;
}

export interface CheckoutSessionResponse {
  success: boolean;
  data?: {
    sessionId: string;
    url: string;
  };
  error?: string;
}

// This would be implemented as a Supabase Edge Function in production
export const createCheckoutSession = async (
  sessionData: CreateCheckoutSessionData
): Promise<CheckoutSessionResponse> => {
  try {
    // In production, this would call your Supabase Edge Function
    // that creates a Stripe checkout session
    
    // For now, we'll simulate the checkout process
    console.log('Creating checkout session for:', sessionData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful session creation
    const mockSessionId = `cs_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const mockCheckoutUrl = `https://checkout.stripe.com/pay/${mockSessionId}`;
    
    return {
      success: true,
      data: {
        sessionId: mockSessionId,
        url: mockCheckoutUrl
      }
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return {
      success: false,
      error: 'Failed to create checkout session. Please try again.'
    };
  }
};

export const getUserTickets = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        classes (
          id,
          title,
          description,
          date_time,
          duration_minutes,
          price,
          users!classes_host_id_fkey (
            full_name,
            avatar_url
          ),
          categories (
            name
          ),
          whereby_links (
            whereby_url,
            status
          )
        ),
        transactions (
          amount,
          currency,
          payment_status,
          receipt_url
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'paid')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user tickets:', error);
      return { success: false, error: 'Failed to fetch tickets' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error fetching tickets:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export const checkUserTicket = async (userId: string, classId: string) => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('id, status')
      .eq('user_id', userId)
      .eq('class_id', classId)
      .eq('status', 'paid')
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows found
        return { success: true, hasTicket: false };
      }
      console.error('Error checking user ticket:', error);
      return { success: false, error: 'Failed to check ticket status' };
    }

    return { success: true, hasTicket: true, data };
  } catch (error) {
    console.error('Unexpected error checking ticket:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
};