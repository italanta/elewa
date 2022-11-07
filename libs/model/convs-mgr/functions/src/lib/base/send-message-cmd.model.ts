import { StoryBlock } from "@app/model/bot/blocks/story-block";
import { BotProvider } from "./bot-provider.enum";

export interface SendMessageCommand {
  message:StoryBlock;
  provider:BotProvider;
}