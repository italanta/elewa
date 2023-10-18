import { EndpointRegistrar } from '@ngfi/functions';

import { ConvLearnFunction } from "../../conv-learn-func.class";

import { ReceivePaymentHandler } from '@app/private/functions/payments/core';

const receiveNewPaymentHandler = new ReceivePaymentHandler()

export const receivePaymentWebhook = new ConvLearnFunction('receivePaymentWebhook',
                                                  new EndpointRegistrar(),
                                                  [],
                                                  receiveNewPaymentHandler)
                                                  .build()
                                                  