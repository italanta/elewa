import { RestRegistrar } from '@ngfi/functions';

import { ConvLearnFunction } from "../../conv-learn-func.class";

import { RequestPaymentHandler } from '@app/private/functions/payments/core';

const requestNewPaymentHandler = new RequestPaymentHandler()

const INVOICES_PATH = 'invoices/{invoiceId}';

export const requestPayment = new ConvLearnFunction('requestPayment',
//change this to restregistrar when testing on postman
                                                new RestRegistrar(),
                                                  [],
                                                  requestNewPaymentHandler)
                                                  .build();
                                                  