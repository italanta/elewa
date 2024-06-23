

import { FormBuilder } from "@angular/forms";
import { StoryBlock, StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";

import { _CreateEndStoryAnchorBlockForm }   from "./model/end-story-anchor-block-form.model";

import { StoryModuleBlock } from "@app/model/convs-mgr/stories/blocks/structural";

import { _CreateTextMessageBlockForm } from "@app/features/convs-mgr/stories/builder/blocks/library/text-message-block";
import { _CreateImageMessageBlockForm } from "@app/features/convs-mgr/stories/builder/blocks/library/image-message-block";
import { _CreateNameMessageBlockForm } from "@app/features/convs-mgr/stories/builder/blocks/library/name-message-block";
import { _CreatePhoneMessageBlockForm } from "@app/features/convs-mgr/stories/builder/blocks/library/phone-message-block";
import { _CreateQuestionBlockMessageForm } from "@app/features/convs-mgr/stories/builder/blocks/library/question-message-block";
import { _CreateLocationBlockForm } from "@app/features/convs-mgr/stories/builder/blocks/library/location-message-block";
import { _CreateListBlockMessageForm } from "@app/features/convs-mgr/stories/builder/blocks/library/list-message-block";
import { _CreateDocumentMessageBlockForm } from "@app/features/convs-mgr/stories/builder/blocks/library/document-message-block";
import { _CreateVideoMessageBlockForm } from "@app/features/convs-mgr/stories/builder/blocks/library/video-message-block";
import { _CreateStickerBlockForm } from "@app/features/convs-mgr/stories/builder/blocks/library/sticker-message-block";
import { _CreateReplyBlockForm } from "@app/features/convs-mgr/stories/builder/blocks/library/reply-message-block";
import { _CreateJumpBlockForm } from "@app/features/convs-mgr/stories/builder/blocks/library/jump-story-block";
import { _CreateFailBlockForm } from "@app/features/convs-mgr/stories/builder/blocks/library/fail-block";
import { _CreateImageInputBlockForm } from "@app/features/convs-mgr/stories/builder/blocks/library/image-input-block";
import { _CreateLocationInputBlockForm } from "@app/features/convs-mgr/stories/builder/blocks/library/location-input-block";
import { _CreateWebhookBlockForm } from "@app/features/convs-mgr/stories/builder/blocks/library/webhook-block";
import { _CreateOpenEndedQuestionBlockForm } from "@app/features/convs-mgr/stories/builder/blocks/library/open-ended-question-block";
import { _CreateVideoInputBlockForm } from "@app/features/convs-mgr/stories/builder/blocks/library/video-input-block";
import { _CreateKeywordJumpBlockMessageForm } from "@app/features/convs-mgr/stories/builder/blocks/library/keyword-jump-block";
import { _CreateAssessmentBrickForm } from "@app/features/convs-mgr/stories/builder/blocks/library/assessment-brick";
import { _CreateStoryModuleBlockForm } from "@app/features/convs-mgr/stories/builder/blocks/library/story-module-block";
import { _CreateEmailMessageBlockForm } from "@app/features/convs-mgr/stories/builder/blocks/library/email-message-block";
import { _CreateAudioBlockForm } from "@app/features/convs-mgr/stories/builder/blocks/library/audio-message-block";
import { _CreateConditionalBlockForm } from "@app/features/convs-mgr/stories/builder/blocks/library/conditional-block";
import { _CreateEventBlockForm } from "@app/features/convs-mgr/stories/builder/blocks/library/event-block";
import { _CreateAudioInputBlockForm } from "@app/features/convs-mgr/stories/builder/blocks/library/audio-input-block";

/**
 * This class controls the inheritance behaviour of blocks, adding polymorphic behaviour based on block type.
 *
 * @param block - The block to morph
 * @param type  - The type to morph to
 * @param blocksGroup - The array in which to push the block
 * @returns 
 */
export function _DetermineBlockType(block: StoryBlock, type: StoryBlockTypes, _fb: FormBuilder)
{
  return  _renderBlockByType(block, type, _fb);
}

function _renderBlockByType(block: StoryBlock, type: StoryBlockTypes, _fb: FormBuilder)
{
  switch (type) 
  {
    case StoryBlockTypes.TextMessage:
      return _CreateTextMessageBlockForm(_fb, block);

    case StoryBlockTypes.Image:
      return _CreateImageMessageBlockForm(_fb, block);

    case StoryBlockTypes.Name:
      return _CreateNameMessageBlockForm(_fb, block);

    case StoryBlockTypes.Email:
      return _CreateEmailMessageBlockForm(_fb, block);

    case StoryBlockTypes.PhoneNumber:
      return _CreatePhoneMessageBlockForm(_fb, block);

    case StoryBlockTypes.QuestionBlock:
      return _CreateQuestionBlockMessageForm(_fb, block);

    case StoryBlockTypes.Location:
      return _CreateLocationBlockForm(_fb, block);

    case StoryBlockTypes.List:
      return _CreateListBlockMessageForm(_fb, block);

    case StoryBlockTypes.Document:
      return _CreateDocumentMessageBlockForm(_fb, block);

    case StoryBlockTypes.Audio:
      return _CreateAudioBlockForm(_fb, block);

    case StoryBlockTypes.Video:
      return _CreateVideoMessageBlockForm(_fb, block);

    case StoryBlockTypes.Sticker:
      return _CreateStickerBlockForm(_fb, block);

    case StoryBlockTypes.Reply:
      return _CreateReplyBlockForm(_fb, block);

    case StoryBlockTypes.JumpBlock:
      return _CreateJumpBlockForm(_fb, block);

    case StoryBlockTypes.FailBlock:
      return _CreateFailBlockForm(_fb, block);

    case StoryBlockTypes.ImageInput:
      return _CreateImageInputBlockForm(_fb, block);

    case StoryBlockTypes.LocationInputBlock:
      return _CreateLocationInputBlockForm(_fb, block);

    case StoryBlockTypes.AudioInput:
      return _CreateAudioInputBlockForm(_fb, block);

    case StoryBlockTypes.WebhookBlock:
      return _CreateWebhookBlockForm(_fb, block);

    case StoryBlockTypes.EndStoryAnchorBlock:
      return _CreateEndStoryAnchorBlockForm(_fb, block);

    case StoryBlockTypes.OpenEndedQuestion:
      return _CreateOpenEndedQuestionBlockForm(_fb, block);

    case StoryBlockTypes.VideoInput:
      return _CreateVideoInputBlockForm(_fb, block);

    case StoryBlockTypes.keyword:
      return _CreateKeywordJumpBlockMessageForm(_fb, block);

    case StoryBlockTypes.Event:
      return _CreateEventBlockForm(_fb, block);

    case StoryBlockTypes.Assessment:
      return _CreateAssessmentBrickForm(_fb, block);

    case StoryBlockTypes.Conditional:
      return _CreateConditionalBlockForm(_fb, block);

    case StoryBlockTypes.Structural:
      return _CreateStoryModuleBlockForm(_fb, block as StoryModuleBlock);

    // case StoryBlockTypes.CMI5Block:
    //   return _CreateCmi5BlockForm(_fb, block);
  }
  // Default return null
  return null;
}