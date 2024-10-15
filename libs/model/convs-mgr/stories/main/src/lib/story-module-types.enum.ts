/**
 * Different possible types a story is
 */
export enum StoryModuleTypes
{
  /** The story module is the root parent/bot parent */
  Story = 1,

  /** Also a normal story as in Type = 1, but in the legacy format meaning type will be unset/undefined in the database */
  LegacyStory = 0,
  
  /** The story module represents a child story */
  SubStory = 2,

  /** The story module represents a flow */
  Flow = 3,

  /** The story module represents an assessment */
  Assessment = 4,

  /** The story module represents a micro-app */
  MicroApp = 5,

  /** Future feature to experiment with @Jente */
  CoachingModule = 6,

  /** The story module represents an Ivr module */
  IvrModule = 7,
}
