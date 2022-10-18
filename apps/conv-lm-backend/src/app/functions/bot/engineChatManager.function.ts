import { EngineChatManagerHandler } from "@app/functions/chatbot";
import { RestRegistrar } from "@ngfi/functions";

import { ConvLearnFunction } from "../../../conv-learn-func.class";


const handler = new EngineChatManagerHandler();

// The function itself
export const engineChatManager = new ConvLearnFunction(
        "engineChatManager",
        new RestRegistrar(),
        [],
        handler)
    .build();