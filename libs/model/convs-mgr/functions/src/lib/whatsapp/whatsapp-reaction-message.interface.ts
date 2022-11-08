// import { WhatsAppMessage } from "./whatsapp-base-message.interface";
// import { WhatsAppMessageType } from "./whatsapp-message-types.interface";

// /**
//  * Contains only fields for type reaction
//  * @extends {WhatsAppMessage}
//  * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages#reaction-messages
//  */
// export interface WhatsAppReactionMessage extends WhatsAppMessage{
//   type: WhatsAppMessageType.REACTION,
//   reaction: {
//     //Id of the message a user is reacting to
//     message_id: string;
//     //Referes to string representation of the reaction emoji
//     emoji: string;
//   }
// }