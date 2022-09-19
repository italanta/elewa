
import { StoryBlock, StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";
import { TextMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { HandlerTools } from "@iote/cqrs";

export class GetWhatsAppMessageTypeService {
  private _tools: HandlerTools

  constructor(private tools: HandlerTools){
    this.tools = this._tools
  }

  getDataToSend(message: StoryBlock){

    switch (message.type) {
      case StoryBlockTypes.TextMessage:
        this._tools.Logger.log(()=> 'Story block type is text message.')
        return (message as TextMessageBlock).message;    
      default:
        break;
    }
    
  }
}