import { HandlerTools } from "@iote/cqrs";
import { FunctionContext, FunctionHandler } from "@ngfi/functions";
import { Query } from '@ngfi/firestore-qbuilder';

import { DefaultBlock } from "@app/model/bot/blocks/default-block";
import { StoryBlock } from "@app/model/bot/blocks/story-block";
import { Provider } from "@app/model/bot/main/provider";
import { MessageData } from "@app/model/bot/main/message-data";
import { QuestionMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { Connection } from "@app/model/bot/blocks/connection";
import { MatchOptions } from "./match-options.handler";
import { NextBlock } from "./next-block.handler";

export class BotProcessHandler extends FunctionHandler<MessageData, StoryBlock> {

  public async execute(data: MessageData, context: FunctionContext, tools: HandlerTools): Promise<StoryBlock> {

    const nextBlock = await this._mainProcess(data, tools)

    return nextBlock
      
  }

  private async _mainProcess(data: MessageData, tools: HandlerTools){
    let block: StoryBlock;

    // Read the Providers collection and extract story id and org id
    const provider  = await this._readProviders(data.phoneNumber, tools)

    // Throw error if the provider does not exist
    if(!provider){
      throw new Error('Provider does not exist!')
    }

    // Get the subject
    const subject =  await this._readSubjects(data.phoneNumber, tools);
    
    if(!subject){
      // If subject does not exist, create a new subject
     block = await this.createSubject(provider, data.phoneNumber,tools);
    } else {

      //If subject exists update the existing subject
      block = await this.updateSubject(provider, data,tools);
    } 

    return block

  }

  private async createSubject(provider: Provider, phoneNumber: string, tools: HandlerTools): Promise<StoryBlock>{

    // Get the default block
    const defaultBlock: DefaultBlock = await this._getDefaultBlock(provider, tools);

    const subjectRepo$ = tools.getRepository<DefaultBlock>(`subjects/${phoneNumber}/stories/${provider.storyId}/milestones`);

    // Create subject
    await subjectRepo$.write(defaultBlock, defaultBlock.id)

    // Get the next block using the default block
    const nextBlock: StoryBlock = await this._getBlockById(defaultBlock.nextBlock, provider, tools)

    const storyBlockRepo$ = tools.getRepository<StoryBlock>(`subjects/${phoneNumber}/stories/${provider.storyId}/milestones`);

    await storyBlockRepo$.write(nextBlock, nextBlock.id)

    return nextBlock;
  }

  private async updateSubject(provider: Provider, data: {phoneNumber: string; message: string}, tools: HandlerTools): Promise<StoryBlock>{
    const milestoneRepo$ = tools.getRepository<StoryBlock>(`subjects/${data.phoneNumber}/stories/${provider.storyId}/milestones`);
    const latestBlock = await milestoneRepo$.getDocuments(new Query().orderBy('createdOn',"desc").limit(1))
    let nextBlock: StoryBlock; 

    const BlockFn = new NextBlock()
    switch (latestBlock[0].type) {
      case 3:
        nextBlock = await BlockFn.getNextBlockFromOption(latestBlock[0].id, data.message, provider, tools, new MatchOptions(1).match)
        break;
      case 1:
        nextBlock = await BlockFn.getNextBlockDefault(latestBlock[0].id, provider, tools)
        break;
      default:
        nextBlock = await BlockFn.getNextBlockDefault(latestBlock[0].id, provider, tools)
        break;
  }

    //Update milestone
    await milestoneRepo$.update(nextBlock);

    // Return next block
    return nextBlock;
  }

  private _readSubjects(phoneNumber: string, tools: HandlerTools){
    // Get subject
    // TODO: Create a type for subjects 
    const subjectRepo$ = tools.getRepository<any>(`subjects`);
    const subject = subjectRepo$.getDocumentById(phoneNumber)

    return subject
  }

  private async _readProviders(phoneNumber: string, tools: HandlerTools): Promise<Provider>{
    // Get providers
    const subjectRepo$ = tools.getRepository<Provider>('providers');
    const subject = await subjectRepo$.getDocumentById(phoneNumber)
    
    return subject
  }

  private async _getDefaultBlock(provider: Provider, tools: HandlerTools): Promise<DefaultBlock>{
    const orgRepo$ = tools.getRepository<DefaultBlock>(`orgs/${provider.orgId}/stories/${provider.storyId}/blocks`);
    const id = 'default';

    const defaultBlock = await orgRepo$.getDocumentById(id);

    if(!defaultBlock){
      throw new Error('No default block set');
    }
    return defaultBlock 
  }

  private async _getBlockById(id: string, provider: any, tools: HandlerTools): Promise<StoryBlock>{
    const orgRepo$ = tools.getRepository<StoryBlock>(`orgs/${provider.orgId}/stories/${provider.storyId}/blocks`);

    const block: StoryBlock = await orgRepo$.getDocumentById(id)

    if(!block){
      throw new Error('Block does not exist')
    }

    return block
  }


}