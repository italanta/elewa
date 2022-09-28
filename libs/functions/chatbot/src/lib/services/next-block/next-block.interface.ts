import { Block, ChatInfo } from "@app/model/convs-mgr/conversations/chats";

export interface NextBlockInterface {
    userInput: string;
    getNextBlock: (chatInfo: ChatInfo, message: string, lastBlock: Block) => Promise<Block>;
}