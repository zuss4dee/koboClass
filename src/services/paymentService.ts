// Mock payment service for development
// In production, this would integrate with actual Stripe API

export interface PaymentData {
  classId: string;
  userId: string;
  amount: number; // in kobo
  currency: string;
  paymentMethod: string;
}

export interface PaymentResponse {
  success: boolean;
  data?: {
    sessionId?: string;
    paymentIntentId?: string;
    redirectUrl?: string;
  };
  error?: string;
}

export const mockInitiatePayment = async (paymentData: PaymentData): Promise<PaymentResponse> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock successful payment
    const mockSessionId = `cs_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const mockPaymentIntentId = `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('Mock payment initiated:', {
      sessionId: mockSessionId,
      amount: paymentData.amount,
      currency: paymentData.currency,
      classId: paymentData.classId
    });
    
    return {
      success: true,
      data: {
        sessionId: mockSessionId,
        paymentIntentId: mockPaymentIntentId,
        redirectUrl: `/class/${paymentData.classId}/checkout?session_id=${mockSessionId}`
      }
    };
  } catch (error) {
    console.error('Mock payment error:', error);
    return {
      success: false,
      error: 'Payment processing failed. Please try again.'
    };
  }
};

// Mock webhook handler for payment completion
export const handlePaymentWebhook = async (sessionId: string, paymentIntentId: string) => {
  try {
    // In production, this would:
    // 1. Verify the webhook signature
    // 2. Create transaction record
    // 3. Create ticket for learner
    // 4. Create earning for host
    // 5. Send confirmation email
    
    console.log('Mock webhook processed:', { sessionId, paymentIntentId });
    
    return { success: true };
  } catch (error) {
    console.error('Mock webhook error:', error);
    return { success: false, error: 'Webhook processing failed' };
  }
};