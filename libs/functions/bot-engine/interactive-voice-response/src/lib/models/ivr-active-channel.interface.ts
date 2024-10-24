import { IVROutgoingMessage } from "./ivr-incoming-message.interface";

// Interface for the IVR Active Channel
export interface IVRActiveChannel {
    /**
     * Sends the outgoing message through the IVR system.
     * @param payload - Message details like phone number, voice settings, and IVR options.
     */
    send?: (payload: IVROutgoingMessage) => Promise<void>;
  
    /**
     * Handles incoming payloads from Africa's Talking (e.g., user input like DTMF).
     * @param payload - Incoming message details such as callerNumber, dtmfDigits, etc.
     * @returns The XML response for the IVR.
     */
    handleIncoming: (payload: any) => Promise<string>;
}