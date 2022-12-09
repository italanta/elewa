import { HandlerTools } from "@iote/cqrs";

import { Query } from "@ngfi/firestore-qbuilder";

import { makeHttpRequest } from "../../utils/httpRequest";

export async function saveMilestoneData(postUrl: string, endUserId: string, orgId: string, milestone: string, tools: HandlerTools)
{
      const docPath = `orgs/${orgId}/end-users/${endUserId}/${milestone}`;

      const milestoneRepo$ = tools.getRepository<any>(docPath);

      let milestoneData = await milestoneRepo$.getDocuments(new Query());

      return makeHttpRequest(postUrl, milestoneData, tools);
}