import { AgentsClient, FlowsClient, IntentsClient } from "@google-cloud/dialogflow-cx";

import { PagesClient } from '@google-cloud/dialogflow-cx';

import { HandlerTools } from "@iote/cqrs";
import { Query } from "@ngfi/firestore-qbuilder";

import { DialogflowCXIntent } from '@app/model/convs-mgr/fallbacks';
import { Bot } from "@app/model/convs-mgr/bots";
import { BotModule } from "@app/model/convs-mgr/bot-modules";
import { Organisation } from "@app/model/organisation";

import { ValidateAndSanitize } from "../utils/sanitize-bot-name";

export class IntentService
{
  apiEndpoint = `${process.env.LOCATION}-dialogflow.googleapis.com`;
  private _client: IntentsClient = new IntentsClient({ apiEndpoint: this.apiEndpoint });
  private _pagesClient: PagesClient = new PagesClient({ apiEndpoint: this.apiEndpoint });
  private _flowsClient: FlowsClient = new FlowsClient({ apiEndpoint: this.apiEndpoint });
  private _agentsClient: AgentsClient = new AgentsClient({ apiEndpoint: this.apiEndpoint });

  activeAgent: any;

  private org: Organisation;

  agentPath: string;
  agentID: string;

  async init(intent: DialogflowCXIntent, tools: HandlerTools)
  {
    const parent = this._agentsClient.locationPath(process.env.GCLOUD_PROJECT, process.env.LOCATION);
    const orgsRepo$ = tools.getRepository<Organisation>(`orgs`);

    this.org = await orgsRepo$.getDocumentById(intent.orgId);

    const agentDisplayName = ValidateAndSanitize(this.org.name).toLowerCase();

    const [agents] = await this._agentsClient.listAgents({ parent });
    tools.Logger.log(() => `Agents list :: ${JSON.stringify(agents)}`);
    this.activeAgent = agents.find((ag) => ag.displayName === agentDisplayName);

    if (!this.activeAgent) {
      this.activeAgent = await this._createAgent(parent, tools);
    }

    this.agentID = this._getID(this.activeAgent.name);

    this.agentPath = this._client.agentPath(process.env.GCLOUD_PROJECT, process.env.LOCATION, this.agentID);
  }

  private _getID(name: string)
  {
    const nameArr = name.split('/');
    return nameArr[nameArr.length - 1];
  }

  private async _createAgent(parent: string, tools: HandlerTools)
  {
    const createAgentReq = {
      parent: parent,
      agent: {
        displayName: ValidateAndSanitize(this.org.name).toLowerCase(),
        defaultLanguageCode: 'en',
        timeZone: 'Europe/Moscow'
      }
    };
    const [newAgent] = await this._agentsClient.createAgent(createAgentReq);
    tools.Logger.log(() => `New Agent Created :: ${newAgent}`);
    return newAgent;
  }

  async createIntent(intent: DialogflowCXIntent, tools: HandlerTools): Promise<DialogflowCXIntent>
  {
    const intentRepo = tools.getRepository<DialogflowCXIntent>(`orgs/${intent.orgId}/fallbacks`);
    const createdIntent = {
      displayName: intent.actionDetails.description,
      trainingPhrases: [],
      messages: [],
    };

    const dialogFlowIntent = { intent: createdIntent };

    dialogFlowIntent['parent'] = this.agentPath;

    const dialogFlowIntentCreate = await this._client.createIntent(dialogFlowIntent);
    const id = dialogFlowIntentCreate[0].name.split("/").join("_");
    intent.id = id;
    intent.name = dialogFlowIntentCreate[0].name;
    intent.agentName = this.activeAgent.name;

    return intentRepo.create(intent, intent.id);
  }

  getIntent(intent: DialogflowCXIntent): Promise<any>
  {
    const intentInfo = {
      name: intent.name
    };
    const intentResponse = this._client.getIntent(intentInfo);
    return new Promise((resolve, reject) =>
    {
      resolve(intentResponse);
    });
  }

  async getModuleIntents(orgId: string, botId: string, handlerTools: HandlerTools): Promise<DialogflowCXIntent[]>
  {
    const moduleRepo = await handlerTools.getRepository(`orgs/${orgId}/fallbacks`);
    const moduleIntents = await moduleRepo.getDocuments(new Query()) as DialogflowCXIntent[];
    return moduleIntents;
  }

