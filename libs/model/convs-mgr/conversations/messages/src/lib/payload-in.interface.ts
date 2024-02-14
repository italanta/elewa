/**
 * Unprocessed part of the message sent through a channel by a platform which contains
 *  the actual message payload i.e. the message (text, image, video, voice, location, ...) the user
 *  sent to the bot. 
 * 
 * Needs to be converted into a format our engine can understand,
 *  doing so enriches the IncomingChatMessage to a "TextMessage", "ImageMessage", "VoiceMessage", ...
 */
export interface IncomingMessagePayload
{

}