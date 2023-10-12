import { RestRegistrar } from '@ngfi/functions';

import { CreateMollieCustomerHandler } from '@app/private/functions/payments/core';
import { ConvLearnFunction } from "../../conv-learn-func.class";


const createMollieCustomer = new CreateMollieCustomerHandler();

export const createMollieUser = new ConvLearnFunction('createMollieUser',
//change this to restregistrar when testing on postman
                                                new RestRegistrar(),
                                                  [],
                                                  createMollieCustomer)
                                                  .build();