import { IObject } from "@iote/bricks";

import { TemplateMessage } from "@app/model/convs-mgr/conversations/messages";

export interface MilestoneTriggers extends IObject
{
  message: TemplateMessage;

  eventName: string;

	/** The time this milestone trigger was executed */
	lastRun?: Date;

	usersSent: number | 0;
}
