import { Injectable } from "@angular/core";
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { WhatsAppCommunicationChannel } from "@app/model/convs-mgr/conversations/admin/system";

@Injectable({
	providedIn: 'root'
})

export class WhatsappUploadFileService
{
  constructor(private _aFF: AngularFireFunctions) { }

	uploadMedia(channel: WhatsAppCommunicationChannel)
	{
		return this._aFF.httpsCallable('channelWhatsappUploadMedia')(channel)
	}
}