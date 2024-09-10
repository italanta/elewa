import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

export function isEditDisabled(type: StoryBlockTypes) {
  switch(type) {
    case StoryBlockTypes.JumpBlock:
    case StoryBlockTypes.WebhookBlock:
      return true;
    default:
      return false;
  }
}