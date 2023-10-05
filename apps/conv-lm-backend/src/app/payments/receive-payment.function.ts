import { RestRegistrar } from '@ngfi/functions';

import { ConvLearnFunction } from "../../conv-learn-func.class";

import { ReceivePaymentHandler } from '@app/private/functions/payments/core';

const receiveNewPaymentHandler = new ReceivePaymentHandler()

export const receivePayment = new ConvLearnFunction('receivePayment',
                                                  new RestRegistrar(),
                                                  [],
                                                  receiveNewPaymentHandler)
                                                  .build()