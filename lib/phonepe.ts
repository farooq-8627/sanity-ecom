import axios from 'axios';
import { Buffer } from 'buffer';
import { createHash } from 'crypto';

// PhonePe API configuration
const MERCHANT_ID = process.env.NEXT_PUBLIC_MERCHANT_ID || 'PGTESTPAYUAT86';
const SALT_KEY = process.env.NEXT_PUBLIC_SALT_KEY || '96434309-7796-489d-8924-ab56988a6076';
const SALT_INDEX = '1';
const API_URL = process.env.NEXT_PUBLIC_PHONE_PAY_HOST_URL || 'https://api-preprod.phonepe.com/apis/pg-sandbox';
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

// Helper function to generate checksum
export const generateChecksum = (payload: string, apiEndpoint: string) => {
  // For status check, include merchant ID in the string
  const string = apiEndpoint.includes('/status/') 
    ? `/pg/v1/status/${MERCHANT_ID}/${payload}${SALT_KEY}`
    : payload + apiEndpoint + SALT_KEY;
  const sha256 = createHash('sha256').update(string).digest('hex');
  return sha256 + '###' + SALT_INDEX;
};

// Helper function to generate unique transaction ID
export const generateTransactionId = () => {
  return `TXN_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    };

// Helper function to handle API errors
const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    const response = error.response?.data;
    return {
      success: false,
      error: response?.message || response?.error || 'Payment service error',
      code: response?.code || error.response?.status
    };
  }
  return {
    success: false,
    error: error.message || 'Unknown error occurred',
    code: 'UNKNOWN_ERROR'
  };
};

// Function to initiate payment
export const initiatePhonePePayment = async (amount: number, orderId: string, userId: string) => {
  try {
    const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: orderId,
      merchantUserId: userId,
      amount: amount * 100, // Convert to paise
      redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/status/${orderId}`,
      redirectMode: 'REDIRECT',
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/callback`,
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const checksum = generateChecksum(base64Payload, '/pg/v1/pay');
    
    const response = await axios.post(
      `${API_URL}/pg/v1/pay`,
      {
        request: base64Payload
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'Accept': 'application/json'
        }
      }
    );

    const { success, code, data } = response.data;

    if (!success || code !== 'PAYMENT_INITIATED') {
      throw new Error(data?.message || 'Payment initiation failed');
    }

      return {
        success: true,
      data: data
      };
  } catch (error) {
    console.error('PhonePe payment initiation error:', error);
    return handleApiError(error);
  }
};

// Function to check payment status with retries
export const checkPaymentStatus = async (transactionId: string, retryCount = 0): Promise<any> => {
  try {
    const endpoint = `/pg/v1/status/${MERCHANT_ID}/${transactionId}`;
    const checksum = generateChecksum(transactionId, endpoint);

    const response = await axios.get(
      `${API_URL}${endpoint}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'X-MERCHANT-ID': MERCHANT_ID,
          'Accept': 'application/json'
        }
      }
    );

    const { success, code, data } = response.data;
    
    // If payment is still pending and we haven't exceeded max retries
    if (code === 'PAYMENT_PENDING' && retryCount < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return checkPaymentStatus(transactionId, retryCount + 1);
    }

    if (success && code === 'PAYMENT_SUCCESS') {
    return {
      success: true,
        data: {
          merchantId: data.merchantId,
          merchantTransactionId: data.merchantTransactionId,
          transactionId: data.transactionId,
          amount: data.amount,
          paymentInstrument: data.paymentInstrument
        }
      };
    }

    // Handle specific error codes
    if (code === 'PAYMENT_ERROR' || code === 'PAYMENT_DECLINED') {
      return {
        success: false,
        error: 'Payment was declined or failed',
        code: code
      };
    }
    
    if (code === 'TIMED_OUT') {
      return {
        success: false,
        error: 'Payment request timed out',
        code: code
      };
    }

    return {
      success: false,
      error: data?.responseCodeDescription || 'Payment verification failed',
      code: code
    };
  } catch (error) {
    console.error('PhonePe status check error:', error);
    return handleApiError(error);
  }
}; 