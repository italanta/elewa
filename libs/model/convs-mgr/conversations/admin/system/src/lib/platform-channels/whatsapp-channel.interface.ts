import { CommunicationChannel } from "@app/model/convs-mgr/conversations/admin/system";

export interface WhatsAppCommunicationChannel extends CommunicationChannel
{
    /** This is a unique token given by Whatsapp and required to 
     *    send and receive messages on whatsapp endpoints
     *  
     *  We pass the access token in the Authorization header when sending a http request 
     * */
    accessToken?: string;

    /** Phone number of the whatsapp bot that end users are chatting with */
    phoneNumber?: string;
}