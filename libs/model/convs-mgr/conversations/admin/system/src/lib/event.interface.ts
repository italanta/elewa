import { Block } from '@app/model/convs-mgr/conversations/chats';
import { IObject } from '@iote/bricks';
import { EventCategoryTypes } from './event-category-types.enum';

export interface Event
{
  category: EventCategoryTypes;
  type: string;
  dateCreated: string;
  payload: {};
  origin: string; //Id of the party that triggered the event
  subject: string; //Id of the party affected by the event
}


export interface Activity extends IObject{
  chatId: string;
  block: Block;
}