import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

/**
 * Block which represents a story module.
 * 
 *  Story modules are child stories that contain their own story flow.
 *  They have a clear entry point (from the parent story) and can have one to many outputs (resulting in exit points on the representative block).
 *   
 */
export interface StoryModuleBlock extends StoryBlock
{
  /** ID of the story module. Corresponds with the ID of the related story. */
  id: string;

  /** Type of the story */
  storyType: StoryModuleTypes;

  /** 
   * Set of story module outputs.
   *  Needs to be at least one!
   */
  outputs: [StoryModuleResult];
}

/**
 * Story module results are the outcome of a story module.
 * They represent 
 */
export interface StoryModuleResult 
{
  /** ID of the result endpoint */
  id: string;
  /** Label/name of the result */
  label: string;
}

/**
 * Different possible types of a story module
 */
export enum StoryModuleTypes
{
  /** The story module is the root parent/bot parent */
  Story = 1,

  /** The story module represents a child story */
  SubStory = 2,

  /** The story module represents a flow */
  Flow = 3,

  /** The story module represents an assessment */
  Assessment = 4,

  /** The story module represents a micro-app */
  MicroApp = 5,

  /** Future feature to experiment with @Jente */
  CoachingModule = 6
}
