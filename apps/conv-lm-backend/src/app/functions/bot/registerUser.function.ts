import { RegisterEndUserHandler } from "@app/functions/conversations/onboarding";
import { RestRegistrar } from "@ngfi/functions";
import { ConvLearnFunction } from "apps/conv-lm-backend/src/conv-learn-func.class";

const handler = new RegisterEndUserHandler();

// The function itself
export const registerUser = new ConvLearnFunction(
        "registerUser",
        new RestRegistrar(),
        [],
        handler)
    .build();