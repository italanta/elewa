import { EndpointRegistrar } from '@ngfi/functions';

import { UpdateExistingUsersHandler } from '@app/private/functions/organisation';

import { ConvLearnFunction } from "../../conv-learn-func.class";

const createNewUserHandler = new UpdateExistingUsersHandler()

export const updateExistingUsers = new ConvLearnFunction('updateExistingUsers',
                                                  new EndpointRegistrar(),
                                                  [],
                                                  createNewUserHandler)
                                                  .build()
