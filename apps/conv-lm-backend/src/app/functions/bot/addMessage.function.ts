import { AddMessageHandler } from "@app/functions/conversations/messages/add-message";
import { RestRegistrar } from "@ngfi/functions";

import { ConvLearnFunction } from "../../../conv-learn-func.class";


const handler = new AddMessageHandler();

export const addMessage = new ConvLearnFunction(
    "addMessage",
    new RestRegistrar(),
    [],
    handler)
.build();