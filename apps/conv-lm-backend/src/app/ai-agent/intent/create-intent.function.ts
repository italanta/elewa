import { FirestoreCreateRegistrar, RestRegistrar } from "@ngfi/functions";

import { CreateIntentHandler } from "@app/functions/intent";

import { ConvLearnFunction } from "../../../conv-learn-func.class";

const createIntentHandler = new CreateIntentHandler();


export const createIntent = new ConvLearnFunction('createIntent', 
                                                  new RestRegistrar(),  // For testing purposes
                                                  [], 
                                                  createIntentHandler)
                               .build();