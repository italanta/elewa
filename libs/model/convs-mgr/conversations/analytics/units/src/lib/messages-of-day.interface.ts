
import { Timestamp } from '@firebase/firestore-types';

/**
 * Aggregate count of all messages, by type, of a given day.
 * 
 * Contains:
 * - Day
 * - # total number of messages back and forth.
 * - # new chats i.e. how many people reached out to the channel on a given day.
// - # "active" chats i.e. chats that sent a message back and forth that day.
 */
export interface MessagesOfDay 
{
  day: Timestamp;
  nMessages: number;
  nNewChats: number;
  nActiveChats: number;
    // How many messages across all chats


}