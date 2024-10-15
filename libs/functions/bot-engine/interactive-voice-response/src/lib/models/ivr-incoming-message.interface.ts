import { OutgoingMessagePayload } from "@app/model/convs-mgr/conversations/messages";

// Interface for the outgoing IVR message
export interface IVROutgoingMessage extends OutgoingMessagePayload {
    voiceGender: 'male' | 'female';  // Voice selection for Azure TTS.
    ivrOptions?: string[];           // Optional array of IVR choices presented to the user.
    phoneNumber: string;             // User's phone number to send the message to.
    message?: any
  }