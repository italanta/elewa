import { ProcessMessageHandler } from "@app/functions/chatbot";
import { FirestoreCreateRegistrar } from "@ngfi/functions";

import { ConvLearnFunction } from "../../../conv-learn-func.class";


const handler = new ProcessMessageHandler();

// The function itself
export const processMessage = new ConvLearnFunction(
        "processMessage",
        new FirestoreCreateRegistrar('end-users/{phoneNumber}/platforms/{platform}/messages/{messageId}'),
        [],
        handler)
    .build();