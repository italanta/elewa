import { FirestoreCreateRegistrar, RestRegistrar } from "@ngfi/functions";

import { DeleteIntentHandler } from "@app/functions/intent";

import { ConvLearnFunction } from "../../../conv-learn-func.class";

const deleteIntentHandler = new DeleteIntentHandler();

export const deleteIntent = new ConvLearnFunction('deleteIntent', 
                                                  new RestRegistrar(),  // For testing purposes
                                                  [], 
                                                  deleteIntentHandler)
                               .build();