import { firestore } from 'firebase-admin';

import { HandlerTools, Repository } from '@iote/cqrs';
import { Query } from '@ngfi/firestore-qbuilder';

import { BotDataService } from './data-service-abstract.class';

import { EnrolledEndUser, EnrolledEndUserStatus } from '@app/model/convs-mgr/learners';
import { EndUser } from '@app/model/convs-mgr/conversations/chats';

/**
 * Contains all the required database flow methods for the enrolled collection
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

  private _getEnrolledUsrRepo(orgId: string): Repository<EnrolledEndUser>
  {
    const EnrolledUsrRepo = this.tools.getRepository<EnrolledEndUser>(`orgs/${orgId}/enrolled-end-users`);

    return EnrolledUsrRepo;
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

  async getTodaysUsers(orgId: string) {
    const enrolledUsers = this. _getEnrolledUsrRepo(orgId).getDocuments(
      new Query().where('created-At', ">=" , firestore.Timestamp.fromDate(new Date()))
    );

    return enrolledUsers;
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
