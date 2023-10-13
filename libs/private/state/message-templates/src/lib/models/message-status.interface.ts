export interface MessageStatusRes {
    name: string;
    status: string;
}


export interface MessageStatusReq {
fields: string[];
limit: number;
channelId: string;
}