import { CommunicationChannel } from "@app/model/convs-mgr/conversations/admin/system";

export interface TelegramCommunicationChannel extends CommunicationChannel
{
    /** This is a unique token given by Whatsapp and required to 
     *    send and receive messages on whatsapp endpoints
     *  
     *  We pass the access token in the Authorization header when sending a http request 
     * */
    accessToken?: string;
}