import { HandlerTools, Logger } from "@iote/cqrs";

import { NextBlockService } from "../next-block.class";

/**
 * Text message block only has a default option, so we inherit the already implemented method
 */
export class TextMessageService extends NextBlockService {
    userInput: string;
    _logger: Logger;
    tools: HandlerTools;

    constructor(tools: HandlerTools){
        super(tools)
    }
}