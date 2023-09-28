import { CommunicationChannel } from "@app/model/convs-mgr/conversations/admin/system";

export interface WhatsAppCommunicationChannel extends CommunicationChannel
{
    /** This is a unique token given by Whatsapp and required to 
     *    send and receive messages on whatsapp endpoints
     *  
     *  We pass the access token in the Authorization header when sending a http request 
     * */
    accessToken?: string;

    /**
     * The ID of the whatsapp business account that the phone number is linked to.
     * 
     * Please note that this is not the same as the phoneNumber id
     */
    businessAccountId?: string;
}