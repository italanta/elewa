import { RestRegistrar } from '@ngfi/functions';

import { CreateNewUserHandler } from '@app/functions/user';

import { ConvLearnFunction } from "../../conv-learn-func.class";

const createNewUserHandler = new CreateNewUserHandler()

export const createNewUser = new ConvLearnFunction('createNewUser',
                                                  new RestRegistrar(),
                                                  [],
                                                  createNewUserHandler)
                                                  .build()
