import { HandlerTools } from '@iote/cqrs';

import { Classroom } from '@app/model/convs-mgr/classroom';

import { BotDataService } from './data-service-abstract.class';

/**
 * Contains all the required database flow methods for the chat-status collection
 */
export class ClassroomDataService extends BotDataService<Classroom> {
  private _docPath: string;
  tools: HandlerTools;

  constructor(tools: HandlerTools, orgId: string) {
    super(tools);
    this.tools = tools;
    this._init(orgId);
  }

  protected _init(orgId: string): void {
    this._docPath = `orgs/${orgId}/classes`;
  }

  async createClassroom(classroom: Classroom) {
    return this.createDocument(classroom, this._docPath, classroom.id);
  }

  async getOrCreateClassroom(classroom: Classroom, classroomId?: string) {
    let currentClassroom;
    if (!classroomId) {
      currentClassroom = await this.getDocumentById(
        classroomId || classroom.id,
        this._docPath
      );
    }

    if (!currentClassroom)
      currentClassroom = await this.createClassroom(classroom);

    return currentClassroom;
  }

  async getClassroom(classroomId: string) {
    return this.getDocumentById(classroomId, this._docPath);
  }

  async getClassrooms() {
    return this.getDocuments(this._docPath);
  }

  async updateClassroom(classroom: Classroom) {
    return this.updateDocument(classroom, this._docPath, classroom.id);
  }
}
