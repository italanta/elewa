
/** The type of message you are sending is set in the messaging_type parameter. 
 *    This parameter is a more explicit way to ensure your messaging complies with
 *       messaging policies and the recipient's preferences. 
 * 
 * @see https://developers.facebook.com/docs/messenger-platform/send-messages/#messaging_types
 * */
export enum MessengerMessagingTypes { 
  /** The message you are sending is a response to a received message. 
   *    The message can contain promotional and non-promotional content and 
   *      must be sent during the standard messaging window. */
  RESPONSE = 'RESPONSE',

  /** The message you are sending is being sent proactively and is not
   *   in response to a received message. 
   *  The message can contain promotional and non-promotional content and 
   *    must be sent during the standard messaging window. 
   */
  UPDATE = 'UPDATE',

  /** The message you are sending is being sent outside the standard messaging 
   *    window. This message must include a message tag that matches the 
   *      allowed use case for the tag and contains non-promotional content.
   */
  MESSAGE_TAG = 'MESSAGE_TAG'
}