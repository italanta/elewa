import { Response } from 'express';
import { DecodedIdToken, getAuth } from 'firebase-admin/auth';
import { CloudEvent, CloudFunction,  } from 'firebase-functions/v2';
import { HttpsFunction, HttpsOptions, onRequest, Request } from 'firebase-functions/v2/https';

import { FunctionRegistrar } from "../function-registrar.interface";
import { HttpsContext } from '../../context/https-context.interface';

/** 
 * HTTPS Endpoint Registrar.
 * 
 * @see https://firebase.google.com/docs/functions/http-events?gen=2nd
 */
export class EndpointRegistrar<T, R> extends FunctionRegistrar<T, any>
{
  constructor(private _options: HttpsOptions = { region: 'europe-west1', cors: true }) 
  { super(); }

  register(func: (req: any, resp: any) => Promise<void>): CloudFunction<CloudEvent<any>> | HttpsFunction
  {
    return onRequest(this._options, func);
  }

  async before(req: any, resp: any): Promise<{ data: T; context: HttpsContext; }>
  {
    const reqR = req as Request;
    const respR = resp as Response;

    const user = await _determineUser(reqR);

    const context = 
    { 
      isAuthenticated: !!user, userId: user?.id ?? 'noop', 
      userToken: user,
      request: req, response: respR as Response, 
      eventContext: { response: respR }, 
      environment: process.env as any 
    };
    
    return { data: req.body as T, context};
  }

  /** Send back result to the server */
  after(result: R, context: HttpsContext): any 
  {
    return context.response.status(200).send(result);
  }

  onError(e: Error) {
    console.error(e.message);
    console.error(e.stack);

    throw e;
    return new Promise((err) => 'unreachable');
  }

}

/**
 * Authenticates and identifies the firebase user calling the service, if service is not called anonymously.
 * 
 * @param req - Incoming request
 * @see https://github.com/firebase/functions-samples/blob/main/Node-1st-gen/authorized-https-endpoint/functions/index.js
 */
async function _determineUser(req: Request): Promise<DecodedIdToken>
{
  // Get ID token according to code sample 
  let idToken = null;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    idToken = req.headers.authorization.split('Bearer ')[1];
  }
  else if(req.cookies) {
    idToken = req.cookies.__session;
  }
  if(!idToken)
    return null;

  // Retrieved structurally stored ID token. Verifying token.
  try {
    const decodedIdToken = await getAuth().verifyIdToken(idToken);
    
    console.log(`Found ID token inside of the Authorisation Bearer`);
    console.log(decodedIdToken);

    return decodedIdToken;
  } 
  catch (error) {
    console.error('Error while verifying Firebase ID token:');
    console.log(error);

    return null;
  }
}