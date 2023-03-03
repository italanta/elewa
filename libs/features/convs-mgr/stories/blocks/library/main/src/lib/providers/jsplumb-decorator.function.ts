
import { ComponentRef } from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { BlockComponent } from '../components/block/block.component';

import { DocumentMessageBlock, EmailMessageBlock, ImageMessageBlock, LocationMessageBlock, 
          NameMessageBlock, ListMessageBlock, PhoneMessageBlock, QuestionMessageBlock, TextMessageBlock, 
          VideoMessageBlock, VoiceMessageBlock, StickerMessageBlock, ReplyMessageBlock, 
          JumpBlock, MultipleInputMessageBlock,FailBlock, ImageInputBlock, LocationInputBlock, 
          AudioInputBlock, VideoInputBlock, WebhookBlock, OpenEndedQuestionBlock, KeywordMessageBlock 
} from '@app/model/convs-mgr/stories/blocks/messaging';

import { _MessageBlockDecoratePlumb } from './message-block.jsplumb';
import { _QuestionsBlockDecoratePlumb } from './questions-block.jsplumb';
import { _LocationBlockDecoratePlumb } from './location-block.jsplumb';
import { _ImageBlockDecoratePlumb } from './image-block.jsplumb';
import { _NameBlockDecoratePlumb } from './name-block.jsplumb';
import { _EmailBlockDecoratePlumb } from './email-block.jsplumb';
import { _PhoneBlockDecoratePlumb } from './phonenumber-block.jsplumb';
import { _AudioBlockDecoratePlumb } from './audio-block.jsplumb';
import { _VideoBlockDecoratePlumb } from './video-block.jsplumb';
import { _StickerBlockDecoratePlumb } from './sticker-block.jsplumb';
import { _ListBlockDecoratePlumb } from './list-block.jsplumb';
import { _DocumentBlockDecoratePlumb } from './document-block.jsplumb';
import { _ReplyBlockDecoratePlumb } from './reply-block.jsplumb';
import { _AnchorBlockDecoratePlumb } from './anchor-block.jsplumb';
import { _JumpBlockDecoratePlumb } from './jump-block.jsplumb';
import { _MultipleBlockDecoratePlumb } from './multiple-block.jsplumb';
import { _FailBlockDecoratePlumb } from './fail-block.jsplumb';
import { _ImageInputBlockDecoratePlumb } from './image-input-block.jsplumb';
import { _LocationInputBlockDecoratePlumb } from './location-input-block.jsplumb';
import { _AudioInputBlockDecoratePlumb } from './audio-input-block.jsplumb';
import { _VideoInputBlockDecoratePlumb } from './video-input-block.jsplumb';
import { _WebhookBlockDecoratePlumb } from './webhook-block.jsplumb';
import { _OpenEndedQuestionBlockDecoratePlumb } from './open-ended-question-block.jsplumb';
import { _KeywordJumpBlockDecoratePlumb } from './keyword-jump-block.jsplumb';

/**
 * This function adds jsPlumb endpoints to rendered components. 
 *  The rendering location will depend on the type and configuration of the block.
 * 
 * @param block   - Block data structure. Used by some components to determine location and configuration of the endpoints, anchors, etc.
 * @param comp    - Angular component rendered in the viewport 
 * @param jsPlumb - Active jsPlumb instance
 */
export function _JsPlumbComponentDecorator(block: StoryBlock, comp: ComponentRef<BlockComponent>, jsPlumb: BrowserJsPlumbInstance) {
  /** Lift component into jsPlumb world. */
  jsPlumb.manage(comp.location.nativeElement, block.id);
  
  switch (block.type) {
    case StoryBlockTypes.TextMessage:
      return _MessageBlockDecoratePlumb(block, comp, jsPlumb);
      break;
    case StoryBlockTypes.Image:
      return _ImageBlockDecoratePlumb(block, comp, jsPlumb);
      break;
    case StoryBlockTypes.Name:
      return _NameBlockDecoratePlumb(block as NameMessageBlock, comp, jsPlumb);
      break;
    case StoryBlockTypes.Email:
      return _EmailBlockDecoratePlumb(block as EmailMessageBlock, comp, jsPlumb);
      break;
    case StoryBlockTypes.PhoneNumber:
      return _PhoneBlockDecoratePlumb(block as PhoneMessageBlock, comp, jsPlumb);
      break;
    case StoryBlockTypes.QuestionBlock:
      return _QuestionsBlockDecoratePlumb(block, comp, jsPlumb);
      break;
    case StoryBlockTypes.Location:
      return _LocationBlockDecoratePlumb(block, comp, jsPlumb);
      break;
    case StoryBlockTypes.Audio:
        return _AudioBlockDecoratePlumb(block as VoiceMessageBlock, comp, jsPlumb);
    case StoryBlockTypes.Video:
      return _VideoBlockDecoratePlumb(block as VideoMessageBlock, comp, jsPlumb);
      break;

    case StoryBlockTypes.Sticker:
      return _StickerBlockDecoratePlumb(block as StickerMessageBlock, comp, jsPlumb);
    case StoryBlockTypes.List:
      return _ListBlockDecoratePlumb(block as ListMessageBlock, comp, jsPlumb);
      break;
    case StoryBlockTypes.Document:
        return _DocumentBlockDecoratePlumb(block as DocumentMessageBlock, comp, jsPlumb);
    case StoryBlockTypes.AnchorBlock:
        return _AnchorBlockDecoratePlumb(comp, jsPlumb);
        break;
    case StoryBlockTypes.Reply:
      return _ReplyBlockDecoratePlumb(block as ReplyMessageBlock, comp, jsPlumb);
      break;
    case StoryBlockTypes.JumpBlock:
      return _JumpBlockDecoratePlumb(block as JumpBlock, comp, jsPlumb);
      break;
    case StoryBlockTypes.MultipleInput:
      return _MultipleBlockDecoratePlumb(block as MultipleInputMessageBlock, comp, jsPlumb);
    case StoryBlockTypes.ImageInput:
      return _ImageInputBlockDecoratePlumb(block as ImageInputBlock, comp, jsPlumb);
      break;
    case StoryBlockTypes.FailBlock:
      return _FailBlockDecoratePlumb(block as FailBlock, comp, jsPlumb);
      break;
    case StoryBlockTypes.LocationInputBlock:
      return _LocationInputBlockDecoratePlumb(block as LocationInputBlock, comp, jsPlumb);
    case StoryBlockTypes.AudioInput:
      return _AudioInputBlockDecoratePlumb(block as AudioInputBlock, comp, jsPlumb);
    case StoryBlockTypes.VideoInput:
      return _VideoInputBlockDecoratePlumb(block as VideoInputBlock, comp, jsPlumb);
      break;
    case StoryBlockTypes.WebhookBlock:
      return _WebhookBlockDecoratePlumb(block as WebhookBlock, comp, jsPlumb);
      break;
    case StoryBlockTypes.OpenEndedQuestion:
      return _OpenEndedQuestionBlockDecoratePlumb(block as OpenEndedQuestionBlock, comp, jsPlumb);
      break;
    case StoryBlockTypes.keyword:
      return _KeywordJumpBlockDecoratePlumb(block as KeywordMessageBlock, comp, jsPlumb);
      break;
  }

  return comp;
}

