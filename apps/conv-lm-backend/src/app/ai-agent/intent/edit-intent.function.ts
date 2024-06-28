import { FirestoreCreateRegistrar, RestRegistrar } from "@ngfi/functions";

import { EditIntentHandler } from "@app/functions/intent";

import { ConvLearnFunction } from "../../../conv-learn-func.class";

const editIntentHandler = new EditIntentHandler();


export const editIntent = new ConvLearnFunction('editIntent', 
                                                  new RestRegistrar(),  // For testing purposes 
                                                  [], 
                                                  editIntentHandler)
                               .build();