/**
 * The variable request and response by the user accepts the followind data types
 */
import { IObject } from "@iote/bricks";

export interface Variable extends IObject {
  /**
   * A placeholder for the name of the variable
   */
  name: string;
  /**
   * A placeholder for the value of the variable
   */
  value: any;
}