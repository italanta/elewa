import { PlatformRegisterEndUserHandler } from "@app/functions/conversations/onboarding";
import { RestRegistrar } from "@ngfi/functions";

import { ConvLearnFunction } from "../../../conv-learn-func.class";


const handler = new PlatformRegisterEndUserHandler();

// The function itself
export const platformRegisterEndUser = new ConvLearnFunction(
        "platformRegisterEndUser",
        new RestRegistrar(),
        [],
        handler)
    .build();