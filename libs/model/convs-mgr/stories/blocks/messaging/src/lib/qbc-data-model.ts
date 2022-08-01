import { ButtonsBlock } from '@app/model/convs-mgr/stories/blocks/scenario';

import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";



export interface QbcDataModel extends StoryBlock{
    question: string;
    buttons: ButtonsBlock<any>[];
}
