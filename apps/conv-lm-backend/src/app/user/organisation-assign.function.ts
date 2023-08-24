import { RestRegistrar } from '@ngfi/functions';

import { OrganisationAssignUserHandler } from '@app/private/functions/organisation';

import { ConvLearnFunction } from "../../conv-learn-func.class";

const assignUserToOrgHandler = new OrganisationAssignUserHandler()

export const assignUserToOrg = new ConvLearnFunction('assignUserToOrg',
                                                  new RestRegistrar(),
                                                  [],
                                                  assignUserToOrgHandler)
                                                  .build()
