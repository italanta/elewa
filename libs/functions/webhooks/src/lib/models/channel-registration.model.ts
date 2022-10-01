import { BaseChannel } from "@app/model/bot/channel";
import { HandlerTools } from "@iote/cqrs";

/**
 * @Class [ChannelRegistrationModel] used to register a channel e.g WhatsApp, 
 *         telegram if a message comes in the firts time on an endpoint
 * @param tools:HandlerTools 
 * */

export class ChannelRegistrationModel {

  _tools: HandlerTools;

  constructor(tools: HandlerTools){
    this._tools = tools;    
  }

  register(channel:BaseChannel)
  {
    const channelsRepo = this._tools.getRepository<BaseChannel>(`channels/${channel.channelName}/`);
    this._tools.Logger.log(()=>`[ChannelRegistrationModel]. Registering ${channel.channelName}🖌`);
    return channelsRepo.create(channel);
  }
}