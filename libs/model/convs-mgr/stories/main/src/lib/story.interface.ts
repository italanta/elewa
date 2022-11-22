import { IObject } from "@iote/bricks";

/**
 * A story is a conversational flow that models the 
 *    interaction between a chatbot actor (the engine) and a physical actor (an end user).
 * 
 * The conversation between a chatbot and a physical actor can consist out of different stories,
 *    human takeover, etc.. It is not limited to single story.
 * 
 * A story consists out of different Blocks with StartBlock ID = Story ID.
 */
export interface Story extends IObject
{
  /* Foreign Key to Organisation holding the story. */
  orgId: string;

  /* Name of the story */
  name: string;

  /* image of the story */
  imageField?: string;

  /* description of the story */

    description?: string;
}