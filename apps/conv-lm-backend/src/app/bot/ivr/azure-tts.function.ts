import { RestRegistrar } from "@ngfi/functions";

import { ConvLearnFunction } from "../../../conv-learn-func.class";
import { ConvertTextToSpeechHandler } from "@app/functions/bot-engine/interactive-voice-response";


const handler = new ConvertTextToSpeechHandler();

/**
 * @Description : Method to convert text to speech.
 */
export const azureTts = new ConvLearnFunction(
    'azureTts', 
     new RestRegistrar(),  
    [], 
    handler
).build();