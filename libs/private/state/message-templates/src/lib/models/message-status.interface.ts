export interface MessageStatusRes {
    templates: MessageTemplateStatus[];
}

export interface MessageTemplateStatus {
    id: string;
    name: string; 
    status: string; 
}

export interface MessageStatusReq {
fields: string[];
limit: number;
channelId: string;
}