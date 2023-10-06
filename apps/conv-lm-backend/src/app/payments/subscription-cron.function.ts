import { CronRegistrar, RestRegistrar } from '@ngfi/functions';

import { ConvLearnFunction } from "../../conv-learn-func.class";

import { SubscriptionCheckerHandler } from '@app/private/functions/payments/core';

const _SUBSCRIPTION_FREQUENCY = '0 0 * * *'

const subscriptonCheckerHandler = new SubscriptionCheckerHandler()

// const subscriptionCreatorHandler = new SubscriptionCreateHandler()

// const subscriptionPauseHandler = new SubscriptionPauseHandler()



/* Checks subscription details and triggers payments by creating payment document */
export const subscriptionChecker = new ConvLearnFunction('subscriptionCheker',
                                                  new CronRegistrar(_SUBSCRIPTION_FREQUENCY),
                                                  [],
                                                  subscriptonCheckerHandler)
                                                  .build()
                                                  