import { HandlerTools } from '@iote/cqrs';
import { FunctionContext, FunctionHandler } from '@ngfi/functions';

import { iTalUser } from '@app/model/user';
import { Organisation } from '@app/model/organisation';

import { defaultPermissions } from './default-permissions';

export class OrganisationAssignUserHandler extends FunctionHandler<Organisation, boolean>
{

  public async execute(org: Organisation, context: FunctionContext, tools: HandlerTools) {
    const orgsRepo = tools.getRepository<Organisation>(`orgs`);
    const userRepo = tools.getRepository<iTalUser>(`users`);
    const createdOrg = await orgsRepo.create(org);

    const perRepo = tools.getRepository<any>(`orgs/${org.id}/config`);

    tools.Logger.log(() => `Successfullly created Organisation`);

    if (org.createdBy) {
      try {
        const activeOrg = {
          id: createdOrg.id,
          logoUrl: '',
          name: createdOrg.name,
          users: [createdOrg.createdBy],
          email: '',
          phone: '',
          address: createdOrg.address,
          roles: ['ContentDeveloper', 'Viewer', 'Admin'],
          permissions: {}
        } as Organisation;

        orgsRepo.update(activeOrg);

        await perRepo.write(defaultPermissions, 'permissions');

        const adminUser: iTalUser = await userRepo.getDocumentById(createdOrg.createdBy);

        const adminRight = {
          ContentDeveloper: false,
          Viewer: false,
          Admin: true,
        };

        adminUser.roles[createdOrg.id as string] = adminRight;

        adminUser.activeOrg = createdOrg.id as string;

        if (!adminUser.orgIds) {
          adminUser.orgIds = [];
        }
        
        adminUser.orgIds.push(createdOrg.id as string);

        userRepo.write(adminUser, createdOrg.createdBy);
        tools.Logger.log(() => `Successfullly updated adminUser with newly created Org`);

        return await perRepo.getDocumentById('permissions');
      } catch (err) {
        tools.Logger.log(() => `Error updating ${err}`)
        return false;
      }
    } else {
      return false
    }
  }
}