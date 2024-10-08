// ivrFunction.ts
import { TwilioIncomingCallHandler } from "@app/functions/bot-engine/interactive-voice-response";
import { EndpointRegistrar, RestRegistrar } from "@ngfi/functions";
import { ConvLearnFunction } from "apps/conv-lm-backend/src/conv-learn-func.class";

const handler = new TwilioIncomingCallHandler();

/**
 * @Description : Function to handle incoming calls to the IVR system.
 */
export const twilioIncomingCall = new ConvLearnFunction(
    'twilioIncomingCall', 
    new EndpointRegistrar(),  
    [], 
    handler
).build();
