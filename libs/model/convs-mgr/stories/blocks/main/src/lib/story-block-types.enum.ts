/**
 * Different types and roles a block can play
 */
export enum StoryBlockTypes 
{
  /** 
   * Block only produces output and will not wait for input. 
   * 
   * Block examples: Messages, sending photos, sending audio, ...
   * Usage         : Operator sends a message, terminal chatflow, ...
   */
  Output = 1,
  
  /** 
   * Block only waits for input and has no leading message. 
   * Block examples: get location, get audio, get message, ... 
   * Usage         : operator awaits feedback, ... */
  Input  = 2,
  
  /** 
   * Block sends message then expects input.
   * Block examples: buttons question, ...
   * Usage         : bot scenario-designs */
  IO     = 3,

  /**
   * Block redirects to StorySection with other scenario.
   * Usage         : structuring and reusing scenario-designs */
  Structural = 9
}