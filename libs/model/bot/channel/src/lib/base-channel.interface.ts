
import { Platforms } from "@app/model/convs-mgr/conversations/admin/system";
import { IObject } from "@iote/bricks";

export interface BaseChannel extends IObject {
  //Channel which bot will be used
  channelName: Platforms;

  //Number to be used in channel when communicating 
  businessPhoneNumber: string;

  //For each number used in the channel, it must be have a whatsapp business identifier
  businessAccountId: string;
  
  //organisation/business that is using the channel for communication using the bot
  orgId: string;

  //Story which channel is pointing to
  storyId: string;

  //unique key used for particular channel
  authorizationKey?: string;

}

