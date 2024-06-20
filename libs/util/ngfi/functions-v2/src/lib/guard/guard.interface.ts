import { FunctionContext } from "../context/context.interface";

/**
 * The gaurd is a part of the function mechanism that checks if a certain condition is met,
 * before executing the cloud function.
 *
 * They are meant for performance, guarding the costs of the company by only executing functions when the need is there.
 *
 * Gaurds are executed after registrar and before the function handler.
 */
export interface Guard<T>
{
  /**
   * Function that checks if the the gaurd condition is met.
   *
   * @param data T to which the conditions need to apply.
   */
  check(data: T, context: FunctionContext): boolean | Promise<boolean>;
}
