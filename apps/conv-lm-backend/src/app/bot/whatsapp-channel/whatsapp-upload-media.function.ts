import { RestRegistrar } from "@ngfi/functions";

import { WhatsAppUploadMediaHandler } from "@app/functions/bot-engine/whatsapp";

import { ConvLearnFunction } from "../../../conv-learn-func.class";


const handler = new WhatsAppUploadMediaHandler();

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
export const channelWhatsappUploadMedia = new ConvLearnFunction('channelWhatsappUploadMedia', 
                                                  new RestRegistrar('asia-south1'), 
                                                  [], 
                                                  handler)
                               .build();