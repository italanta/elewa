/** A JSON object of objectType of 'Agent' that identifies the learner interacting with the AU.
 *  
 *  @see https://github.com/adlnet/xAPI-Spec/blob/xAPI-1.0.2/xAPI.md#actor
 */
export interface Actor
{
  objectType: "Agent";

  /** The name of the learner */
  name: string;

  /** Additional information to identify the learner */
  account: {
    homePage: string;
    name: string;
  };
}