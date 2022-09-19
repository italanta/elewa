import { Block, EndUser } from "./chatbot.store";

export interface NextBlockInterface {
    userInput: string;
    getNextBlock: (user: EndUser, message: string, lastBlock: Block) => Promise<Block>;
}