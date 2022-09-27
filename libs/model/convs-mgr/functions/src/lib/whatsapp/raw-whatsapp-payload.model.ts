/**
 * The type of object returned by the webhook as a Response object
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/components
 */

export interface RawWhatsAppApiPayload {
  object: string;
  entry: WhatsAppEntryFormData[];
}

export interface WhatsAppEntryFormData {
  id: string;
  changes: WhatsAppEntryFormDataChanges[];
}

export interface WhatsAppEntryFormDataChanges {
  value: {
    messagingProduct: string;
    metadata: { displayPhoneNumber: string; phoneNumberId: string };
    info: {} //specific webhook payload info can be added
  };
  field: string;
}