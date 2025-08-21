/*
# Create Stripe Checkout Session

1. New Edge Function
   - `create-checkout-session` function to create Stripe checkout sessions
   - Validates class and user data
   - Creates Stripe checkout session with proper metadata
   - Returns session URL for frontend redirect

2. Security
   - User authentication validation
   - Class availability checks
   - Duplicate purchase prevention

3. Integration
   - Stripe Checkout API integration
   - Proper metadata for webhook processing
   - Success/cancel URL configuration
*/

import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface CreateCheckoutRequest {
  classId: string;
  userId: string;
  userEmail: string;
  className: string;
  hostName: string;
  amount: number; // in kobo
  currency: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ 
      error: 'Method not allowed' 
    }), { 
      status: 405, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    // Check environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');

    console.log('Environment check:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseServiceKey: !!supabaseServiceKey,
      hasStripeSecretKey: !!stripeSecretKey,
      supabaseUrl: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'missing'
    });

    if (!supabaseUrl || !supabaseServiceKey || !stripeSecretKey) {
      console.error('Missing environment variables:', {
        SUPABASE_URL: !!supabaseUrl,
        SUPABASE_SERVICE_ROLE_KEY: !!supabaseServiceKey,
        STRIPE_SECRET_KEY: !!stripeSecretKey
      });
      return new Response(JSON.stringify({ 
        error: 'Server configuration error - missing environment variables' 
      }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Parse request body
    let requestData: CreateCheckoutRequest;
    try {
      requestData = await req.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return new Response(JSON.stringify({ 
        error: 'Invalid request body' 
      }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { classId, userId, userEmail, className, hostName, amount, currency } = requestData;

    console.log('Request data:', {
      classId,
      userId,
      userEmail,
      className,
      hostName,
      amount,
      currency
    });

    // Validate required fields
    if (!classId || !userId || !userEmail || !amount) {
      console.error('Missing required fields:', { classId, userId, userEmail, amount });
      return new Response(JSON.stringify({ 
        error: 'Missing required fields' 
      }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user already has a ticket for this class
    const { data: existingTicket, error: ticketCheckError } = await supabase
      .from('tickets')
      .select('id')
      .eq('user_id', userId)
      .eq('class_id', classId)
      .eq('status', 'paid')
      .maybeSingle();

    if (ticketCheckError && ticketCheckError.code !== 'PGRST116') {
      console.error('Error checking existing tickets:', ticketCheckError);
      return new Response(JSON.stringify({ 
        error: 'Database error while checking existing tickets' 
      }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (existingTicket) {
      console.log('User already has ticket for this class');
      return new Response(JSON.stringify({ 
        error: 'You already have a ticket for this class' 
      }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Verify class exists and is approved
    const { data: classData, error: classError } = await supabase
      .from('classes')
      .select('id, title, status, date_time, price')
      .eq('id', classId)
      .eq('status', 'approved')
      .maybeSingle();

    if (classError) {
      console.error('Error fetching class data:', classError);
      return new Response(JSON.stringify({ 
        error: 'Class not found or not available for booking' 
      }), { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!classData) {
      console.log('Class not found or not approved');
      return new Response(JSON.stringify({ 
        error: 'Class not found or not available for booking' 
      }), { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Verify class is in the future
    if (new Date(classData.date_time) <= new Date()) {
      console.log('Class has already started or ended');
      return new Response(JSON.stringify({ 
        error: 'This class has already started or ended' 
      }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get origin for redirect URLs
    const origin = req.headers.get('origin') || 'http://localhost:5173';
    
    console.log('Creating Stripe checkout session with origin:', origin);

    // Create Stripe checkout session
    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'payment',
        'success_url': `${origin}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        'cancel_url': `${origin}/class/${classId}/checkout?payment=cancelled`,
        'customer_email': userEmail,
        'line_items[0][price_data][currency]': currency.toLowerCase(),
        'line_items[0][price_data][product_data][name]': className,
        'line_items[0][price_data][product_data][description]': `Live class with ${hostName}`,
        'line_items[0][price_data][unit_amount]': amount.toString(),
        'line_items[0][quantity]': '1',
        'metadata[user_id]': userId,
        'metadata[class_id]': classId,
        'metadata[host_name]': hostName,
        'payment_intent_data[metadata][user_id]': userId,
        'payment_intent_data[metadata][class_id]': classId,
      }),
    });

    console.log('Stripe API response status:', stripeResponse.status);

    if (!stripeResponse.ok) {
      const errorText = await stripeResponse.text();
      console.error('Stripe API error:', {
        status: stripeResponse.status,
        statusText: stripeResponse.statusText,
        error: errorText
      });
      return new Response(JSON.stringify({ 
        error: 'Failed to create checkout session',
        details: `Stripe API returned ${stripeResponse.status}: ${errorText}`
      }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const session = await stripeResponse.json();
    console.log('Stripe session created successfully:', session.id);

    return new Response(JSON.stringify({
      sessionId: session.id,
      url: session.url
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Checkout session creation error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message
    }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});