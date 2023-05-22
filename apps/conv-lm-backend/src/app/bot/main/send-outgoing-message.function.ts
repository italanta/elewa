import { FirestoreCreateRegistrar } from "@ngfi/functions";

import { SendOutgoingMsgHandler } from "@app/functions/bot-engine/send-message";

import { ConvLearnFunction } from "../../../conv-learn-func.class";

const handler = new SendOutgoingMsgHandler();

/**
 * @Description : When an end user sends a message to the chatbot from a thirdparty application, this function is triggered, 
 *      handles the message and forwards it to whatsapp
 * 
 * This function listens to the 'messages' collection and forwards the message if the direction is '"toEndUser"'
 * 
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/set-up-webhooks
 * 
 */
export const channelSendOutgoingMessage = new ConvLearnFunction('sendOutgoingMessage', 
                                                  new FirestoreCreateRegistrar('orgs/{orgId}/end-users/{endUserId}/messages/{id}'), 
                                                  [], 
                                                  handler)
                               .build();