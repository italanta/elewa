import { HandlerTools } from "@iote/cqrs";
import { RestResult200 } from "@ngfi/functions";

/**
 * @Description When creating webhook, meta needs to validate webhook using a 'GET' request
 *              with token provided on developer console and token in application
 * @param context 
 * @param tools 
 * @param token 
 * @returns challengeKey which is used to validate webhook
 */
export function __VerifyWhatsAppTokenWebHook(context: any, tools:HandlerTools, token:string)
{
  const queryKey = "hub.verify_token"
  const verifiableToken = context?.eventContext?.request?.query[queryKey]; 
  if(token  == verifiableToken){
    tools.Logger.log(() =>`[__VerifyWhatsAppTokenWebHook] Token match successful ✅`);
    const challengeKey = "hub.challenge";
    return (context.eventContext.request.query[challengeKey]) as RestResult200;
  } else {
    throw new Error(`[__VerifyWhatsAppTokenWebHook] Token match failed ⛔`);
  }
}