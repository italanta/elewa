import { Actor } from "./actor.interface";
import { AUResult } from "./assignable-unit.interface";

/**
 * An xAPI statement is a way of capturing data about learning experiences and 
 *    is expressed as a JSON object.
 * 
 * This is the format through which the AU will update us on the learner progress.
 * 
 * It is also how the LMS should communicate with the Learner Record Store. Since in our
 *  case the LMS contains the Learners Record, we just update the records directly
 *    without sending statements to ourselves. 
 * Because by xAPI spec definition - an LRS is a system that stores learning information
 * 
 * @see https://github.com/adlnet/xAPI-Spec/blob/xAPI-1.0.2/xAPI.md#stmtprops
 */
export interface xAPIStatement<T>
{
  id: string;

  /** A JSON object of objectType of Agent that identifies the learner interacting with the AU.
   *  
   *  @see https://github.com/adlnet/xAPI-Spec/blob/xAPI-1.0.2/xAPI.md#actor
   */
  actor: Actor;

  /** Defines the action being done by the Actor within the Activity within a Statement. */
  verb: {
    id: string;
    display: {
      [key: string]: string;
    };
  };

  object: {
    id: string;
    objectType: string;

    definition: {
      name: {
        [key: string]: string;
      },
      description: {
        [key: string]: string;
      };
    };
  };

  /** Gives further details representing a measured outcome relevant to the specified Verb. */
  result?: AUResult;

  context: {
    registration: string;
    contextActivities: T;
  };

  /** Provide a natural way to extend the xAPI statements for some specialized use. The contents of 
   *    these extensions might be something valuable to just one application, or it might be a 
   *        convention used by an entire community of practice. 
   * 
   *  One of the extensions that can be defined is the Session ID 
   * */
  extensions: {
    [key: string]: any;
  };
}