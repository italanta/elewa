import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { PlatformType } from '@app/model/convs-mgr/conversations/admin/system';

export function _channelMessengerForm(_fb: FormBuilder): FormGroup {
  return _fb.group({
    id: [''],
    type: [PlatformType.Messenger],
    name: [''],
    accessToken: ['', Validators.required],
    pageId: [''],
    orgId: [""], 
  });
}

export function _channelWhatsAppForm(_fb: FormBuilder): FormGroup {
  return _fb.group({
    id: [''],
    type: [PlatformType.WhatsApp],
    name: [''],
    accessToken: ['', Validators.required],
    phoneNumber: [''],
    phoneNumberId: [''],
    businessAccountId: [''],
    orgId: [""], 
  });
}
