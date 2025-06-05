import axios from 'axios';
import { Buffer } from 'buffer';
import { createHash } from 'crypto';

// Test credentials for PhonePe sandbox
const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || "PGTESTPAYUAT";
const SALT_KEY = process.env.PHONEPE_SALT_KEY || "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
const SALT_INDEX = 1;

// PhonePe API URLs
const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.phonepe.com/apis/hermes'
  : 'https://api-preprod.phonepe.com/apis/pg-sandbox';

// Base URL for your application
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// Helper function to generate checksum
const generateChecksum = (payload: string, apiEndpoint: string): string => {
  const string = `${payload}${apiEndpoint}${SALT_KEY}`;
  const sha256 = createHash('sha256').update(string).digest('hex');
  return `${sha256}###${SALT_INDEX}`;
};

interface PhonePePaymentResponse {
  success: boolean;
  code: string;
  message: string;
  data?: {
    merchantId: string;
    merchantTransactionId: string;
    instrumentResponse: {
      type: string;
      redirectInfo: {
        url: string;
        method: string;
      };
    };
  };
}

export interface PaymentInitiateRequest {
  amount: number;
  orderId: string;
  userId: string;
  userEmail: string;
  userName: string;
  callbackUrl: string;
  redirectUrl: string;
}

export const initiatePhonePePayment = async (request: PaymentInitiateRequest) => {
  try {
    const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: request.orderId,
      merchantUserId: request.userId,
      amount: request.amount * 100,
      redirectUrl: `${BASE_URL}/success?order_id=${request.orderId}`,
      redirectMode: "REDIRECT",
      callbackUrl: `${BASE_URL}/api/webhook/phonepe`,
      paymentInstrument: {
        type: "PAY_PAGE"
      },
      // Add test mode flag for sandbox
      _testMode: true
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const apiEndpoint = "/pg/v1/pay";
    const checksum = generateChecksum(base64Payload, apiEndpoint);
    
    const response = await axios.post<PhonePePaymentResponse>(
      `${API_URL}${apiEndpoint}`,
      {
        request: base64Payload
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum
        }
      }
    );

    if (response.data.success) {
      return {
        success: true,
        redirectUrl: response.data.data?.instrumentResponse.redirectInfo.url
      };
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('PhonePe payment initiation error:', error);
    throw error;
  }
};

export const verifyPaymentStatus = async (merchantTransactionId: string) => {
  try {
    // For test environment, we'll simulate a successful payment
    if (process.env.NODE_ENV !== 'production') {
      return {
        success: true,
        data: {
          merchantId: MERCHANT_ID,
          merchantTransactionId: merchantTransactionId,
          transactionId: `TEST_${Date.now()}`,
          amount: 100,
          state: "COMPLETED",
          responseCode: "SUCCESS",
          paymentInstrument: {
            type: "UPI",
            utr: `TEST_UTR_${Date.now()}`
          }
        }
      };
    }

    const apiEndpoint = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}`;
    const checksum = generateChecksum("", apiEndpoint);

    const response = await axios.get(
      `${API_URL}${apiEndpoint}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'X-MERCHANT-ID': MERCHANT_ID
        }
      }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    console.error('PhonePe payment status check error:', error);
    
    if (error.response?.status === 401) {
      return {
        success: false,
        error: "Payment verification failed - Unauthorized",
        code: "UNAUTHORIZED"
      };
    }
    
    if (error.response?.status === 404) {
      return {
        success: false,
        error: "Payment not found",
        code: "NOT_FOUND"
      };
    }

    return {
      success: false,
      error: "Payment verification failed",
      code: "UNKNOWN_ERROR"
    };
  }
}; 