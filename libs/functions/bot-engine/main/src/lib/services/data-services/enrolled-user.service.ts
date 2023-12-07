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

  async createEnrolledUser(endUser: EndUser, platform: PlatformType, id?:string) {
    const enrolledUser: EnrolledEndUser = {
      id:id || '',
      name: endUser.name || '',
      phoneNumber: endUser.phoneNumber || '',
      classId: '',
      currentCourse: '',
      courses: [],
      whatsappUserId: endUser.id,
      status: EnrolledEndUserStatus.Active
    };
    
    enrolledUser.platformDetails = {};
  
    enrolledUser.platformDetails[platform] = {
      endUserId: endUser.id,
      contactID: endUser.id.split('_')[2]
    }

    return this.createDocument(enrolledUser, this._docPath, id);
  }

  /** get timeInDate's created user count */
  async getSpecificDayUserCount(orgId: string, timeInUnix:number) {
    // Set the time to the start of the day (00:00:00)
    const startAt = new Date(timeInUnix);
    startAt.setHours(0, 0, 0, 0);

    const endAt = new Date(timeInUnix);
    endAt.setHours(23, 59, 59, 999);

    const enrolledUsers = this._getEnrolledUsrRepo(orgId).getDocuments(
      new Query().where('createdOn', ">=" , startAt).where('createdOn', '<=', endAt)
    );

    return enrolledUsers;
  };

  /** get the past week created user count */
  async getPastWeekUserCount(orgId: string, timeInUnix:number) {
    const timeInDate = new Date(timeInUnix);
    const startAt = new Date(timeInDate.getTime() - 7 * 24 * 60 * 60 * 1000); // Calculate the start date (seven days ago) to millisecond equivalent
    const endAt = timeInDate;

    const enrolledUsers = this._getEnrolledUsrRepo(orgId).getDocuments(
      new Query().where('createdOn', '>=', startAt).where('createdOn', '<=', endAt)
    );

    return enrolledUsers;
  };

  /** get the past month created user count */
  async getPastMonthUserCount(orgId: string, timeInUnix:number) {
    const timeInDate = new Date(timeInUnix);
    const startAt = new Date(timeInDate.getFullYear(), timeInDate.getMonth(), 0);
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
