 import { HandlerTools } from '@iote/cqrs';

import { FunctionHandler, FunctionContext, RestResult } from '@ngfi/functions';

import { FlowError, FlowErrorType } from '@app/model/convs-mgr/stories/main';
import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';
import { ListMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { Query } from '@ngfi/firestore-qbuilder';
import { Connection } from '@app/model/convs-mgr/conversations/chats';


export class FindFlowErrorsHandler extends FunctionHandler<any, FlowError[]>
{
  public async execute(req: { orgId: string, storyId: string }, context: FunctionContext, tools: HandlerTools) :Promise<FlowError[]>
  {
    const errors: FlowError[] = [];
    const connectionIds = []

    const connectionRepo = tools.getRepository<Connection>(`orgs/${req.orgId}/stories/${req.storyId}/connections`);
    const connections = await connectionRepo.getDocuments( new Query())
    connections.forEach(
      (connection) => {
          connectionIds.push(connection.targetId)
      }
    )

    const blocksRepo = tools.getRepository<StoryBlock>(`orgs/${req.orgId}/stories/${req.storyId}/blocks`);
    const blocks = await blocksRepo.getDocuments(new Query())

    blocks.forEach((block) => {
        if (!block.message || block.message.trim() == ''){
            errors.push({ type: FlowErrorType.EmptyTextField, blockId: block.id });
        }
        // Check if the blockIdToCheck is not in the targetIds array
        if (!connectionIds.includes(block.id)) {
          errors.push({
            type: FlowErrorType.MissingConnection,
            blockId: block.id
          })
        } 
        const listBlock = block as ListMessageBlock;

        if(listBlock?.options){
          listBlock.options.forEach(button => {
            if(button.message || button.message.trim() == ''){
              errors.push({ type: FlowErrorType.EmptyTextField, blockId: listBlock.id})
            }
          })
        }
    })
    
    console.log(errors)
    return errors;
  }
}