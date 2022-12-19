import { EndUserPosition } from "@app/model/convs-mgr/conversations/admin/system";
import { EndUser } from "@app/model/convs-mgr/conversations/chats";
import { Message } from "@app/model/convs-mgr/conversations/messages";

/**
 * When out chatbot receives a message from the end user, we need to figure out how to
 *  respond back to them.
 * 
 * Here we define a model that is resposible for 'playing' the end user through the stories. @see {Story}.
 *  It receives the message and responds with the next block in the story.
 */
export interface IBotEnginePlay
{
  play: (message: Message, endUser: EndUser, endUserPosition?: EndUserPosition) => void;
}