import { RestRegistrar } from '@ngfi/functions';

import { ConvLearnFunction } from "../../conv-learn-func.class";
import { CreateSubscriptionsHandler } from '@app/private/functions/payments/core';

const createCustomerSubscription = new CreateSubscriptionsHandler();

export const createSubscription = new ConvLearnFunction('createSubscription',
//change this to restregistrar when testing on postman
                                                new RestRegistrar(),
                                                  [],
                                                  createCustomerSubscription)
                                                  .build();
                                                  