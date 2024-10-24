
/**
 * Represents the response sent back to Twilio for IVR interactions.
 * This is typically a TwiML (Twilio Markup Language) response.
 */
interface TwilioIVRResponse {
    /** The TwiML response as a string */
    twiml: string;
  }