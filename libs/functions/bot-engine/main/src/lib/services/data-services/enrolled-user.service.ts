import { HandlerTools } from '@iote/cqrs';

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
