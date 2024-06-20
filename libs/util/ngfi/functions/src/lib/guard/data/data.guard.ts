import { reduce as __reduce } from "lodash";
import { Guard } from "../guard.interface";

/**
 * Guard that checks if T contains all required parameters before executing the function.
 * 
 * @usage - e.g. 
 */
export class DataGuard<T> implements Guard<T>
{
  constructor(private _needed: string[]) { }

  check(data: any)
  {
    return __reduce(this._needed,
                    // Test if the string need is a param of data.
                    (prev, need) => prev && data[need], 
                    true);
  }

}