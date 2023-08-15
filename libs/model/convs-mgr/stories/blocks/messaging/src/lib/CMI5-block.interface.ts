import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

export interface CMI5Block extends StoryBlock
{

  /** Once the zip file has been uploaded, we get the generated id of the course and save it here. */
  courseId?: string;
  
}