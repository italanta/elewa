import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

export interface AssessmentBrick extends StoryBlock
{
  /** Id if the selected assessment */
  assessmentId?: string;
  
  /** Actual question */
  defaultTarget?: string;

  /** Response options */
  scoreOptions?: ScoreOptions[];
}

/** Represents score scope */
export interface ScoreOptions 
{
    /**minimum score possible */
    min: number,

    /**maximum score possible */
    max: number,

    /** representation of specific score range e.g 'fail' , 'pass' or 'excellent' */
    category: string, 
}