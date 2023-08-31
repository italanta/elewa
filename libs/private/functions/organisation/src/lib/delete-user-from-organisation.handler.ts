import { HandlerTools } from '@iote/cqrs';
import { FunctionContext, FunctionHandler } from '@ngfi/functions';

import { iTalUser } from '@app/model/user';

/**
 * This function handler is responsible for removing a user from an 
 *    organisation's list of users.
 */
export class DeleteUserFromOrganisationHandler extends FunctionHandler<iTalUser, any>
{

  public async execute(user: iTalUser, context: FunctionContext, tools: HandlerTools) {

    tools.Logger.log(() => `Starting delete user execution`);
    tools.Logger.log(() => `deleting user with id: ${user.id}`);

    let orgsRepo = tools.getRepository(`orgs`);
    let userOrgs = user.orgIds;

    tools.Logger.log(() => `user orgs are : ${userOrgs.length}`);

    for await (const org of userOrgs) {
      let orgData: any = await orgsRepo.getDocumentById(org);
      tools.Logger.log(() => `User org is : ${orgData.id}`);

      // If the user is the only user in the organisation, archive the organisation.
      //    else remove the user from the organisation list of users.
      if (orgData.users.length === 1) {
        tools.Logger.log(() => `user created org: ${orgData.id}`);
        orgData.archived = true;
        await orgsRepo.update(orgData);
      } else {
        tools.Logger.log(() => `updating org: ${orgData.id}`);
        orgData.users.splice(orgData.users.indexOf(user.id), 1);
        await orgsRepo.update(orgData);
      }
    }
  }
}