import { WhatsAppReceiveIncomingMsgHandler } from "@app/functions/webhooks";
import { EndpointRegistrar } from "@ngfi/functions";
import { ConvLearnFunction } from "../../conv-learn-func.class";


const handler = new WhatsAppReceiveIncomingMsgHandler();

/**
 * @Desctiption : Webhook used to register whatsapp bot on app on meta site
 */

export const channelWhatsAppMsgReceiveIncmngMsg = new ConvLearnFunction('channelWhatsAppMsgReceiveIncmngMsg', 
                                                  new EndpointRegistrar(), 
                                                  [], 
                                                  handler)
                               .build();