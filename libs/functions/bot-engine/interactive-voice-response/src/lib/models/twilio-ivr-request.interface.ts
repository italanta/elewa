/**
 * Represents the incoming request from Twilio for an IVR interaction.
 */
interface TwilioIVRRequest {
    /** The unique identifier for this call */
    CallSid: string;
    /** The phone number or client identifier of the caller */
    From: string;
    /** The phone number or client identifier called */
    To: string;
    /** The digits pressed by the caller, if any */
    Digits?: string;
    /** The current call status */
    CallStatus: 'ringing' | 'in-progress' | 'completed' | 'busy' | 'failed' | 'no-answer';
    /** The type of call (e.g., 'voice') */
    CallType: string;
    /** The direction of the call (inbound or outbound-api) */
    Direction: 'inbound' | 'outbound-api';
    /** The timestamp of when the call was initiated */
    Timestamp: string;
    /** Any speech input received from the caller */
    SpeechResult?: string;
    /** The confidence level of the speech recognition, if applicable */
    Confidence?: string;
}