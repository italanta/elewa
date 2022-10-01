import { WhatsAppMessageHookHandler } from "@app/functions/webhooks";
import { EndpointRegistrar } from "@ngfi/functions";
import { ConvLearnFunction } from "../../conv-learn-func.class";


const handler = new WhatsAppMessageHookHandler();

//Webhook used to register whatsapp bot on app on meta site
export const whatsAppMessageHook = new ConvLearnFunction('whatsAppMessageHook', 
                                                  new EndpointRegistrar(), 
                                                  [], 
                                                  handler)
                               .build();