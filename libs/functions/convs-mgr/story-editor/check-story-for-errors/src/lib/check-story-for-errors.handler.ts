 import { HandlerTools } from '@iote/cqrs';

import { FunctionHandler, FunctionContext, RestResult } from '@ngfi/functions';
import { FlowError, FlowErrorType } from '@app/model/convs-mgr/stories/main';
import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';
import { Query } from '@ngfi/firestore-qbuilder';


export class FindFlowErrorsHandler extends FunctionHandler<any, FlowError[]>
{
  public async execute(req: { orgId: string, storyId: string }, context: FunctionContext, tools: HandlerTools) :Promise<FlowError[]>
  {
    const errors: FlowError[] = [];

    const blocksRepo = tools.getRepository<StoryBlock>(`orgs/${req.orgId}/stories/${req.storyId}/blocks`);
    const blocks = await blocksRepo.getDocuments(new Query())

    blocks.forEach((block) => {
        if (!block.message || block.message.trim() == ''){
            errors.push({ type: FlowErrorType.EmptyTextField, blockId: block.id });
        }
    })
    console.log(errors)
    return errors;
  }
}