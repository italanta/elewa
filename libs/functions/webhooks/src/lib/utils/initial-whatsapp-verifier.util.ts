import { HandlerTools } from "@iote/cqrs";

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
    tools.Logger.log(() =>`✅✅✅[MessageHookHandler] Token match successful ✅✅✅`);
    const challengeKey = "hub.challenge"
    return context?.eventContext?.request?.query[challengeKey];
  } else {
    tools.Logger.log(() =>`⛔⛔⛔[MessageHookHandler] Token match failed ⛔⛔⛔`);
    throw new Error(`⛔⛔⛔[MessageHookHandler] Token match failed ⛔⛔⛔`);
  }
}