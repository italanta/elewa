
import { ComponentRef } from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { BlockComponent } from '../components/block/block.component';

import { DocumentMessageBlock, EmailMessageBlock, ImageMessageBlock, LocationMessageBlock, 
          NameMessageBlock, ListMessageBlock, PhoneMessageBlock, QuestionMessageBlock, TextMessageBlock, 
          VideoMessageBlock, VoiceMessageBlock, StickerMessageBlock, ReplyMessageBlock, 
          JumpBlock, MultipleInputMessageBlock,FailBlock, ImageInputBlock, LocationInputBlock, 
          AudioInputBlock, VideoInputBlock, WebhookBlock, OpenEndedQuestionBlock, KeywordMessageBlock, 
          EventBlock,
          AssessmentBrick,
          ConditionalBlock
} from '@app/model/convs-mgr/stories/blocks/messaging';

import { _MessageBlockDecoratePlumb } from './transformers/message-block.jsplumb';
import { _QuestionsBlockDecoratePlumb } from './transformers/questions-block.jsplumb';
import { _LocationBlockDecoratePlumb } from './transformers/location-block.jsplumb';
import { _ImageBlockDecoratePlumb } from './transformers/image-block.jsplumb';
import { _NameBlockDecoratePlumb } from './transformers/name-block.jsplumb';
import { _EmailBlockDecoratePlumb } from './transformers/email-block.jsplumb';
import { _PhoneBlockDecoratePlumb } from './transformers/phonenumber-block.jsplumb';
import { _AudioBlockDecoratePlumb } from './transformers/audio-block.jsplumb';
import { _VideoBlockDecoratePlumb } from './transformers/video-block.jsplumb';
import { _StickerBlockDecoratePlumb } from './transformers/sticker-block.jsplumb';
import { _ListBlockDecoratePlumb } from './transformers/list-block.jsplumb';
import { _DocumentBlockDecoratePlumb } from './transformers/document-block.jsplumb';
import { _ReplyBlockDecoratePlumb } from './transformers/reply-block.jsplumb';
import { _AnchorBlockDecoratePlumb } from './transformers/anchor-block.jsplumb';
import { _JumpBlockDecoratePlumb } from './transformers/jump-block.jsplumb';
import { _FailBlockDecoratePlumb } from './transformers/fail-block.jsplumb';
import { _ImageInputBlockDecoratePlumb } from './transformers/image-input-block.jsplumb';
import { _LocationInputBlockDecoratePlumb } from './transformers/location-input-block.jsplumb';
import { _AudioInputBlockDecoratePlumb } from './transformers/audio-input-block.jsplumb';
import { _VideoInputBlockDecoratePlumb } from './transformers/video-input-block.jsplumb';
import { _WebhookBlockDecoratePlumb } from './transformers/webhook-block.jsplumb';
import { _OpenEndedQuestionBlockDecoratePlumb } from './transformers/open-ended-question-block.jsplumb';
import { _KeywordJumpBlockDecoratePlumb } from './transformers/keyword-jump-block.jsplumb';
import { _EventBlockDecoratePlumb } from './transformers/event-block.jsplumb';
import { _AssessmentBrickDecoratePlumb } from './transformers/assessment-brick.jsplumb';
import { _ConditionalBlockDecoratePlumb } from './transformers/conditional-block.jsplumb';
import { _CMI5BlockDecoratePlumb } from './transformers/cmi5-block.jsplumb';
import { _AssessmentMicroappBlockDecoratePlumb } from './transformers/assessment-micro-app-block.jsplumb';

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

    case StoryBlockTypes.Image:
      return _ImageBlockDecoratePlumb(block, comp, jsPlumb);

    case StoryBlockTypes.Name:
      return _NameBlockDecoratePlumb(block as NameMessageBlock, comp, jsPlumb);

    case StoryBlockTypes.Email:
      return _EmailBlockDecoratePlumb(block as EmailMessageBlock, comp, jsPlumb);

    case StoryBlockTypes.PhoneNumber:
      return _PhoneBlockDecoratePlumb(block as PhoneMessageBlock, comp, jsPlumb);

    case StoryBlockTypes.QuestionBlock:
      return _QuestionsBlockDecoratePlumb(block, comp, jsPlumb);

    case StoryBlockTypes.Location:
      return _LocationBlockDecoratePlumb(block, comp, jsPlumb);

    case StoryBlockTypes.Audio:
        return _AudioBlockDecoratePlumb(block as VoiceMessageBlock, comp, jsPlumb);

    case StoryBlockTypes.Video:
      return _VideoBlockDecoratePlumb(block as VideoMessageBlock, comp, jsPlumb);

    case StoryBlockTypes.Sticker:
      return _StickerBlockDecoratePlumb(block as StickerMessageBlock, comp, jsPlumb);

    case StoryBlockTypes.List:
      return _ListBlockDecoratePlumb(block as ListMessageBlock, comp, jsPlumb);

    case StoryBlockTypes.Document:
        return _DocumentBlockDecoratePlumb(block as DocumentMessageBlock, comp, jsPlumb);

    case StoryBlockTypes.AnchorBlock:
        return _AnchorBlockDecoratePlumb(comp, jsPlumb);

    case StoryBlockTypes.Reply:
      return _ReplyBlockDecoratePlumb(block as ReplyMessageBlock, comp, jsPlumb);

    case StoryBlockTypes.JumpBlock:
      return _JumpBlockDecoratePlumb(block as JumpBlock, comp, jsPlumb);

    case StoryBlockTypes.ImageInput:
      return _ImageInputBlockDecoratePlumb(block as ImageInputBlock, comp, jsPlumb);

    case StoryBlockTypes.FailBlock:
      return _FailBlockDecoratePlumb(block as FailBlock, comp, jsPlumb);

    case StoryBlockTypes.LocationInputBlock:
      return _LocationInputBlockDecoratePlumb(block as LocationInputBlock, comp, jsPlumb);

    case StoryBlockTypes.AudioInput:
      return _AudioInputBlockDecoratePlumb(block as AudioInputBlock, comp, jsPlumb);

    case StoryBlockTypes.VideoInput:
      return _VideoInputBlockDecoratePlumb(block as VideoInputBlock, comp, jsPlumb);

    case StoryBlockTypes.WebhookBlock:
      return _WebhookBlockDecoratePlumb(block as WebhookBlock, comp, jsPlumb);

    case StoryBlockTypes.OpenEndedQuestion:
      return _OpenEndedQuestionBlockDecoratePlumb(block as OpenEndedQuestionBlock, comp, jsPlumb);

    case StoryBlockTypes.keyword:
      return _KeywordJumpBlockDecoratePlumb(block as KeywordMessageBlock, comp, jsPlumb);

    case StoryBlockTypes.Event:
      return _EventBlockDecoratePlumb(block as EventBlock, comp, jsPlumb);

    case StoryBlockTypes.Assessment:
      return _AssessmentBrickDecoratePlumb(block as AssessmentBrick, comp, jsPlumb);

    case StoryBlockTypes.Conditional:
      return _ConditionalBlockDecoratePlumb(block as ConditionalBlock, comp, jsPlumb);

    case StoryBlockTypes.CMI5Block:
      return _CMI5BlockDecoratePlumb(block as ConditionalBlock, comp, jsPlumb);

    case StoryBlockTypes.AssessmentMicroAppBlock:
      return _AssessmentMicroappBlockDecoratePlumb(block as ConditionalBlock, comp, jsPlumb);  
  }

  return comp;
}

