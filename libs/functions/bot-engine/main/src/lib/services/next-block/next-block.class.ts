import { HandlerTools } from "@iote/cqrs";
import { Query } from "@ngfi/firestore-qbuilder";

import { Message } from "@app/model/convs-mgr/conversations/messages";
import { StoryBlock, StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";
import { ErrorMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { Cursor } from "@app/model/convs-mgr/conversations/admin/system";


export abstract class NextBlockService
{

  tools: HandlerTools;
  constructor(tools: HandlerTools)
  {
    this.tools = tools;
  }

  /**
   * Default method that returns the block connected to the default option of the block
   * Applies for blocks which only have one target block e.g. Text Message Block
   * @returns StoryBlock
   */
  abstract getNextBlock(msg: Message, currentCursor: Cursor, currentBlock: StoryBlock, orgId: string, currentStory: string, endUserId?: string): Promise<StoryBlock>;

  protected getErrorBlock(blockId: string, errorMessage: string): StoryBlock
  {
    const block: ErrorMessageBlock = {
      id: blockId,
      type: StoryBlockTypes.ErrorBlock,
      position: null,
      deleted: false,
      blockTitle: '',
      blockIcon: '',
      message: errorMessage,
    };

    return block;

  }

  /**
   * 
   * The user/organisation creating the bot might choose to save the response of the end user for later use.
   * 
   * This method takes the response(value) and saves it to a temporary collection. This data can then
   *  be retrieved from this collection later e.g. when the story ends the user creating the bot might choose to 
   *    post the data to a REST endpoint.
   * 
   * TODO: Create a clean up function that deletes the temporary collection after the endpoint has been called.
   * 
   * @param tag - The variable tagged to that particular input block
   * @param orgId - The id of the organisation
   * @param context - When an end user responds we need to know how to categorize their response so that we can 
   *                    store related responses together. A context can be a Story - @see {Story}
   *                  The context ends up being a collection on the backend
   * @param value - The response of the end user chatting with the bot
   * @param endUserId - The unique id associated with the end user chatting with the bot
   */
  async saveData(tag: string, orgId: string, context: string, value: any, endUserId: string)
	{
    // Create the path to save the document
		const docPath = `orgs/${orgId}/end-users/${endUserId}/${context}`;

		const tempRepo = this.tools.getRepository<any>(docPath)

    // Get the already saved data, if any
		const contextData = await tempRepo.getDocuments(new Query())


    // If no data has been saved, we go ahead and create the document
		if (!contextData[0]) {
			const context = {
				[tag]: value
			}
			return tempRepo.create(context)
		}

    // If the variable tagged already has a value, we create an array and push the new value
    if(!contextData[0][tag]) {
      let tagArray = [...tag];

      tagArray.push(contextData[0][tag]);

      contextData[0][tag] = tagArray
    }


		const tempData = {
			...contextData[0],
			[tag]: value
		}

		return tempRepo.update(tempData)
	}
  }
