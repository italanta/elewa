/**
 * The Outgoing message sent through a channel to a @see {Platform} api which interprets the message and 
 *  sends it to the end user.
 * 
 * The Message needs to be converted into a format the platform can understand, @see {OutgoingMessageParser}
 *  doing so enriches the Outgoing Message to message types that the platform api defines as acceptable message types.
 */
export interface OutgoingMessagePayload
{

}