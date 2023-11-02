

import { FormArray, FormBuilder } from "@angular/forms";
import { StoryBlock, StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";

import { _CreateTextMessageBlockForm }      from "./model/message-block-form.model";
import { _CreateImageMessageBlockForm }     from "./model/image-block-form.model";
import { _CreateNameMessageBlockForm }      from "./model/name-block-form.model";
import { _CreateEmailMessageBlockForm }     from "./model/email-block-form.model";
import { _CreatePhoneMessageBlockForm }     from "./model/phonenumber-block-form.model";
import { _CreateQuestionBlockMessageForm }  from "./model/questions-block-form.model";
import { _CreateLocationBlockForm }         from "./model/location-block-form.model";
import { _CreateListBlockMessageForm }      from "./model/list-block-form.model";
import { _CreateDocumentMessageBlockForm }  from "./model/document-block-form.model";
import { _CreateAudioBlockForm }            from "./model/audio-block-form.model";
import { _CreateVideoMessageBlockForm }     from "./model/video-block-form.model";
import { _CreateStickerBlockForm }          from "./model/sticker-block-form.model";
import { _CreateReplyBlockForm }            from "./model/reply-block-form.model";
import { _CreateJumpBlockForm }             from "./model/jump-block-form.model";
import { _CreateMultipleInputMessageBlockForm } from "./model/multiple-input-message-block-form.model";
import { _CreateFailBlockForm }             from "./model/fail-block-form.model";
import { _CreateImageInputBlockForm }       from "./model/image-input-block-form.model";
import { _CreateLocationInputBlockForm }    from "./model/location-input-block-form.model";
import { _CreateAudioInputBlockForm }       from "./model/audio-input-block-form.model";
import { _CreateWebhookBlockForm }          from "./model/webhook-block-form.model";
import { _CreateEndStoryAnchorBlockForm }   from "./model/end-story-anchor-block-form.model";
import { _CreateOpenEndedQuestionBlockForm } from "./model/open-ended-question-block-form.model";
import { _CreateVideoInputBlockForm }       from "./model/video-input-block-form.model";
import { _CreateKeywordJumpBlockMessageForm } from "./model/keyword-jump-form.model";
import { _CreateEventBlockForm }            from "./model/event-block-form.model";
import { _CreateAssessmentBrickForm }       from "./model/assessment-brick-form.model";
import { _CreateConditionalBlockForm }      from "./model/conditional-block.model";
import { _CreateCmi5BlockForm }             from "./model/cmi5-block-form.model";

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

    case StoryBlockTypes.MultipleInput:
      return _CreateMultipleInputMessageBlockForm(_fb, block);

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

    case StoryBlockTypes.CMI5Block:
      return _CreateCmi5BlockForm(_fb, block);
  }
  // Default return null
  return null;
}