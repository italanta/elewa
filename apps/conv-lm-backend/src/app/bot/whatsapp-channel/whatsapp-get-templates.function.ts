import { RestRegistrar } from "@ngfi/functions";

import { WhatsappGetTemplatesHandler } from "@app/functions/bot-engine/whatsapp";

import { ConvLearnFunction } from "../../../conv-learn-func.class";


const handler = new WhatsappGetTemplatesHandler();

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
export const channelWhatsappGetTemplates = new ConvLearnFunction('channelWhatsappGetTemplates', 
                                                  new RestRegistrar(), 
                                                  [], 
                                                  handler)
                               .build();