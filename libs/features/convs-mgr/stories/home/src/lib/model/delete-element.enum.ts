import { BotModule } from "@app/model/convs-mgr/bot-modules";
import { Bot } from "@app/model/convs-mgr/bots";
import { Story } from "@app/model/convs-mgr/stories/main";

export enum DeleteElementsEnum {
  Bot = 'bot',
  BotModule = 'module',
  Story = 'story',
}

export type BotElementType =  Story | Bot | BotModule;
