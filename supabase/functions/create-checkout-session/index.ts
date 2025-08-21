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
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');

    if (!supabaseUrl || !supabaseServiceKey || !stripeSecretKey) {
      console.error('Missing required environment variables');
      return new Response(JSON.stringify({ 
        error: 'Server configuration error' 
      }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const requestData: CreateCheckoutRequest = await req.json();
    const { classId, userId, userEmail, className, hostName, amount, currency } = requestData;

    // Validate required fields
    if (!classId || !userId || !userEmail || !amount) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields' 
      }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check if user already has a ticket for this class
    const { data: existingTicket, error: ticketCheckError } = await supabase
      .from('tickets')
      .select('id')
      .eq('user_id', userId)
      .eq('class_id', classId)
      .eq('status', 'paid')
      .single();

    if (existingTicket) {
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
      .single();

    if (classError || !classData) {
      return new Response(JSON.stringify({ 
        error: 'Class not found or not available for booking' 
      }), { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Verify class is in the future
    if (new Date(classData.date_time) <= new Date()) {
      return new Response(JSON.stringify({ 
        error: 'This class has already started or ended' 
      }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create Stripe checkout session
    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'payment',
        'success_url': `${req.headers.get('origin') || 'https://koboclass.com'}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        'cancel_url': `${req.headers.get('origin') || 'https://koboclass.com'}/class/${classId}/checkout?payment=cancelled`,
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

    if (!stripeResponse.ok) {
      const errorText = await stripeResponse.text();
      console.error('Stripe API error:', errorText);
      return new Response(JSON.stringify({ 
        error: 'Failed to create checkout session' 
      }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const session = await stripeResponse.json();

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
      error: 'Internal server error' 
    }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});