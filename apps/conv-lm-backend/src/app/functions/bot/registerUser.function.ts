import { RegisterEndUserHandler } from "@app/functions/conversations/onboarding";
import { RestRegistrar } from "@ngfi/functions";

import { GCPFunction } from "../../../function";


const handler = new RegisterEndUserHandler();

// The function itself
export const registerUser = new GCPFunction(
        "registerUser",
        new RestRegistrar(),
        [],
        handler)
    .build();