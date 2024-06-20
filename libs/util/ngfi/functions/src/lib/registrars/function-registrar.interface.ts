import { CloudFunction, HttpsFunction } from "firebase-functions";

import { Logger, getLogger } from '@iote/cqrs';
import { CustomException } from '@iote/exceptions';

import { FunctionContext } from '../context/context.interface';

/**
 * Registrar.
 *
 * A registrar registers a cloud function to a certain event,
 *  upon which the event needs to be triggered..
 *
 * The registrar also registers the after action.
 */
export abstract class FunctionRegistrar<T, R>
{
  protected _logger: Logger;

  constructor() {           // Temporary Hack - Always do production logger on function registrar
    this._logger = getLogger({ production: true });
  }

  /**
   * Action before execution of function. Registers the passed function as a cloudfunction.
   */
  abstract register(func: (dataSnap: any, context: FunctionContext) => Promise<R>): CloudFunction<any> | HttpsFunction;

  /**
   * Convert params of specific registrar into parameters tailored to FunctionHandler
   */
  abstract before(dataSnap: any, context: FunctionContext): { data: T, context: FunctionContext };

  /**
   * Wrapper function that wraps a function handler in a cloudfunction of choice..
   *
   * SEALED! Do not override!
   */
  wrap(func: (data: T, context: FunctionContext) => Promise<R>): CloudFunction<any> | HttpsFunction
  {
    return this.register((data, context) =>
    {
      const params = this.before(data, context);

      return func(params.data, params.context)
                .then((r: R) => this.after(r, params.context))
                .catch(this.onErrorHandleCustom.bind(this));
    });
  }

  /**
   * After action. Prepare an after event such as sending the result back to the user over REST or
   * storing the result on firestore.
   *
   * @param result
   */
  abstract after(result: R, context: FunctionContext): any;


  /**
   * 09/07 - Introduction of error handling infrastructure.
   *
   * Custom exception cases to be handled automatically by the system.
   */
  onErrorHandleCustom(error: CustomException): Promise<any>
  {
    try {
      if(error.isCustom)
        return error.handle();
    }
    // Error handler can still crash.
    catch(e)
    { return this.onError(e); }

    // Default handler
    return this.onError(error);
  }

  /**
   * Error handling function.
   *
   * @param error - The error that occured.
   */
  abstract onError(error: Error): Promise<any>;

}
