import axios from 'axios';
import { Buffer } from 'buffer';
import { createHash } from 'crypto';

// PhonePe API configuration
const MERCHANT_ID = process.env.NEXT_PUBLIC_MERCHANT_ID || 'PGTESTPAYUAT';
const SALT_KEY = process.env.NEXT_PUBLIC_SALT_KEY || '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
const SALT_INDEX = '1';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const API_URL = IS_PRODUCTION 
  ? 'https://api.phonepe.com/apis/hermes'
  : 'https://api-preprod.phonepe.com/apis/pg-sandbox';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

// Test card details (only available in sandbox)
export const TEST_CARDS = {
  success: {
    number: '4242424242424242',
    expiry: '12/25',
    cvv: '123',
  },
  failure: {
    number: '4111111111111111',
    expiry: '12/25',
    cvv: '123',
  }
};

// Helper function to generate checksum
export const generateChecksum = (payload: string, apiEndpoint: string) => {
  const string = apiEndpoint.includes('/status/') 
    ? `/pg/v1/status/${MERCHANT_ID}/${payload}${SALT_KEY}`
    : `${payload}/pg/v1/pay${SALT_KEY}`;
  const sha256 = createHash('sha256').update(string).digest('hex');
  return sha256 + '###' + SALT_INDEX;
};

// Helper function to generate transaction ID
export const generateTransactionId = () => {
  return `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
};

// Helper function to handle API errors
const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    const response = error.response?.data;
    console.error('PhonePe API Error:', {
      status: error.response?.status,
      data: response,
      config: error.config,
      environment: IS_PRODUCTION ? 'production' : 'sandbox'
    });
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
      redirectUrl: `${BASE_URL}/checkout/status/${orderId}`,
      redirectMode: 'REDIRECT',
      callbackUrl: `${BASE_URL}/api/payments/callback`,
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    console.log('PhonePe Payment Initialization:', {
      environment: IS_PRODUCTION ? 'production' : 'sandbox',
      merchantId: MERCHANT_ID,
      apiUrl: API_URL,
      baseUrl: BASE_URL,
      amount: amount,
      orderId: orderId,
      payload: payload
    });

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

    console.log('PhonePe API Response:', response.data);

    const { success, code, data } = response.data;

    if (!success || code !== 'PAYMENT_INITIATED') {
      throw new Error(data?.message || 'Payment initiation failed');
    }

    return {
      success: true,
      data: data,
      testMode: !IS_PRODUCTION
    };
  } catch (error) {
    console.error('PhonePe payment initiation error:', error);
    return handleApiError(error);
  }
};

// Function to check payment status with retries
export const checkPaymentStatus = async (transactionId: string, retryCount = 0): Promise<any> => {
  try {
    if (!MERCHANT_ID || !SALT_KEY) {
      throw new Error('Missing required configuration');
    }

    const endpoint = `/pg/v1/status/${MERCHANT_ID}/${transactionId}`;
    const checksum = generateChecksum(transactionId, endpoint);

    console.log('PhonePe Status Check:', {
      environment: IS_PRODUCTION ? 'production' : 'sandbox',
      transactionId,
      merchantId: MERCHANT_ID,
      apiUrl: `${API_URL}${endpoint}`
    });

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
        },
        testMode: !IS_PRODUCTION
      };
    }

    // Handle specific error codes
    if (code === 'PAYMENT_ERROR' || code === 'PAYMENT_DECLINED') {
      return {
        success: false,
        error: 'Payment was declined or failed',
        code: code,
        testMode: !IS_PRODUCTION
      };
    }
    
    if (code === 'TIMED_OUT') {
      return {
        success: false,
        error: 'Payment request timed out',
        code: code,
        testMode: !IS_PRODUCTION
      };
    }

    return {
      success: false,
      error: data?.responseCodeDescription || 'Payment verification failed',
      code: code,
      testMode: !IS_PRODUCTION
    };
  } catch (error) {
    console.error('PhonePe status check error:', error);
    return handleApiError(error);
  }
}; 