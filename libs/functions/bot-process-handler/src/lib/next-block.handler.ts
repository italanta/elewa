import { find as __find } from 'lodash';

import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';
import { HandlerTools } from '@iote/cqrs';
import { Query } from '@ngfi/firestore-qbuilder';
import { QuestionMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { Connection } from '@app/model/bot/blocks/connection';
import { Provider } from '@app/model/bot/main/provider';

export class NextBlock {


  constructor() {}

  async getNextBlockDefault(lastBlockId: string, provider: Provider, tools: HandlerTools): Promise<StoryBlock>{

    const currentConnection = await this._getConnBySourceId(lastBlockId, provider, tools)

    const newBlock = await this._getBlockById(currentConnection.targetId, provider, tools)

    return newBlock 
  }

  async getNextBlockFromOption(lastBlockId: string, message: string, provider: Provider, tools: HandlerTools, matchFn: any): Promise<StoryBlock>{
    const lastBlockData = await this._getBlockById(lastBlockId, provider, tools);

    // Throw an error for now if the block type does not expect input from user
    if (lastBlockData.type != 3){
      throw new Error ('Response for block not implemented!')
    }
    const question: QuestionMessageBlock = lastBlockData

    const optionIndex = matchFn(message, question.options);

    if (optionIndex == -1){
      throw new Error('The message did not match any option found')
    }

    const sourceId = `i-${optionIndex}-${question.id}`
    const optionConnection = await this._getConnByOption(sourceId, provider, tools)

    const newBlock = await this._getBlockById(optionConnection.targetId, provider, tools)

    return newBlock 
  }

  private async _getBlockById(id: string, provider: any, tools: HandlerTools): Promise<StoryBlock>{
    const orgRepo$ = tools.getRepository<StoryBlock>(`orgs/${provider.orgId}/stories/${provider.storyId}/blocks`);

    const block: StoryBlock = await orgRepo$.getDocumentById(id)

    if(!block){
      throw new Error('Block does not exist')
    }

    return block
  }

  private async _getConnByOption(id: string, provider: Provider, tools: HandlerTools): Promise<Connection>{
    const orgRepo$ = tools.getRepository<Connection>(`orgs/${provider.orgId}/stories/${provider.storyId}/connections`);

    const conn = await orgRepo$.getDocuments(new Query().where('sourceId', '==', id))[0]

    if(!conn[0]){
      throw new Error('Connection does not exist')
    }

    return conn[0]
  }

  private async _getConnBySourceId(blockId: string, provider: Provider, tools: HandlerTools): Promise<Connection>{
    const orgRepo$ = tools.getRepository<Connection>(`orgs/${provider.orgId}/stories/${provider.storyId}/connections`);

    const conn = await orgRepo$.getDocuments(new Query().where('sourceId', '==', `defo-${blockId}`))[0]

    if(!conn[0]){
      throw new Error('Connection does not exist')
    }

    return conn[0]
  }
}

export enum MatchingOptions {
  ExactMatch = 1,
}