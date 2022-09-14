import { RestRegistrar } from "@ngfi/functions";

import { BotProcessHandler } from "@app/functions/bot-process-handler";

import { GCPFunction } from "../../function";


const handler = new BotProcessHandler();

// The function itself
export const botMainProcess = new GCPFunction(
        "botMainProcess",
        new RestRegistrar(),
        [],
        handler)
    .build();