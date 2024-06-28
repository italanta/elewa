import { FirestoreCreateRegistrar, RestRegistrar } from "@ngfi/functions";

import { GetIntentHandler } from "@app/functions/intent";

import { ConvLearnFunction } from "../../../conv-learn-func.class";

const getIntentHandler = new GetIntentHandler();


export const getIntent = new ConvLearnFunction('getIntent', 
                                                  new RestRegistrar(),
                                                  [], 
                                                  getIntentHandler)
                               .build();