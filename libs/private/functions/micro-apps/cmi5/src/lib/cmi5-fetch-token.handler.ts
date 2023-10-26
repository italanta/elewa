import { randomBytes } from 'crypto';

import { HandlerTools } from '@iote/cqrs';
import { FunctionHandler, FunctionContext } from '@ngfi/functions';

/**
 * Required as per the CMI5 specification to return an authorization
 *  token that can use to authenticate any xAPI requests from the AU/Learning Activity
 * 
 * ***For testing purposes, it just returns a random code.
 */
export class FetchAuthToken extends FunctionHandler<{}, {}>
{
  public async execute(req: {}, context: FunctionContext, tools: HandlerTools)
  {
    tools.Logger.log(() => `Generating token for AU.....`);

    const token = randomBytes(32).toString('hex');

    return { "auth-token": token } as any;
  }
}