import { HandlerTools, Logger } from "@iote/cqrs";

import { Cursor } from "@app/model/convs-mgr/conversations/admin/system";

import { DefaultOptionMessageService } from "../../next-block/block-type/default-block.service";
import { BlockDataService } from "../../data-services/blocks.service";
import { ConnectionsDataService } from "../../data-services/connections.service";

import { IProcessNextBlock } from "../models/process-next-block.interface";

import { HttpService } from "../../../utils/http-service/http.service";

/**
 * When an end user send a message to the bot, we need to know the type of block @see {StoryBlockTypes} we sent 
 *  so that we can process the response based on that block.
 * 
 * This service processes a location input from the user.
 * 
 */
export class WebhookBlockService extends DefaultOptionMessageService implements IProcessNextBlock
{
	tools: HandlerTools;
	blockDataService: BlockDataService;
	
	private httpService: HttpService;

	constructor(blockDataService: BlockDataService, connDataService: ConnectionsDataService, tools: HandlerTools)
	{
		super(blockDataService, connDataService, tools);
		this.tools = tools;
		this.blockDataService = blockDataService;

		this.httpService =  new HttpService();
	}

	public async handleBlock(storyBlock: WebhookBlock, updatedCursor: Cursor, orgId: string, endUserId: string) {

		await this.makeRequest(storyBlock);

		const newCursor = await this.getNextBlock(null, updatedCursor, storyBlock, orgId, updatedCursor.position.storyId, endUserId);

		const nextBlock = await this.blockDataService.getBlockById(newCursor.position.blockId, orgId, newCursor.position.storyId);

		return {
			storyBlock: nextBlock,
			newCursor
		}
	}

	private async makeRequest(storyBlock: WebhookBlock)
	{
		const URL = storyBlock.url;
		const HTTP_METHOD = storyBlock.httpMethod;

		const payload = this.getPayload();

		switch (storyBlock.httpMethod) {
			case HttpMethodTypes.GET:
				return this.httpService.get(URL, this.tools);
			case HttpMethodTypes.POST:
				return this.httpService.post(URL, payload, this.tools);
			default:
				return this.httpService.post(URL, payload, this.tools);
		}
	}

	private async getPayload() 
	{
		const variableRepo = this.tools.getRepository<any>(`orgs/{orgId}/end-users/{endUserId}/variables`);

		const variableValues = await variableRepo.getDocumentById(`values`);

		return variableValues;
	}

}