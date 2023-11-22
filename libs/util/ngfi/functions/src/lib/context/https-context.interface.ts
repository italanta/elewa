import { Response } from "express";
import { FunctionContext } from './context.interface';

export interface HttpsContext extends FunctionContext
{
  request: Request;
  response: Response;
}
