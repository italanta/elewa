import { RestRegistrar } from "@ngfi/functions";
import { BotProcessHandler } from "@app/functions/bot-process-handler";
import { ConvLearnFunction } from "../../conv-learn-func.class";

const handler = new BotProcessHandler();

// The function itself
export const botMainProcess = new ConvLearnFunction(
        "botMainProcess",
        new RestRegistrar(),
        [],
        handler)
    .build();