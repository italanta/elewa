
import { ComponentRef } from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { DocumentMessageBlock, EmailMessageBlock, ImageMessageBlock, LocationMessageBlock, 
          NameMessageBlock, ListMessageBlock, PhoneMessageBlock, QuestionMessageBlock, TextMessageBlock, 
          VideoMessageBlock, VoiceMessageBlock, StickerMessageBlock, ReplyMessageBlock, 
          JumpBlock, MultipleInputMessageBlock,FailBlock, ImageInputBlock, LocationInputBlock, 
          AudioInputBlock, VideoInputBlock, WebhookBlock, OpenEndedQuestionBlock, KeywordMessageBlock, 
          EventBlock,
          AssessmentBrick,
          ConditionalBlock
} from '@app/model/convs-mgr/stories/blocks/messaging';

import { StoryModuleBlock } from '@app/model/convs-mgr/stories/blocks/structural';

import { _MessageBlockDecoratePlumb } from '@app/features/convs-mgr/stories/builder/blocks/library/text-message-block';
import { _ImageBlockDecoratePlumb } from '@app/features/convs-mgr/stories/builder/blocks/library/image-message-block';
import { _NameBlockDecoratePlumb } from '@app/features/convs-mgr/stories/builder/blocks/library/name-message-block';
import { _EmailBlockDecoratePlumb } from '@app/features/convs-mgr/stories/builder/blocks/library/email-message-block';
import { _PhoneBlockDecoratePlumb } from '@app/features/convs-mgr/stories/builder/blocks/library/phone-message-block';
import { _QuestionsBlockDecoratePlumb } from '@app/features/convs-mgr/stories/builder/blocks/library/question-message-block';
import { _LocationBlockDecoratePlumb } from '@app/features/convs-mgr/stories/builder/blocks/library/location-message-block';
import { _AudioBlockDecoratePlumb } from '@app/features/convs-mgr/stories/builder/blocks/library/audio-message-block';
import { _VideoBlockDecoratePlumb } from '@app/features/convs-mgr/stories/builder/blocks/library/video-message-block';
import { _StickerBlockDecoratePlumb } from '@app/features/convs-mgr/stories/builder/blocks/library/sticker-message-block';
import { _ListBlockDecoratePlumb } from '@app/features/convs-mgr/stories/builder/blocks/library/list-message-block';
import { _AnchorBlockDecoratePlumb } from '@app/features/convs-mgr/stories/builder/blocks/library/anchor-block';
import { _ReplyBlockDecoratePlumb } from '@app/features/convs-mgr/stories/builder/blocks/library/reply-message-block';
import { _JumpBlockDecoratePlumb } from '@app/features/convs-mgr/stories/builder/blocks/library/jump-story-block';
import { _ImageInputBlockDecoratePlumb } from '@app/features/convs-mgr/stories/builder/blocks/library/image-input-block';
import { _FailBlockDecoratePlumb } from '@app/features/convs-mgr/stories/builder/blocks/library/fail-block';
import { _DocumentBlockDecoratePlumb } from '@app/features/convs-mgr/stories/builder/blocks/library/document-message-block';
import { _LocationInputBlockDecoratePlumb } from '@app/features/convs-mgr/stories/builder/blocks/library/location-input-block';
import { _AudioInputBlockDecoratePlumb } from '@app/features/convs-mgr/stories/builder/blocks/library/audio-input-block';
import { _VideoInputBlockDecoratePlumb } from '@app/features/convs-mgr/stories/builder/blocks/library/video-input-block';
import { _OpenEndedQuestionBlockDecoratePlumb } from '@app/features/convs-mgr/stories/builder/blocks/library/open-ended-question-block';
import { _KeywordJumpBlockDecoratePlumb } from '@app/features/convs-mgr/stories/builder/blocks/library/keyword-jump-block';
import { _AssessmentBrickDecoratePlumb } from '@app/features/convs-mgr/stories/builder/blocks/library/assessment-brick';
import { _EventBlockDecoratePlumb } from '@app/features/convs-mgr/stories/builder/blocks/library/event-block';
import { _ConditionalBlockDecoratePlumb } from '@app/features/convs-mgr/stories/builder/blocks/library/conditional-block';
import { _WebhookBlockDecoratePlumb } from '@app/features/convs-mgr/stories/builder/blocks/library/webhook-block';
import { _StoryModuleBlockDecoratePlumb } from '@app/features/convs-mgr/stories/builder/blocks/library/story-module-block';

/**
 * This function adds jsPlumb endpoints to rendered components. 
 *  The rendering location will depend on the type and configuration of the block.
 * 
 * @param block   - Block data structure. Used by some components to determine location and configuration of the endpoints, anchors, etc.
 * @param comp    - Angular component rendered in the viewport (Type ComponentRef<BlockComponent>) - @note BlockComponent was replaced with any to avoid circular dep
 * @param jsPlumb - Active jsPlumb instance
 */
export function _JsPlumbComponentDecorator(block: StoryBlock, comp: ComponentRef<any>, jsPlumb: BrowserJsPlumbInstance) {
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

    // case StoryBlockTypes.CMI5Block:
    //   return _CMI5BlockDecoratePlumb(block as ConditionalBlock, comp, jsPlumb);

    case StoryBlockTypes.Structural:
      return _StoryModuleBlockDecoratePlumb(block as StoryModuleBlock, comp, jsPlumb);
  }

  return comp;
}

