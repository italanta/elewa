import { randomBytes } from 'crypto';

import { HandlerTools } from '@iote/cqrs';
import { FunctionHandler, FunctionContext } from '@ngfi/functions';

export class FetchAuthToken extends FunctionHandler<{}, {}>
{
  public async execute(req: {}, context: FunctionContext, tools: HandlerTools)
  {
    tools.Logger.log(() => `Generating token for AU.....`);

    const token = randomBytes(32).toString('hex');

    return { "auth-token": token } as any;
  }
}