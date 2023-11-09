import { HandlerTools, Repository } from '@iote/cqrs';
import { Query } from '@ngfi/firestore-qbuilder';

import { BotDataService } from './data-service-abstract.class';

import { EnrolledEndUser, EnrolledEndUserStatus } from '@app/model/convs-mgr/learners';
import { EndUser } from '@app/model/convs-mgr/conversations/chats';
import { PlatformType, __PrefixToPlatformType } from '@app/model/convs-mgr/conversations/admin/system';

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

  /** get today's created user count */
  async getTodaysUsers(orgId: string, timeInUnix:number) {
    // Set the time to the start of the day (00:00:00)
    const timeInDate = new Date(timeInUnix);
    timeInDate.setHours(0, 0, 0, 0);

    const enrolledUsers = this._getEnrolledUsrRepo(orgId).getDocuments(
      new Query().where('createdOn', ">=" , new Date(timeInDate))
    );

    return enrolledUsers;
  };

  /** get the past week created user count */
  async getPastWeekUserCount(orgId: string) {
    const today = new Date();
    const startAt = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7); // Start date (seven days ago)
    const endAt = today;

    const enrolledUsers = this._getEnrolledUsrRepo(orgId).getDocuments(
      new Query().where('createdOn', '>=', startAt).where('createdOn', '<=', endAt)
    );

    return enrolledUsers;
  };

  /** get the past month created user count */
  async getPastMonthUserCount(orgId: string) {
    const today = new Date();
    const startAt = new Date(today.getFullYear(), today.getMonth(), 0);
    const endAt = new Date();

    const enrolledUsers = this._getEnrolledUsrRepo(orgId).getDocuments(
      new Query().where('createdOn', '>=', startAt).where('createdOn', '<=', endAt)
    );

    return enrolledUsers;
  };

  getEnrolledUserByEndUser(endUserId: string) {
    const platformPrefix = endUserId.split("_")[0];

    const platform  = __PrefixToPlatformType(platformPrefix);

    switch (platform) {
      case PlatformType.WhatsApp:
        return this.getDocumentByField('whatsappUserId', endUserId, this._docPath);
      case PlatformType.Messenger:
        return this.getDocumentByField('messengerUserId', endUserId, this._docPath);
      default:
        return this.getDocumentByField('whatsappUserId', endUserId, this._docPath);
    }
  }

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
