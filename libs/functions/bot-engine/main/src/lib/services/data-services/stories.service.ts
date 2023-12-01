import { HandlerTools } from '@iote/cqrs';

import { Story } from '@app/model/convs-mgr/stories/main';

import { BotDataService } from './data-service-abstract.class';

/**
 * Contains all the required database flow methods for the story collection
 */
export class StoriesDataService extends BotDataService<Story> {
  private _docPath: string;
  tools: HandlerTools;

  constructor(tools: HandlerTools, orgId: string) {
    super(tools);
    this.tools = tools;
    this._init(orgId);
  }

  protected _init(orgId: string): void {
    this._docPath = `orgs/${orgId}/stories`;
  }

  async createStory(story: Story) {
    return this.createDocument(story, this._docPath, story.id);
  }

  async getStory(storyID: string) {
    return this.getDocumentById(storyID, this._docPath);
  }

  async getStories() {
    return this.getDocuments(this._docPath);
  }

  async updateStory(story: Story) {
    return this.updateDocument(story, this._docPath, story.id);
  }
}
