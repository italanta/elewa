import { HandlerTools } from '@iote/cqrs';
import { FunctionContext, FunctionHandler } from '@ngfi/functions';

import { Organisation } from '@app/model/organisation';
import { iTalUser } from '@app/model/user';

import { defaultPermissions } from './default-permissions';
import { Query } from '@ngfi/firestore-qbuilder';

/**
 * This handler is responsible for assigning roles and permissions to the organisation and 
 *  assign admin role to the user who created the organisation
 */
export class UpdateExistingUsersHandler extends FunctionHandler<any, any>
{

  public async execute(req: any, context: FunctionContext, tools: HandlerTools)
  {
    let users: iTalUser[];

    console.log(req.users);

    const usersRepo = tools.getRepository<iTalUser>(`users`);

    try {
      if (req.users) {
        const userIds = req.users as string[];

          userIds.forEach(async(id)=> {
          const user = await usersRepo.getDocumentById(id);

          let org: Organisation = {
            id: user.id,
            name: user.displayName,
            createdBy: user.id,
            users: [],
            roles: [],
            permissions: undefined
          }
    
          await this._updatePermissions(org, tools);
        })
      } else {

        users = await usersRepo.getDocuments(new Query());
    
         users.forEach(async (user)=> {
          let org: Organisation = {
            id: user.id,
            name: user.displayName,
            createdBy: user.id,
            users: [],
            roles: [],
            permissions: undefined
          }
    
          await this._updatePermissions(org, tools)
          return true
        })
      }


    } catch (error) {
      tools.Logger.log(() => `Error updating ${error}`);

      return false;
    }

  }

  private async _updatePermissions(org: Organisation, tools: HandlerTools)
  {
    // Get the repositories for the organisation, user and permissions
    const orgsRepo = tools.getRepository<any>(`orgs`);
    const userRepo = tools.getRepository<any>(`users`);

    // Permissions are stored in the config repository
    const perRepo = tools.getRepository<any>(`orgs/${org.id}/config`);

    if (!!org.createdBy) {
      try {
        // Add roles to the organisation object
        const activeOrg = {
          id: org.id,
          logoUrl: '',
          name: org.name,
          users: [org.createdBy],
          address: org.address || "",
          roles: ['Admin', 'ContentDeveloper', 'Viewer'],
          permissions: {}
        } as Organisation;

        // Update the organisation object
        orgsRepo.write(activeOrg, activeOrg.id);

        // Initialise permissions with default permissions
        perRepo.write(defaultPermissions, 'permissions');

        // Get the admin user - The user who created the organisation
        let adminUser: iTalUser = await userRepo.getDocumentById(org.createdBy);

        let adminRight = {
          Admin: true,
          ContentDeveloper: false,
          Viewer: false,
        };

        // Assign admin role to the user who created the organisation
        adminUser.roles[org.id!] = adminRight;
        adminUser.activeOrg = org.id!;

        if (!adminUser.orgIds) {
          adminUser.orgIds = [];
        }
        
        adminUser.orgIds.push(org.id!);

        // Update the user object
        userRepo.write(adminUser, org.createdBy)

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