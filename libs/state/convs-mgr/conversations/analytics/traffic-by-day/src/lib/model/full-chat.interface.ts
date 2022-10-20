import { Chat }        from '@elewa/model/conversations/chats';
import { ChatMessage } from '@elewa/model/conversations/messages';
import { Payment }     from '@elewa/model/finance/payments';

/**
 * Data Object that contains all information about a specific chat.
 */
export interface FullChat
{
  chat: Chat;
  messages: ChatMessage[];
  payments: Payment[];
}
