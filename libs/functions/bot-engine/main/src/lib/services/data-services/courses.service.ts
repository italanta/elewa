import { HandlerTools } from '@iote/cqrs';

import { Bot } from '@app/model/convs-mgr/bots';

import { BotDataService } from './data-service-abstract.class';

/**
 * Contains all the required database flow methods for the botModule collection
 * A bot is a course
 */
export class CoursesDataService extends BotDataService<Bot> {
  private _docPath: string;
  tools: HandlerTools;

  constructor(tools: HandlerTools, orgId: string) {
    super(tools);
    this.tools = tools;
    this._init(orgId);
  }

  protected _init(orgId: string): void {
    this._docPath = `orgs/${orgId}/bots`;
  }

  async createBot(bot: Bot) {
    return this.createDocument(bot, this._docPath, bot.id);
  }

  async getBot(botId: string) {
    return this.getDocumentById(botId, this._docPath);
  }

  async getBots() {
    return this.getDocuments(this._docPath);
  }

  async updateBot(bot: Bot) {
    return this.updateDocument(bot, this._docPath, bot.id);
  }
}
