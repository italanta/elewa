import { EndpointRegistrar } from "@ngfi/functions";
import { MessengerReceiveMsgHandler } from "@app/functions/bot-engine/messenger";

import { ConvLearnFunction } from "../../../conv-learn-func.class";

const handler = new MessengerReceiveMsgHandler();

/**
 * @Description : When an end user sends a message to the chatbot, this function is triggered, 
 *      handles the message and potentially responds to it
 * 
 * It is specifically for Whatsapp @see {PlatformType}, and subscribes to the 'messages' webhook on
 *      the Meta Developers platform
 * 
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/set-up-webhooks
 * 
 */
export const channelMessengerReceiveMsg = new ConvLearnFunction('channelMessengerReceiveMsg', 
                                                  new EndpointRegistrar('asia-south1'), 
                                                  [], 
                                                  handler)
                               .build();