import * as twilio from 'twilio/lib/index';
/**
 * Generates a TwiML response for gathering user input in an IVR system.
 * @param promptUrl The text to be spoken to the user
 * @param numDigits The number of digits to gather from the user
 * @param actionUrl The URL to send the results to once input is gathered
 * @returns A TwiML response as a string
 */
function generateGatherTwiML(promptUrl: string, numDigits: number, actionUrl: string): string {
    const response = new twilio.twiml.VoiceResponse();
    const gather = response.gather({
      numDigits: numDigits,
      action: actionUrl,
      method: 'POST'
    });
    gather.play(promptUrl);
    return response.toString();
};