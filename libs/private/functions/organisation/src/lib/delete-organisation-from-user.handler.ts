import { FunctionContext, FunctionHandler } from "@ngfi/functions";
import { HandlerTools } from "@iote/cqrs";

import { Organisation } from "@app/model/organisation";

/**
 * This function handler is responsible for removing an organisation from a user's profile.
 */
export class DeleteOrganisationFromUserHandler extends FunctionHandler<Organisation, any>
{
  public async execute(org: Organisation, context: FunctionContext, tools: HandlerTools) 
  {
    let usersRepo = tools.getRepository(`users`);
    let orgUsers = org.users;

    // Go through all users in the organisation and remove the organisation 
    //  from the list of organisations they belong to.
    for await (const user of orgUsers) {
      let userData: any = await usersRepo.getDocumentById(user);

      userData.orgs.splice(userData.profile.orgIds.indexOf(org.id), 1);
      userData.activeOrg = userData.profile.activeOrg === org.id ? '' : userData.profile.activeOrg;

      await usersRepo.update(userData);
    }
  }
}