import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { ImageBlockEditComponent } from '@app/features/convs-mgr/stories/blocks/edit/blocks-edit';
import { MessageBlockEditComponent } from '@app/features/convs-mgr/stories/blocks/edit/blocks-edit';

export function getActiveBlock(type: StoryBlockTypes) {
  switch (type) {
    case StoryBlockTypes.TextMessage:
      return MessageBlockEditComponent;
    case StoryBlockTypes.Image:
      return ImageBlockEditComponent;
    case StoryBlockTypes.Name:
      return ImageBlockEditComponent;
    case StoryBlockTypes.Email:
      return ImageBlockEditComponent;
    case StoryBlockTypes.PhoneNumber:
      return ImageBlockEditComponent;
    case StoryBlockTypes.QuestionBlock:
      return ImageBlockEditComponent;
    case StoryBlockTypes.Location:
      return ImageBlockEditComponent;
    case StoryBlockTypes.List:
      return ImageBlockEditComponent;
    case StoryBlockTypes.Document:
      return ImageBlockEditComponent;
    case StoryBlockTypes.Audio:
      return ImageBlockEditComponent;
    case StoryBlockTypes.Video:
      return ImageBlockEditComponent;
    case StoryBlockTypes.Sticker:
      return ImageBlockEditComponent;
    case StoryBlockTypes.Reply:
      return ImageBlockEditComponent;
    case StoryBlockTypes.JumpBlock:
      return ImageBlockEditComponent;
    case StoryBlockTypes.MultipleInput:
      return ImageBlockEditComponent;
    case StoryBlockTypes.FailBlock:
      return ImageBlockEditComponent;
    case StoryBlockTypes.ImageInput:
      return ImageBlockEditComponent;
    case StoryBlockTypes.LocationInputBlock:
      return ImageBlockEditComponent;
    case StoryBlockTypes.AudioInput:
      return ImageBlockEditComponent;
    case StoryBlockTypes.WebhookBlock:
      return ImageBlockEditComponent;
    case StoryBlockTypes.EndStoryAnchorBlock:
      return ImageBlockEditComponent;
    case StoryBlockTypes.OpenEndedQuestion:
      return ImageBlockEditComponent;
    default:
      return ImageBlockEditComponent;
  }
}
