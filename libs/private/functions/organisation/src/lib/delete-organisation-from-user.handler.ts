import { FunctionContext, FunctionHandler } from "@ngfi/functions";
import { HandlerTools } from "@iote/cqrs";

import { Organisation } from "@app/model/organisation";

export class DeleteOrganisationFromUserHandler extends FunctionHandler<Organisation, any>
{
  public async execute(org: Organisation, context: FunctionContext, tools: HandlerTools) 
  {
    let usersRepo = tools.getRepository(`users`);
    let orgUsers = org.users;

    for await (const user of orgUsers) {
      let userData: any = await usersRepo.getDocumentById(user);

      userData.orgs.splice(userData.profile.orgIds.indexOf(org.id), 1);
      userData.activeOrg = userData.profile.activeOrg === org.id ? '' : userData.profile.activeOrg;

      await usersRepo.update(userData);
    }
  }
}