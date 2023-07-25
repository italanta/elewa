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

  async createEnrolledUser(enrolledUser: EnrolledEndUser) {
    return this.createDocument(enrolledUser, this._docPath);
  }

  async getOrCreateEnrolledUser(endUser: EndUser) {
    const enrolledUsers = await this.getDocumentByField('whatsappUserId', endUser.id, this._docPath);
    let currentEnrolledUser = enrolledUsers[0];

    if (!currentEnrolledUser) {
      const enrolledUser: EnrolledEndUser = {
        name: endUser.name,
        phoneNumber: endUser.phoneNumber,
        classId: '',
        currentCourse: '',
        whatsappUserId: endUser.id,
        status: EnrolledEndUserStatus.inactive
      };
  
      currentEnrolledUser = await this.createEnrolledUser(enrolledUser);
    };

    return currentEnrolledUser;
  };

  async getEnrolledUser(enrolledUserId: string) {
    return this.getDocumentById(enrolledUserId, this._docPath);
  }

  async updateEnrolledUser(enrolledUser: EnrolledEndUser) {
    return this.updateDocument(enrolledUser, this._docPath, enrolledUser.id)
  }
}
