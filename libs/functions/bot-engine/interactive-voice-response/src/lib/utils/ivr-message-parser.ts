import { IVROutgoingMessage } from "../models/ivr-incoming-message.interface";

/**
 * Parses the outgoing payload to ensure it matches the IVR message structure.
* @param {any} payload - The incoming payload to parse.
* @returns {IVROutgoingMessage} Parsed IVR outgoing message.
*/
export function IVROutogingMessageParser(payload: any): IVROutgoingMessage {
    return {
      ...payload,
      voiceGender: payload.voiceGender || 'female',
      ivrOptions: payload.ivrOptions || [],
      phoneNumber: payload.endUserPhoneNumber // Ensure this field exists in your payload
    };
};