  async updateIntent(intent: DialogflowCXIntent, tools: HandlerTools): Promise<DialogflowCXIntent>
  {
    let page;
    let flow;
    const intentRepo = tools.getRepository<DialogflowCXIntent>(`orgs/${intent.orgId}/fallbacks`);
    const moduleRepo$ = tools.getRepository<BotModule>(`orgs/${intent.orgId}/modules`);
    const botsRepo$ = tools.getRepository<Bot>(`orgs/${intent.orgId}/bots`);

    const module = await moduleRepo$.getDocumentById(intent.moduleId);
    const bot = await botsRepo$.getDocumentById(intent.botId);

    const [flows] = await this._flowsClient.listFlows({ parent: this.agentPath });

    const existingFlow = flows.find((fl) => {
      // Remove white space
      const flowID = fl.displayName.split('-')[1]?.replace(/\s/g, "");
      const botID = bot.id.replace(/\s/g, "");
      return flowID === botID;
    });

    if (!existingFlow) {
      // Create new page
      const createFlowReq = {
        parent: this.agentPath,
        flow: {
          displayName: `${bot.name} - ${bot.id}`
        }
      };

      const [newFLow] = await this._flowsClient.createFlow(createFlowReq);
      flow = newFLow;

    } else {
      flow = existingFlow;
    }

    const flowId = this._getID(flow.name);

    const flowPath = this._pagesClient.flowPath(process.env.GCLOUD_PROJECT, process.env.LOCATION, this.agentID, flowId);

    // In our case, each page in dialogflowCX will represent a BOT
    const [pages] = await this._pagesClient.listPages({ parent: flowPath });

    page = pages.find((p) => {
      // Remove white space
      const pageID = p.displayName.split('-')[1]?.replace(/\s/g, "");
      const moduleID = module.id.replace(/\s/g, ""); 
      return pageID === moduleID;
    });

    if (!page) {
      const [newPage] = await this._createPage(module, flowPath);
      page = newPage;
    }

    const pageId = this._getID(page.name);

    const pagePath = this._pagesClient.pagePath(process.env.GCLOUD_PROJECT, process.env.LOCATION, this.agentID, flowId, pageId);

    const phrases = intent.userInput.map((input) =>
    {
      return { parts: [{ text: input }], repeatCount: 2 };
    });

    const updatedIntent = {
      displayName: intent.actionDetails.description,
      name: intent.name,
      trainingPhrases: phrases
    };

    const [updateResponse] = await this._client.updateIntent({
      intent: updatedIntent
    });

    console.log("Intent updated successfully", updateResponse);

    const transitions = page.transitionRoutes || [];

    // Only add the transition route(this is the only way of adding the intent to the flow) if it does not exist
    let routeExists;

    if (page.transitionRoutes && page.transitionRoutes.length > 0) {
      routeExists = page.transitionRoutes.find((route) => route.name === `transition_${updatedIntent.name}`);
    }

    if (!routeExists) {
      const newTransition = {
        name: `transition_${updatedIntent.name}`,
        intent: updatedIntent.name,
        targetPage: pagePath,
        targetFlow: flowPath
      };

      transitions.push(newTransition);

      const updatePageRequest = {
        name: page.name,
        page: {
          ...page,
          transitionRoutes: transitions,
        },
      };

      await this._pagesClient.updatePage(updatePageRequest);
    }

    intent.trainingPhrases = updatedIntent.trainingPhrases;
    intent.flowName = flow.name;
    intent.pageName = page.name;
    module.agent = this.activeAgent.name;
    module.flow = flow.name;
    module.page = page.name;

    await moduleRepo$.update(module);

    return intentRepo.update(intent);
  }

  private async _createPage(module: BotModule, flowPath: string)
  {
    const req = {
      parent: flowPath,
      page: {
        displayName: `${module.name} - ${module.id}`
      },
      languageCode: 'en'
    };

    return this._pagesClient.createPage(req);
  }

  async deleteIntent(intent: DialogflowCXIntent, tools: HandlerTools): Promise<boolean>
  {
    const deleteIntent = {
      name: intent.name
    };
    const fallbackRepo = await tools.getRepository(`orgs/${intent.orgId}/fallbacks`);

    await this._client.deleteIntent(deleteIntent);
    return fallbackRepo.delete(intent.id);
  }

}