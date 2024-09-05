import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

export function isEditDisabled(type: StoryBlockTypes) {
  switch(type) {
    case StoryBlockTypes.JumpBlock:
      return true;
    default:
      return false;
  }
}