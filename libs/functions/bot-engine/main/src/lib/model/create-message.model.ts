import * as _ from 'lodash';

import {  ChatMessage, ButtonMessage, TextMessage, ImageMessage, ResourceMessage } from '@app/model/convs-mgr/conversations/messages';
import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

export function createMessage(data: StoryBlock) : ChatMessage
{
  const message = _createMessageBase(data);

  switch(data.type)
  {
    case StoryBlockTypes.TextMessage:
      return _createTextMessage(message, data);
    case StoryBlockTypes.QuestionBlock:
      return _createQuestionMessage(message, data);
    case StoryBlockTypes.PhoneNumber:
      return _createPhoneMessage(message, data);
    case StoryBlockTypes.Image:
      return _createImageMessage(message, data);
    case StoryBlockTypes.Location:
      return _createLocationMessage(message, data);
    case StoryBlockTypes.Name:
      return _createNameMessage(message, data);
    case StoryBlockTypes.Email:
      return _createEmailMessage(message, data);
    default:
      return message;
  }
}

function _createMessageBase(msg: StoryBlock) : ChatMessage
{
  throw new Error("Not yet implemented")
}

function _createTextMessage(msg: ChatMessage, data: StoryBlock) : TextMessage
{
  throw new Error("Not yet implemented")
}

function _createQuestionMessage(msg: ChatMessage, data: StoryBlock) : TextMessage
{
  throw new Error("Not yet implemented")
}

function _createPhoneMessage(msg: ChatMessage, data: StoryBlock) : ButtonMessage
{
  throw new Error("Not yet implemented")
}

function _createImageMessage(msg: ChatMessage, data: StoryBlock) : ImageMessage
{
  throw new Error("Not yet implemented")
}

function _createLocationMessage(msg: ChatMessage, data: StoryBlock) : ResourceMessage
{
  throw new Error("Not yet implemented")
}

function _createNameMessage(msg: ChatMessage, data: StoryBlock) : ResourceMessage
{
  throw new Error("Not yet implemented")
}

function _createEmailMessage(msg: ChatMessage, data: StoryBlock) : ResourceMessage
{
  throw new Error("Not yet implemented")
}