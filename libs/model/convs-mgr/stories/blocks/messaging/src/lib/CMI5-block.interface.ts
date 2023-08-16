import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { ButtonsBlockButton } from "@app/model/convs-mgr/stories/blocks/scenario";

export interface CMI5Block extends StoryBlock
{

  /** Once the zip file has been uploaded, we get the generated id of the course and save it here. */
  courseId?: string;

  defaultTarget?: string;

  /** Response options */
  options?: ButtonsBlockButton<Button>[];

  fileSrc?: string;
  
}
interface Button {
  id: string;
  /** Message to display as answer */
  message: string;
  /** Value the answer holds. */
  value?: string;
}