import { Injectable } from "@angular/core";
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { Bot } from "@app/model/convs-mgr/bots";
import { WhatsAppCommunicationChannel } from "@app/model/convs-mgr/conversations/admin/system";

@Injectable({
	providedIn: 'root'
})

export class WhatsappUploadFileService
{
  constructor(private _aFF: AngularFireFunctions) { }

	uploadMedia(bot:Bot, channel: WhatsAppCommunicationChannel)
	{
		const payload = {
			channel,
			bot,
		}

		return this._aFF.httpsCallable('channelWhatsappUploadMediaCron')(payload)
	}
}