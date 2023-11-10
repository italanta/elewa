import { ActiveOrgStore } from './../../../../state/organisation/main/src/lib/stores/active-org.store';
import { HandlerTools } from '@iote/cqrs';
import { FunctionContext, FunctionHandler } from '@ngfi/functions';

import { Organisation } from '@app/model/organisation';
import { iTalUser } from '@app/model/user';

import { defaultPermissions } from './default-permissions';
import { create, trimEnd } from 'lodash';

/**
 * This handler is responsible for assigning roles and permissions to the organisation and 
 *  assign admin role to the user who created the organisation
 */
export class OrganisationAssignUserHandler extends FunctionHandler<Organisation, boolean>
{

  public async execute(org: Organisation, context: FunctionContext, tools: HandlerTools) {

    // Get the repositories for the organisation, user and permissions
    const orgsRepo = tools.getRepository<any>(`orgs`);
    const userRepo = tools.getRepository<any>(`users`);

    const createdOrg = await orgsRepo.create(org);

    // Permissions are stored in the config repository
    const perRepo = tools.getRepository<any>(`orgs/${org.id}/config`);
    if (!!org.createdBy) {
      try {
        // Add roles to the organisation object
        const activeOrg = {
          id: createdOrg.id,
          logoUrl: '',
          name: createdOrg.name,
          users: [createdOrg.createdBy],
          address: createdOrg.address,
          roles: ['Admin', 'ContentDeveloper', 'Viewer'],
          permissions: {}
        } as Organisation;

        // Update the organisation object
        orgsRepo.update(activeOrg);

        // Initialise permissions with default permissions
        perRepo.write(defaultPermissions, 'permissions');

        // Get the admin user - The user who created the organisation
        let adminUser: iTalUser = await userRepo.getDocumentById(createdOrg.createdBy);

        let adminRight = {
          Admin: true,
          ContentDeveloper: false,
          Viewer: false,
        };

        // Assign admin role to the user who created the organisation
        adminUser.roles[createdOrg.id!] = adminRight;
        adminUser.activeOrg = createdOrg.id!;

        if (!adminUser.orgIds) {
          adminUser.orgIds = [];
        }
        
        adminUser.orgIds.push(createdOrg.id!);

        // Update the user object
        userRepo.write(adminUser, createdOrg.createdBy)

        return true;

      } catch (err) {
        tools.Logger.log(() => `Error updating ${err}`)
        return false;
      }
    } else {
      return false;
    }
  }
}