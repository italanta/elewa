import { EngineBotManagerHandler } from "@app/functions/chatbot";
import { RestRegistrar } from "@ngfi/functions";

import { ConvLearnFunction } from "../../../conv-learn-func.class";


const handler = new EngineBotManagerHandler();

// The function itself
export const engineChatManager = new ConvLearnFunction(
        "engineChatManager",
        new RestRegistrar(),
        [],
        handler)
    .build();