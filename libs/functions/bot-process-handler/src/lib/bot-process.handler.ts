import { HandlerTools } from "@iote/cqrs";
import { FunctionContext, FunctionHandler } from "@ngfi/functions";


export class BotProcessHandler extends FunctionHandler<any, any> {

  public async execute(data: any, context: FunctionContext, tools: HandlerTools): Promise<any> {

    const nextBlock = await this._mainProcess(data, tools)

    return nextBlock
      
  }

  private async _mainProcess(data: {phoneNumber: number; message: string}, tools: HandlerTools){
    let block: any;

    // Read the Providers collection and extract story id and org id
    const provider  = this._readProviders(data.phoneNumber, tools)

    // Throw error if the provider does not exist
    if(!provider){
      throw new Error('Provider does not exist!')
    }

    // Get the subject
    const subject =  this._readSubjects(data.phoneNumber, tools)
    
    if(!subject){
      // If subject does not exist, create a new subject
     block = await this.createSubject(data.phoneNumber,tools);
    } else {

      //If subject exists update the existing subject
      block = this.updateSubject(data.phoneNumber,tools);
    }

    return block

  }

  private async createSubject(phoneNumber: number, tools: HandlerTools){
    const newSubjectData = {phoneNumber};
    const defaultBlock = this._getDefaultBlock(tools)

    const subjectRepo$ = tools.getRepository<any>(`Subjects/${phoneNumber}/stories`);

    //Create subject
    const data = await subjectRepo$.create(newSubjectData, phoneNumber.toString())

    //Create milestone
    const milestoneRepo$ = tools.getRepository<any>('milestones');
    const milestone = milestoneRepo$.create(defaultBlock, defaultBlock.id)
    return defaultBlock;
  }

  private async updateSubject(phoneNumber: number, tools: HandlerTools){
    const nextBlock = this._getNextBlock();

    // Get subject
    const subject = this._readSubjects(phoneNumber, tools)

    //Update milestone
    const milestoneRepo$ = tools.getRepository<any>('milestones');
    const milestone = milestoneRepo$.update(nextBlock);
    return nextBlock;
  }

  private _readSubjects(phoneNumber: number, tools: HandlerTools){
    // Get subject
    const subjectRepo$ = tools.getRepository<any>(`Subjects`);
    const subject = subjectRepo$.getDocumentById(phoneNumber.toString())

    return subject
  }

  private _readProviders(phoneNumber: number, tools: HandlerTools){
    // Get providers
    const subjectRepo$ = tools.getRepository<any>('providers');
    const subject = subjectRepo$.getDocumentById(phoneNumber.toString())
    
    return subject
  }

  private _getDefaultBlock(tools: HandlerTools): any{
    let block: any;
    const orgRepo$ = tools.getRepository<any>('orgs');
    return block 
  }

  private _getNextBlock(): any{
    let block: any;

    return block 
  }
}