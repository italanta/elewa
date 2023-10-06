import { HandlerTools } from '@iote/cqrs';

import { BotDataService } from './data-service-abstract.class';

import { EnrolledEndUser, EnrolledEndUserStatus } from '@app/model/convs-mgr/learners';
import { EndUser } from '@app/model/convs-mgr/conversations/chats';

/**
 * Contains all the required database flow methods for the chat-status collection
 */
 export class EnrolledUserDataService extends BotDataService<EnrolledEndUser>{
  private _docPath: string;
  tools: HandlerTools;

  constructor(tools: HandlerTools, orgId: string) 
  {
    super(tools);
    this.tools = tools;
    this._init(orgId);
  }

  protected _init(orgId: string) {
    this._docPath = `orgs/${orgId}/enrolled-end-users`;
  }

  async createEnrolledUser(enrolledUser: EnrolledEndUser, id?:string) {
    return this.createDocument(enrolledUser, this._docPath, id);
  }

  async getOrCreateEnrolledUser(endUser: EndUser, platformField: string, id?:string,) {
    const enrolledUsers = await this.getDocumentByField(platformField, endUser.id, this._docPath);
    let currentEnrolledUser = enrolledUsers[0];

    if (!currentEnrolledUser) {
      const enrolledUser: EnrolledEndUser = {
        id:id || '',
        name: endUser.name || '',
        phoneNumber: endUser.phoneNumber || '',
        classId: '',
        currentCourse: '',
        whatsappUserId: endUser.id,
        status: EnrolledEndUserStatus.Active
      };
  
      currentEnrolledUser = await this.createEnrolledUser(enrolledUser, id);
    };

    return currentEnrolledUser;
  };

  async getEnrolledUser(enrolledUserId: string) {
    return this.getDocumentById(enrolledUserId, this._docPath);
  }

  async getEnrolledUsers() {
    return this.getDocuments(this._docPath);
  }

  async updateEnrolledUser(enrolledUser: EnrolledEndUser) {
    // the initial enrolledUser document might not have an id so we write the document instead.
    return this.updateDocument(enrolledUser, this._docPath, enrolledUser.id);
  }
}
