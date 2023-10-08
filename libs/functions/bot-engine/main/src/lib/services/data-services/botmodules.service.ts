import { HandlerTools } from '@iote/cqrs';

import { BotModule } from '@app/model/convs-mgr/bot-modules';

import { BotDataService } from './data-service-abstract.class';

/**
 * Contains all the required database flow methods for the botModule collection
 */
export class BotModuleDataService extends BotDataService<BotModule> {
  private _docPath: string;
  tools: HandlerTools;

  constructor(tools: HandlerTools, orgId: string) {
    super(tools);
    this.tools = tools;
    this._init(orgId);
  }

  protected _init(orgId: string): void {
    this._docPath = `orgs/${orgId}/modules`;
  }

  async createBotModule(botModule: BotModule) {
    return this.createDocument(botModule, this._docPath, botModule.id);
  }

  async getOrCreateBotModule(botModule: BotModule, botModuleId?: string) {
    let currentBotModule: BotModule;

    if (!botModuleId) {
      currentBotModule = await this.getDocumentById(botModuleId || botModule.id, this._docPath);
    }

    if (!currentBotModule) {
      currentBotModule = await this.createBotModule(botModule);
    }

    return currentBotModule;
  }

  async getBotModule(botModuleId: string) {
    return this.getDocumentById(botModuleId, this._docPath);
  }

  async getBotModules() {
    return this.getDocuments(this._docPath);
  }

  async updateBotModule(botModule: BotModule) {
    return this.updateDocument(botModule, this._docPath, botModule.id);
  }
}
