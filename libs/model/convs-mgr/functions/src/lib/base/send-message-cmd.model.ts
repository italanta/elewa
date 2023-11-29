import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

import { BotProvider } from "./bot-provider.enum";

export interface SendMessageCommand {
  message:StoryBlock;
  provider:BotProvider;
}