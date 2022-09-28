import { ProcessMessageHandler } from "@app/functions/chatbot";
import { FirestoreCreateRegistrar } from "@ngfi/functions";

import { GCPFunction } from "../../../function";


const handler = new ProcessMessageHandler();

// The function itself
export const processMessage = new GCPFunction(
        "processMessage",
        new FirestoreCreateRegistrar('end-users/{phoneNumber}/platforms/{platform}/messages/{messageId}'),
        [],
        handler)
    .build();