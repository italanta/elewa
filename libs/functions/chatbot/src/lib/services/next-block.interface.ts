import { Block, EndUser } from "./main-chatbot.service";

export interface NextBlockInterface {
    userInput: string;
    getNextBlock: (user: EndUser, message: string, lastBlock: Block) => Promise<Block>;
}