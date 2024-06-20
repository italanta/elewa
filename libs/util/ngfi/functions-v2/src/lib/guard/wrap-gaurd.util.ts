import { FunctionContext } from '../context/context.interface';
import { Logger } from '@iote/cqrs';

import { Guard } from './guard.interface';

/**
   * Applies guards to functions before executing.
   *
   * @param func   - The function to guard.
   * @param name   - The function name
   * @param logger - Logger to use
   *
   * @returns    - A function that wraps the guard around the function handler.
   */
export function wrapGaurd<T, R>(func: (data: T, context: FunctionContext) => Promise<R>, guards: Guard<T>[], name: string, logger: Logger)
{
  return (data: T, context: FunctionContext) =>
  {
    logger.debug(() => `Executing guards of function ${name}.`);

    return _guardReducer(data, context, guards, true)
              .then((result: any) =>
                  _handleResult<T, R>(func, data, context, name, logger, result));

  }
}

export function _handleResult<T, R>(func: (data: T, context: FunctionContext) => Promise<R>, data: T, context: FunctionContext, name: string, logger: Logger, result: boolean)
{
  if (result) {
    logger.debug(() => `Guard for func ${name} succeeded. Guard conditions met.`);
    return func(data, context);
  }
  else {
    logger.error(() => `Guard for func ${name} failed. Guard conditions have not been met. Blocking function execution.`);
    throw new Error(`Guard for function  ${name} failed. Halted execution.`);
  }
}


/** Simple implementation of a reducer that works with promises.
 * Given a guard can be both synchronous as asynchronous, we lift every method up to a promise using promise.resolve.
*/
function _guardReducer<T>(data: T, context: FunctionContext, guards: Guard<T>[], prev: boolean): Promise<boolean | T>
{
  // If done or failed, return the final value
  if (!prev || guards.length === 0)
    return Promise.resolve(prev);
  else
  {
    const guard = guards.shift();
    const check = guard != null && guard.check(data, context);

            // Neutralises the issue that a guard can be both promise as value. Lift all to Promise Monad.
    return Promise.resolve(check)
                                                  // We already know prev is true, else we would have returned by now
                  .then(c => _guardReducer(data, context, guards, c))
  }
}
