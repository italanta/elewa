
/**
 * When an end user is navigating through a @see Story and hits a jump block, we
 *  go into a child story. And when the child story completes we will need to know
 *   if it was successful or it failed so that we can continue the flow of the parent story
 *    appropriately.   
 * 
 * We store this information in @type {RoutedCursor}
 */ 
export interface RoutedCursor 
{
  /** The id of the child story */
  storyId: string;
  
  /** The id of the block to navigate to if the child story completes successfully 
   *  e.g. hit an end story block
   */
  blockSuccess: string;

  /** The id of the block to navigate to if the child story fails 
   *  e.g. hit a fail block
   */
  blockFail: string;

  /** The id of the block to navigate to if the child story crashes or 
   *   ends without resolving
   */
  blockError?: string;
}