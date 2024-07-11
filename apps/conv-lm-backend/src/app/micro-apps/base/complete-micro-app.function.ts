import { RestRegistrar } from "@ngfi/functions";

import { CompleteMicroAppHandler } from "@app/private/functions/micro-apps/base";

import { ConvLearnFunction } from "../../../conv-learn-func.class";


const handler = new CompleteMicroAppHandler();

export const completeMicroApp = new ConvLearnFunction('completeMicroApp', 
                                                  new RestRegistrar('asia-south1'), 
                                                  [], 
                                                  handler)
                               .build();
