import { FirestoreCreateRegistrar } from '@ngfi/functions';

import { ConvLearnFunction } from "../../conv-learn-func.class";

import { RequestPaymentHandler } from '@app/private/functions/payments/core';

const requestNewPaymentHandler = new RequestPaymentHandler()

export const requestPaymemt = new ConvLearnFunction('requestPayment',
                                                  new FirestoreCreateRegistrar('invoices/{invoiceId}'),
                                                  [],
                                                  requestNewPaymentHandler)
                                                  .build()