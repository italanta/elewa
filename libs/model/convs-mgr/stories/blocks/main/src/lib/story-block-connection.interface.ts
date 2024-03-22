
/**
 * A StoryBlock connection connects two StoryBlocks together.
 *  One as input, the other as output.
 *
 * @note A StoryBlockConnection acts as a JSPlumb edge on the editor (@see https://docs.jsplumbtoolkit.com/toolkit/5.x/lib/graph)
 */
export interface StoryBlockConnection {
  id: string;
  /** The StoryBlock ID from which the connection originates. */
  sourceId: string;
  /** The output slot on the StoryBlock ID from which the connection originates. (JSPlumb Anchor) */
  slot: number;

  /** The target block at which the connection points. */
  targetId: string;

  /** Whether the connection has been deleted and should no longer be used in new flows */
  deleted?: boolean;

  /** This will act as the unique id because jsPlumb keeps changing the connection ids after refresh */
  uuid?: string;
}
