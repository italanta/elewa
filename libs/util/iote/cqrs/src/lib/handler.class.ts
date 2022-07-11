import { HandlerContext } from './core/handler-context.interface';
import { HandlerTools } from './core/handler-tools.interface';

/**
 * Handler of an event T. Executes logic
 *
 * @param T: The data expected by the function
 * @param R: The result returned from the function
 */
export abstract class Handler<T>
{
  constructor() { }

  /** Contains the actual logic */
  public abstract execute(data: T, context: HandlerContext, tools: HandlerTools): Promise<any>;

}
