import { ProcessMessageHandler } from "@app/functions/chatbot";
import { RestRegistrar } from "@ngfi/functions";

import { GCPFunction } from "../../../function";


const handler = new ProcessMessageHandler();

// The function itself
export const processMessage = new GCPFunction(
        "processMessage",
        new RestRegistrar(),
        [],
        handler)
    .build();