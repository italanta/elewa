import { RestRegistrar } from "@ngfi/functions";

import { MoveChatHandler } from "@app/functions/bot-engine";

import { ConvLearnFunction } from "../../../conv-learn-func.class";


const handler = new MoveChatHandler();

/**
 * @Description : When an end user sends a message to the chatbot from a thirdparty application, this function is triggered, 
 *      handles the message and forwards it to whatsapp
 * 
 * This function listens to the 'messages' collection and forwards the message if the direction is '"toEndUser"'
 * 
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/set-up-webhooks
 * 
 */
export const moveChat = new ConvLearnFunction('moveChat', 
                                                  new RestRegistrar(),  
                                                  [], 
                                                  handler)
                               .build();