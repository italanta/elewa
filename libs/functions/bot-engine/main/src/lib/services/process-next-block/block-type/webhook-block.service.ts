import { HandlerTools, Logger } from "@iote/cqrs";

import { Cursor } from "@app/model/convs-mgr/conversations/admin/system";

import { WebhookBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { HttpMethodTypes } from "@app/model/convs-mgr/stories/blocks/main";

import { DefaultOptionMessageService } from "../../next-block/block-type/default-block.service";
import { BlockDataService } from "../../data-services/blocks.service";
import { ConnectionsDataService } from "../../data-services/connections.service";

import { IProcessNextBlock } from "../models/process-next-block.interface";

import { HttpService } from "../../../utils/http-service/http.service";
import { ProcessInputFactory } from "../../process-input/process-input.factory";
import { ProcessInput } from "../../process-input/process-input.class";

/**
 * When an end user send a message to the bot, we need to know the type of block @see {StoryBlockTypes} we sent 
 *  so that we can process the response based on that block.
 * 
 * This service processes a location input from the user.
 * 
 */
export class WebhookBlockService extends DefaultOptionMessageService implements IProcessNextBlock
{
	sideOperations: Promise<any>[] = [];
	tools: HandlerTools;
	blockDataService: BlockDataService;

	private httpService: HttpService;

	constructor(blockDataService: BlockDataService, connDataService: ConnectionsDataService, tools: HandlerTools)
	{
		super(blockDataService, connDataService, tools);
		this.tools = tools;
		this.blockDataService = blockDataService;

		this.httpService = new HttpService();
	}

	public async handleBlock(storyBlock: WebhookBlock, updatedCursor: Cursor, orgId: string, endUserId: string)
	{

		const response = await this.makeRequest(storyBlock, orgId, endUserId);

		const unpackedResponse = this.unpackResponse(response, storyBlock.httpUrl);

		// Save variable here
		// Traverse through the unpacked response keys and save each key and its value to variables collection
		const saveResponseToVariables = this.saveWebhookResponse(unpackedResponse, orgId, endUserId);

		this.sideOperations.push(saveResponseToVariables);

		const newCursor = await this.getNextBlock(null, updatedCursor, storyBlock, orgId, updatedCursor.position.storyId, endUserId);

		const nextBlock = await this.blockDataService.getBlockById(newCursor.position.blockId, orgId, newCursor.position.storyId);

		return {
			storyBlock: nextBlock,
			newCursor
		};
	}

	private async makeRequest(storyBlock: WebhookBlock, orgId: string, endUserId: string)
	{
		const URL = storyBlock.httpUrl;

		const payload = await this.getPayload(orgId, endUserId);

		switch (storyBlock.httpMethod) {
			case HttpMethodTypes.GET:
				return this.httpService.get(URL, this.tools);
			case HttpMethodTypes.POST:
				return this.httpService.post(URL, payload, this.tools);
			default:
				return this.httpService.post(URL, payload, this.tools);
		}
	}

	private async getPayload(orgId: string, endUserId: string) 
	{
		const variableRepo = this.tools.getRepository<any>(`orgs/${orgId}/end-users/${endUserId}/variables`);

		const variableValues = await variableRepo.getDocumentById(`values`);

		return variableValues;
	}

	private async saveWebhookResponse(unpackedResponse: any, orgId: string, endUserId: string)
	{
		const processInput = new ProcessInput<string>(this.tools);

		for (const key in unpackedResponse) {
			if (unpackedResponse.hasOwnProperty(key)) {
				await processInput.saveInput(orgId, endUserId, unpackedResponse[key]);
			}
		}
	}

	/*******************************/
	/** ---- Farmbetter only ----- */
	/*******************************/

	private async unpackResponse(response: any, url: string)
	{
		let unpackedResponse: any;
		if (url.includes("community")) {
			unpackedResponse.communityName = response.result.groupName;
			unpackedResponse.communityUrl = response.result.groupLink;
			unpackedResponse.communityId = response.result.id;
		} else if (url.includes("BestPractices")) {
			unpackedResponse.searchUrl = response.result.link;
		}

		return unpackedResponse;
	}
}