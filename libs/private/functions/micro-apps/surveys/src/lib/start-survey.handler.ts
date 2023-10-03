import { randomBytes } from 'crypto';

import { HandlerTools } from '@iote/cqrs';
import { FunctionHandler, FunctionContext } from '@ngfi/functions';


export class StartSurveyHandler extends FunctionHandler<{}, {}>
{
  public async execute(req: {}, context: FunctionContext, tools: HandlerTools)
  {
    tools.Logger.log(() => `Generating token for AU.....`);

    const token = randomBytes(32).toString('hex');

    return { "auth-token": token } as any;
  }
}

export interface StartSurveyReq 
{
  enrolledUserIds: string[];
  messageTemplateName?: string;
  
}