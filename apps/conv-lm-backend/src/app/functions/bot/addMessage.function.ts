import { AddMessageHandler } from "@app/functions/conversations/messages/add-message";
import { RestRegistrar } from "@ngfi/functions";

import { GCPFunction } from "../../../function";


const handler = new AddMessageHandler();

export const addMessage = new GCPFunction(
    "addMessage",
    new RestRegistrar(),
    [],
    handler)
.build();