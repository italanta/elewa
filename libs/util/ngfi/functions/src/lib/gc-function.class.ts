import { CloudFunction, HttpsFunction } from 'firebase-functions';

import { Logger, getLogger, HandlerContext } from '@iote/cqrs';
import { AdminRepositoryFactory } from '@ngfi/admin-data';
import { HandlerTools } from '@iote/cqrs';

import { FunctionHandler } from './function-handler.class';
import { FunctionRegistrar } from './registrars/function-registrar.interface';

import { Guard } from './guard/guard.interface';
import { wrapGaurd } from './guard/wrap-gaurd.util';
import { createContext } from './context/create-context.util';
import { Environment } from './environment.interface';

/**
 * A conceptual representation of a Google Cloud function which contains the logic of a Firebase Function of type T (input) -> R (result).
 *
 * @param T: The data expected by the function
 * @param R: The result returned from the function
 */
export class GCFunction<T, R> {

  protected _logger: Logger;
  protected _tools: HandlerTools;

  constructor(private _name: string,
              private _registrar: FunctionRegistrar<T, R>,
              private _guards   : Guard<T>[],
              private _handler  : FunctionHandler<T,R>,
              private  _environment: Environment)
  {
    this._logger = getLogger(this._environment);
    this._tools = {
      Logger: this._logger,
      getRepository: AdminRepositoryFactory.create
    };
  }

  /**
   * Turns the registered function into an actual cloud function.
   */
  build(): CloudFunction<any> | HttpsFunction
  {
    // Start with the inner core function which is the handler logic or this._handler.execute
    // From there, move up the chain by adding extra layers and steps.

    // 1) Bind function scope.
                          // Handler loses scope because of wrapping. Explicitely bind it to its scope.
                          // Needs a cast too to ensure not breaking the types. R is lost "=> Promise<{}>"
    const funcWithScope = <(data: T, context: HandlerContext, tools: HandlerTools) => Promise<R>> this._handler.execute.bind(this._handler);

    // 2) Bind function context.
    const funcWithContext = (data: any, context: HandlerContext) => funcWithScope(data, createContext(context, this._environment), this._tools);

    // 3) Wrap the guard around the handler. If the guard fails halt execution and throw an error.
    const gaurdedFunc = wrapGaurd(funcWithContext, this._guards, this._name, this._logger);

    // 4) Register function onto Firebase
    const registeredFunc = this._registrar.wrap(gaurdedFunc);

    // 5) Return built function
    return registeredFunc;
  }

}
