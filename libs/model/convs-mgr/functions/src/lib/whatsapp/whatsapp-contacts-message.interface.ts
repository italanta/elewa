import { WhatsAppOutgoingMessage } from "./whatsapp-base-message.interface";
import { WhatsAppMessageType } from "./whatsapp-message-types.interface";

/**
 * Contains only fields for type contacts
 * @extends {WhatsAppMessage}
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages#contact-messages
 */
export interface WhatsAppContactMessage extends WhatsAppOutgoingMessage {
  type: WhatsAppMessageType.CONTACTS,
  contacts: ContactInfo[]
}

interface ContactInfo {
  addresses: Address[],
  birthday: string,
  emails: {email: string, type:InfoType}[],
  name: ContactNameInfo,
  org: OrgInfo,
  phones: {phone: string, type:InfoType }[],
  urls: {url: string, type:InfoType}[],
}

interface Address {
  street: string,
  city: string,
  state: string,
  zip: string,
  country: string,
  countryCode: string,
  type: InfoType,
}

interface ContactNameInfo{
  formattedName: string,
  firstName: string,
  lastName: string,
  middleName: string,
  suffix: string,
  prefix: string
}

interface OrgInfo{
  company: string,
  department: string,
  title: string,
}

enum InfoType{
  HOME = "HOME",
  WORK = "WORK",
}