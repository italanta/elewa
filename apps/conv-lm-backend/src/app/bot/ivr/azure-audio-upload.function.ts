import { RestRegistrar } from "@ngfi/functions";

import { UploadAudioHandler } from "@app/functions/bot-engine/interactive-voice-response";

import { ConvLearnFunction } from "../../../conv-learn-func.class";


const handler = new UploadAudioHandler();

/**
 * @Description : Method to upload audio to the azure blob.
 */
export const azureAudioUpload = new ConvLearnFunction(
    'azureAudioUpload', 
     new RestRegistrar(),  
    [], 
    handler
).build();