import { HandlerTools } from "@iote/cqrs";
import { FunctionContext, FunctionHandler } from "@ngfi/functions";

import { DefaultBlock } from "@app/model/bot/blocks/default-block";
import { StoryBlock } from "@app/model/bot/blocks/story-block";
import { Provider } from "@app/model/bot/main/provider";
import { MessageData } from "@app/model/bot/main/message-data";


export class BotProcessHandler extends FunctionHandler<MessageData, StoryBlock> {

  public async execute(data: MessageData, context: FunctionContext, tools: HandlerTools): Promise<StoryBlock> {

    const nextBlock = await this._mainProcess(data, tools)

    return nextBlock
      
  }

  private async _mainProcess(data: MessageData, tools: HandlerTools){
    let block: any;

    // Read the Providers collection and extract story id and org id
    const provider  = await this._readProviders(data.phoneNumber, tools)

    // Throw error if the provider does not exist
    if(!provider){
      throw new Error('Provider does not exist!')
    }

    // Get the subject
    const subject =  await this._readSubjects(data.phoneNumber, tools)
    
    if(!subject){
      // If subject does not exist, create a new subject
     block = await this.createSubject(provider, data.phoneNumber,tools);
    } else {

      //If subject exists update the existing subject
      block = this.updateSubject(provider, data,tools);
    } 

    return block

  }

  private async createSubject(provider: Provider, phoneNumber: string, tools: HandlerTools): Promise<StoryBlock>{

    // Get the default block
    const defaultBlock: DefaultBlock = await this._getDefaultBlock(provider, tools);

    const subjectRepo$ = tools.getRepository<any>(`subjects/${phoneNumber}/stories/${provider.storyId}/milestones`);

    // Create subject
    await subjectRepo$.write(defaultBlock, defaultBlock.blockId)

    // Get the next block using the default block
    const nextBlock: StoryBlock = await this._getBlockById(defaultBlock.nextBlock, provider, tools)

    return nextBlock;
  }

  private async updateSubject(provider: Provider, data: {phoneNumber: string; message: string}, tools: HandlerTools){
    const nextBlock: StoryBlock = this._getNextBlock();

    //Update milestone
    const milestoneRepo$ = tools.getRepository<StoryBlock>(`subjects/${data.phoneNumber}/stories/${provider.storyId}/milestones`);
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

    const defaultBlock = orgRepo$.getDocumentById('default');
    if(!defaultBlock){
      throw new Error('No default block set');
    }
    return defaultBlock 
  }

  private _getNextBlock(): any{
    let block: any;

    return block 
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