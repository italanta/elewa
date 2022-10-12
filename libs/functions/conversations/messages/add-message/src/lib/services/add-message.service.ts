import { BaseMessage, RawMessageData } from '@app/model/convs-mgr/conversations/messages';

export abstract class AddMessageService<T> {

  constructor() {}

  abstract addMessage(msg: RawMessageData, channel: T): void;

  /**
   * Adds the new text message to the collection with the timestamp as the id
   */
  protected abstract _addTextMessage(msg: RawMessageData, channel: T): Promise<BaseMessage>;

  protected abstract _addImageMessage(msg: RawMessageData, channel: T): Promise<BaseMessage>;

}
