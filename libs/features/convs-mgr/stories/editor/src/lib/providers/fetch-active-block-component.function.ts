import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { MessageBlockEditComponent } from '@app/features/convs-mgr/stories/blocks/edit/blocks-edit';
import { DefaultComponent } from '@app/features/convs-mgr/stories/blocks/edit/blocks-edit';

export function getActiveBlock(type: StoryBlockTypes) {
  switch (type) {
    case StoryBlockTypes.TextMessage:
      return MessageBlockEditComponent;
    case StoryBlockTypes.Image:
      return DefaultComponent;
    case StoryBlockTypes.Name:
      return DefaultComponent;
    case StoryBlockTypes.Email:
      return DefaultComponent;
    case StoryBlockTypes.PhoneNumber:
      return DefaultComponent;
    case StoryBlockTypes.QuestionBlock:
      return DefaultComponent;
    case StoryBlockTypes.Location:
      return DefaultComponent;
    case StoryBlockTypes.List:
      return DefaultComponent;
    case StoryBlockTypes.Document:
      return DefaultComponent;
    case StoryBlockTypes.Audio:
      return DefaultComponent;
    case StoryBlockTypes.Video:
      return DefaultComponent;
    case StoryBlockTypes.Sticker:
      return DefaultComponent;
    case StoryBlockTypes.Reply:
      return DefaultComponent;
    case StoryBlockTypes.JumpBlock:
      return DefaultComponent;
    case StoryBlockTypes.MultipleInput:
      return DefaultComponent;
    case StoryBlockTypes.FailBlock:
      return DefaultComponent;
    case StoryBlockTypes.ImageInput:
      return DefaultComponent;
    case StoryBlockTypes.LocationInputBlock:
      return DefaultComponent;
    case StoryBlockTypes.AudioInput:
      return DefaultComponent;
    case StoryBlockTypes.WebhookBlock:
      return DefaultComponent;
    case StoryBlockTypes.EndStoryAnchorBlock:
      return DefaultComponent;
    case StoryBlockTypes.OpenEndedQuestion:
      return DefaultComponent;
    default:
      return DefaultComponent;
  }
}
