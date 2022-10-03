import { RegisterEndUserHandler } from "@app/functions/conversations/onboarding";
import { RestRegistrar } from "@ngfi/functions";

import { ConvLearnFunction } from "../../../conv-learn-func.class";


const handler = new RegisterEndUserHandler();

// The function itself
export const registerEndUser = new ConvLearnFunction(
        "registerEndUser",
        new RestRegistrar(),
        [],
        handler)
    .build();