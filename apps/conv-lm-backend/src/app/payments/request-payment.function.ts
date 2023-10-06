import { RestRegistrar } from '@ngfi/functions';

import { ConvLearnFunction } from "../../conv-learn-func.class";

import { RequestPaymentHandler } from '@app/private/functions/payments/core';

const requestNewPaymentHandler = new RequestPaymentHandler()

const INVOICES_PATH = 'invoices/{invoiceId}';

export const requestPaymemt = new ConvLearnFunction('requestPaymemt',
//change this to restregistrar when testing on postman
                                                new RestRegistrar(),
                                                  [],
                                                  requestNewPaymentHandler)
                                                  .build();
                                                  