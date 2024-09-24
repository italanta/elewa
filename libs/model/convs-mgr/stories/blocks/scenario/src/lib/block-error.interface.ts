import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { BlockErrorTypes } from './block-error.enum';

export interface BlockError {
    isError: boolean;
    blockType?: StoryBlockTypes;
    errorType?: BlockErrorTypes;
}