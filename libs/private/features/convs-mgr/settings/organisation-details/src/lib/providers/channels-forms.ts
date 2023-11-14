import { FormBuilder, FormGroup, Validators } from "@angular/forms";

export function _channelMessengerForm(_fb: FormBuilder, platform: string, orgId: string): FormGroup {
  return _fb.group({
    id: [''],
    type: [platform],
    name: [''],
    accessToken: ['', Validators.required],
    pageId: [''],
    orgId: [orgId], 
  });
}

export function _channelWhatsAppForm(_fb: FormBuilder, platform: string, orgId: string): FormGroup {
  return _fb.group({
    id: [''],
    type: [platform],
    name: [''],
    accessToken: ['', Validators.required],
    phoneNumber: [''],
    phoneNumberId: [''],
    businessAccountId: [''],
    orgId: [orgId], 
  });
}
