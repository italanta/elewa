import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

/**
 * This block sends a loction as a message to thee user.
 */
export interface LocationMessageBlock extends StoryBlock
{

    /** 
    This will store the URL for the location being sent
    */
    location?: string;

    /**
    stores the default target if no exact location is passed 
    */
    defaultTarget?:string;

}