import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

export interface LocationMessageBlock extends StoryBlock{

    //This will store the URL for the location being sent
    location?: string;

    //stores the default target if no exact location is passed
    defaultTarget?:string;

}