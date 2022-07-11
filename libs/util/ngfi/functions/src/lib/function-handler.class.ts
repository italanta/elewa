import { Handler, HandlerTools } from '@iote/cqrs';

import { FunctionContext } from './context/context.interface';

/**
 * The handler which contains the logic of a Firebase Function of type T (input) -> R (result).
 *
 * @param T: The data expected by the function
 * @param R: The result returned from the function
 */
export abstract class FunctionHandler<T, R> extends Handler<T>
{
  constructor() {
    super();
  }

  /** Contains the actual logic */
  public abstract execute(data: T, context: FunctionContext, tools: HandlerTools): Promise<R>;

}
