import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { ConditionalBlockEditComponent, 
         DocumentOutputBlockEditComponent, 
         ImageOutputBlockEditComponent, 
         ListBlockEditComponent, 
         LocationOutputBlockEditComponent, 
         QuestionButtonsEditFormsComponent } from '@app/features/convs-mgr/stories/blocks/edit/blocks-edit';
import { LocationInputBlockEditComponent } from '@app/features/convs-mgr/stories/blocks/edit/blocks-edit';
import { KeywordJumpBlockEditComponent } from '@app/features/convs-mgr/stories/blocks/edit/blocks-edit';
import { OpenEndedQuestionEditComponent } from '@app/features/convs-mgr/stories/blocks/edit/blocks-edit';
import { AudioInputBlockEditComponent } from '@app/features/convs-mgr/stories/blocks/edit/blocks-edit';
import { VideoInputBlockEditComponent } from '@app/features/convs-mgr/stories/blocks/edit/blocks-edit';
import { ImageInputBlockEditComponent } from '@app/features/convs-mgr/stories/blocks/edit/blocks-edit';
import { AssessmentBrickEditComponent } from '@app/features/convs-mgr/stories/blocks/edit/blocks-edit';
import { MessageBlockEditComponent } from '@app/features/convs-mgr/stories/blocks/edit/blocks-edit';
import { EmailBlockEditComponent } from '@app/features/convs-mgr/stories/blocks/edit/blocks-edit';
import { NameBlockEditComponent } from '@app/features/convs-mgr/stories/blocks/edit/blocks-edit';
import { PhoneBlockEditComponent } from '@app/features/convs-mgr/stories/blocks/edit/blocks-edit';
import { WebhookEditComponent } from '@app/features/convs-mgr/stories/blocks/edit/blocks-edit';
import { DefaultComponent } from '@app/features/convs-mgr/stories/blocks/edit/blocks-edit';
import { AudioOutputBlockEditComponent } from '@app/features/convs-mgr/stories/blocks/edit/blocks-edit';
import { VideoOutputBlockEditComponent } from '@app/features/convs-mgr/stories/blocks/edit/blocks-edit';


export function getActiveBlock(type: StoryBlockTypes) {
  switch (type) {
    case StoryBlockTypes.TextMessage:
      return MessageBlockEditComponent;
    case StoryBlockTypes.Image:
      return ImageOutputBlockEditComponent;
    case StoryBlockTypes.Name:
      return NameBlockEditComponent;
    case StoryBlockTypes.Email:
      return EmailBlockEditComponent;
    case StoryBlockTypes.PhoneNumber:
      return PhoneBlockEditComponent;
    case StoryBlockTypes.QuestionBlock:
      return QuestionButtonsEditFormsComponent;
    case StoryBlockTypes.Location:
      return LocationOutputBlockEditComponent;
    case StoryBlockTypes.List:
      return ListBlockEditComponent;
    case StoryBlockTypes.Document:
      return DocumentOutputBlockEditComponent;
    case StoryBlockTypes.Audio:
      return AudioOutputBlockEditComponent;
    case StoryBlockTypes.Video:
      return VideoOutputBlockEditComponent;
    case StoryBlockTypes.Sticker:
      return DefaultComponent;
    case StoryBlockTypes.Reply:
      return DefaultComponent;
    case StoryBlockTypes.JumpBlock:
      return DefaultComponent;
    case StoryBlockTypes.FailBlock:
      return DefaultComponent;
    case StoryBlockTypes.ImageInput:
      return ImageInputBlockEditComponent;
    case StoryBlockTypes.LocationInputBlock:
      return LocationInputBlockEditComponent;
    case StoryBlockTypes.AudioInput:
      return AudioInputBlockEditComponent;
    case StoryBlockTypes.VideoInput:
      return VideoInputBlockEditComponent;
    case StoryBlockTypes.WebhookBlock:
      return WebhookEditComponent;
    case StoryBlockTypes.Conditional:
      return ConditionalBlockEditComponent;
    case StoryBlockTypes.EndStoryAnchorBlock:
      return DefaultComponent;
    case StoryBlockTypes.OpenEndedQuestion:
      return OpenEndedQuestionEditComponent;
    case StoryBlockTypes.keyword:
      return KeywordJumpBlockEditComponent;
    case StoryBlockTypes.Event:
      return DefaultComponent;
    case StoryBlockTypes.Assessment:
      return AssessmentBrickEditComponent;
    default:
      return DefaultComponent;
  }
}
