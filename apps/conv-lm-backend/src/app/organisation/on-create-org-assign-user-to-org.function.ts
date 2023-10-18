import { FirestoreCreateRegistrar, RestRegistrar } from '@ngfi/functions';

import { OrganisationAssignUserHandler } from '@app/private/functions/organisation';

import { ConvLearnFunction } from "../../conv-learn-func.class";

const ORGANIZATIONS_PATH = 'orgs/{orgId}';

const organisationAssignHandler = new OrganisationAssignUserHandler()

export const assignUserToCreatedOrg = new ConvLearnFunction('assignUserToCreatedOrg',
                                                  new FirestoreCreateRegistrar(ORGANIZATIONS_PATH),
                                                  [],
                                                  organisationAssignHandler)
                                                  .build()
