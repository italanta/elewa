import { Response } from 'express';
import { Request } from 'firebase-functions/v2/https';
import { FunctionContext } from './context.interface';


export interface HttpsContext extends FunctionContext
{
  request: Request;
  response: Response;
}
