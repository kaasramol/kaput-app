import twilio from 'twilio';

let twilioClient: twilio.Twilio | null = null;

export function getTwilioClient(): twilio.Twilio {
  if (!twilioClient) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    if (!accountSid || !authToken) {
      throw new Error('TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be configured.');
    }
    twilioClient = twilio(accountSid, authToken);
  }
  return twilioClient;
}

/** The Twilio phone number used as the proxy/mask for calls */
export function getTwilioProxyNumber(): string {
  const num = process.env.TWILIO_PROXY_NUMBER;
  if (!num) throw new Error('TWILIO_PROXY_NUMBER must be configured.');
  return num;
}
