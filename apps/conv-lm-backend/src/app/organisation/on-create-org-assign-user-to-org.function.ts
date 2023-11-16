import { RestRegistrar } from '@ngfi/functions';

import { OrganisationAssignUserHandler } from '@app/private/functions/organisation';

import { ConvLearnFunction } from "../../conv-learn-func.class";

const organisationAssignHandler = new OrganisationAssignUserHandler()

export const assignUserToCreatedOrg = new ConvLearnFunction('assignUserToCreatedOrg',
                                                  new RestRegistrar(),
                                                  [],
                                                  organisationAssignHandler)
                                                  .build()
