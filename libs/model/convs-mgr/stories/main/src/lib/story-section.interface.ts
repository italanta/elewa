import { IObject } from "@iote/bricks";

/**
 * A story-section is a conversational flow that models the 
 *    interaction between a chatbot actor and a physical actor.
 * 
 * A story section consists out of different Blocks with StartBlock ID = Story ID.
 * 
 * The difference between a story section and a story is that a story is often the root entry point of a conversation,
 *  while sections are hierarchicaclly added and organised through section blocks.
 */
export interface StorySection extends IObject
{
  /* Foreign Key to Organisation holding the story. */
  orgId: string;

  /* Name of the story */
  name: string;
}