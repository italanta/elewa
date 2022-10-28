import { CommunicationChannel } from "@app/model/convs-mgr/conversations/admin/system";

export interface WhatsAppCommunicationChannel extends CommunicationChannel {

/** 
 * Unique id assigned by WhatsApp to the phone number an organization uses for the chatbot
 *  
 * We need to store the businessPhoneNumberId because it is required by the bot engine to 
 *     send messages to whatsapp
 * */ 
businessPhoneNumberId: string;
   
/** This is a unique token given by Whatsapp and required to 
 *    send and receive messages on whatsapp endpoints
 *  
 *  We pass the access token in the Authorization header when sending a http request 
 * */
accessToken?: string;
}