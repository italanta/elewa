import { FunctionHandler, FunctionRegistrar, GCFunction, Guard } from "@ngfi/functions";
import { environment } from "./environments/environment";

/**
 * @Description Implementation of GCFunction for the scope of this project. Adds in Environment.
 *              A conceptual representation of a Google Cloud function which contains the logic of 
 *              a Firebase Function of type T (input) -> R (result).
 * @param T: The data expected by the function
 * @param R: The result returned from the function
 */

export class ConvLearnFunction<T, R> extends GCFunction<T,R>{
  constructor(name: string, registrar: FunctionRegistrar<T, R>, guards: Guard<T>[], handler: FunctionHandler<T, R>) {
    super(name, registrar, guards, handler, environment);
  }
}