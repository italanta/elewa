import { HttpMethodTypes } from "./http-method-types.enum";

/**
 * The Http methods used to fetch variables from the API has the following properties
 */
export interface HttpMethods {
  /**
   * A placeholder for the name of the Http Method
   */
  name: string;
  /**
   * A placeholder for the value of the variable
   */
  method: HttpMethodTypes;
}