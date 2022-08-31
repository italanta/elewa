import { MessageHookHandler } from "@app/functions/webhooks";
import { EndpointRegistrar } from "@ngfi/functions";
import { ConvLearnFunction } from "../../conv-learn-func.class";

const handler = new MessageHookHandler();

export const messageHook = new ConvLearnFunction('messageHook', new EndpointRegistrar(), [], handler).build();