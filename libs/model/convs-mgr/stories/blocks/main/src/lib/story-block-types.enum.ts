/**
 * Different types and roles a block can play
 */
export enum StoryBlockTypes 
{
  /** 
   * Block only produces message output and will not wait for input. 
   * 
   * Block examples: Sending messages
   * Usage         : Operator sends a message, terminal chatflow, ...
   */
  TextMessage = 1,
  
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
  Structural = 9,

  /**
   * Block that sends an image and expects no input from the user 
   */
  Image = 5,
  
  /**
   * Block that waits for the user to return their name as input
   */
  Name=10,

  /**
   * Block that waits for the user to enter their email address as input
   */
  Email=11,

  /**
   * Block that waits for the user to enter their phone-number as input
   */
  PhoneNumber=12
}