import { Environment, HandlerContext } from '@iote/cqrs';

/** Execution context.
 *
 * @see https://firebase.google.com/docs/reference/functions/cloud_functions_.eventcontext
 *  - For all possible build-in functionalities.
 */
export interface FunctionContext extends HandlerContext {

  isAuthenticated: boolean;
  userId: string;

  eventContext: any;
  params?: any;

  environment: Environment;
}
