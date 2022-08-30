import { HandlerTools } from "@iote/cqrs";
import { FunctionHandler } from "@ngfi/functions";
import { HttpsContext } from "libs/util/ngfi/functions/src/lib/context/https-context.interface";

export class MessageHookHandler extends FunctionHandler<{val:any}, any>
{
  public async execute(t:any, context:HttpsContext, tools:HandlerTools)
  {
    //TODO: Move this to environment
    const token = "qasw23edfrtghy657ujkiklop09"
    const queryKey = "hub.verify_token"
    const verifiableToken = context?.eventContext?.request?.query[queryKey]; 
    if(token  == verifiableToken){
      tools.Logger.log(() =>`[MessageHookHandler] Token match successful 😎`);
      const challengeKey = "hub.challenge"
      return context?.eventContext?.request?.query[challengeKey];
    } else {
      tools.Logger.log(() =>`[MessageHookHandler] Token match failed😪`);
      return false
    }
    
  }
  
}