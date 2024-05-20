import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

export interface MicroAppBlock extends StoryBlock 
{
  /** will be used to create the url */
  appId: string;
  
  /** The name of the micro app. Will be used as the link display text */
  appName: string;

  
}
