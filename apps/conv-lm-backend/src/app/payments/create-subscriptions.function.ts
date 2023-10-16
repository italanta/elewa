import { RestRegistrar } from "@ngfi/functions";

import { CreateSubscriptionsHandler } from "@app/private/functions/payments/core";

import { ConvLearnFunction } from "../../conv-learn-func.class";

const handler = new CreateSubscriptionsHandler();

export const createSubscription = new ConvLearnFunction('createSubscription', 
                                                  new RestRegistrar(), 
                                                  [], 
                                                  handler)
                               .build();