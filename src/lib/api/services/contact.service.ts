import { URL } from '@/util/api';

export interface ContactMessageRequest {
  messageName: string;
  fullName: string;
  mobile: string;
  email: string;
}

export interface ContactMessageResponse {
  message: string;
  status?: boolean;
  data?: any;
}

/**
 * Send a contact message
 * @param data - Contact message data
 * @returns API response
 */
export const sendContactMessage = async (
  data: ContactMessageRequest
): Promise<ContactMessageResponse> => {
  try {
    const response = await fetch(URL('/contact-messages'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to send contact message');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while sending the message');
  }
};




