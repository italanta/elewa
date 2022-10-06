import { BaseMessage } from "@app/model/convs-mgr/conversations/messages";

export abstract class SendMessageModel {
    
    abstract sendMessage(message: BaseMessage, env:any): Promise<any>
}