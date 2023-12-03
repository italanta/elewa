import { EndpointRegistrar, RestRegistrar } from "@ngfi/functions";

import { RunScheduleHandler } from "@app/private/functions/convs-mgr/conversations/message-templates/scheduler";

import { ConvLearnFunction } from "../../../../conv-learn-func.class";

const handler = new RunScheduleHandler();

/**
 * @Description : When an end user sends a message to the chatbot from a thirdparty application, this function is triggered, 
 *      handles the message and forwards it to whatsapp
 * 
 * This function listens to the 'messages' collection and forwards the message if the direction is '"toEndUser"'
 * 
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/set-up-webhooks
 * 
 */
export const runSchedule = new ConvLearnFunction('runSchedule', 
                                                  new EndpointRegistrar(), 
                                                  [], 
                                                  handler)
                               .build();