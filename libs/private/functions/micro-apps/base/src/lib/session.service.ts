import { randomUUID } from "crypto";

import { HandlerTools } from "@iote/cqrs";
import { Query } from "@ngfi/firestore-qbuilder";

import { LearnerSession, LMSLaunchData, AUStatusTypes } from "@app/private/model/convs-mgr/micro-apps/base";

export class LearnerSessionService
{
  learnerSession: LearnerSession;

  constructor(private tools: HandlerTools) { }

  public generateSessionID()
  {
    this.learnerSession.id = randomUUID().slice(0, 22);

    return this.learnerSession.id;
  }

  public async getSession(orgId: string, auId: string, sessionID: string)
  {
    const courseId = auId.split('/')[0];

    const sessionRepo$ = this.tools.getRepository<LearnerSession>(`orgs/${orgId}/course-packages/${courseId}/sessions`);

    const session = await sessionRepo$.getDocumentById(sessionID);

    if (session) {
      return session;
    } else {
      this.tools.Logger.warn(() => `No session found for AU :: ${auId}`);

      return null;
    }
  }

  public async getSessionByAU(orgId: string, auId: string)
  {
    const courseId = auId.split('/')[0];

    const sessionRepo$ = this.tools.getRepository<LearnerSession>(`orgs/${orgId}/course-packages/${courseId}/sessions`);

    const session = await sessionRepo$.getDocuments(new Query().where('currentUnit', '==', auId));

    if (session.length > 0) {
      return session[0];
    } else {
      this.tools.Logger.warn(() => `No session found for AU :: ${auId}`);

      return null;
    }
  }


  public create(orgId: string, endUserId: string, auId: string, state: LMSLaunchData)
  {
    const courseId = auId.split('/')[0];

    const sessionRepo$ = this.tools.getRepository<LearnerSession>(`orgs/${orgId}/course-packages/${courseId}/sessions`);

    // Create session object
    this.learnerSession = {
      ...this.learnerSession,
      currentUnit: auId,
      stateData: state,
      start: new Date(),
      learnerId: endUserId,

      // Set status to launched
      activityStatus: [{
        id: auId,
        status: AUStatusTypes.Launched,
      }]
    };

    return sessionRepo$.create(this.learnerSession);
  }

  public update(session: LearnerSession, orgId: string, auId: string)
  {
    const courseId = auId.split('/')[0];

    const sessionRepo$ = this.tools.getRepository<LearnerSession>(`orgs/${orgId}/course-packages/${courseId}/sessions`);

    return sessionRepo$.update(session);
  }
}