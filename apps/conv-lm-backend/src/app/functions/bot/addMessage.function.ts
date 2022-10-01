import { AddMessageHandler } from "@app/functions/conversations/messages/add-message";
import { RestRegistrar } from "@ngfi/functions";
import { ConvLearnFunction } from "apps/conv-lm-backend/src/conv-learn-func.class";

const handler = new AddMessageHandler();

export const addMessage = new ConvLearnFunction(
    "addMessage",
    new RestRegistrar(),
    [],
    handler)
.build();