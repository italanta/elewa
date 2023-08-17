import * as admin from 'firebase-admin';

import { randomUUID } from 'crypto';

import { HandlerTools } from '@iote/cqrs';
import { FunctionContext, FunctionHandler, RestResult } from '@ngfi/functions';

import { AssignableUnit, CourseObjective, CoursePackage } from '@app/private/model/convs-mgr/micro-apps/base';
import { CMI5ParserPayload } from '@app/private/model/convs-mgr/micro-apps/cmi5';

import { UnzipCourse } from './utils/unzip-course.util';
import { parseXMLConfig } from './utils/parse-xml-config.util';

export class CMI5ZipParser extends FunctionHandler<CMI5ParserPayload, RestResult>
{
  /**
   * Put a break on execution and halt the system to talk to a Human agent. */
  public async execute(req: CMI5ParserPayload, context: FunctionContext, tools: HandlerTools)
  {
    const MANIFEST = 'cmi5.xml';
    const BUCKET_NAME = process.env.BUCKET_NAME;

    const savedFilePath = `orgs/${req.orgId}/course-packages/${req.courseId}/${req.fileName}`;
    const extractDestPath = `orgs/${req.orgId}/course-packages/${req.courseId}`;

    const srcBucket = admin.storage().bucket(BUCKET_NAME);

    try {
      // Unzip the files and wait for the manifest to be extracted
      // Once it is extracted, we can download it and parse it as the rest of the files are unzipping
      const manifestExtracted = await UnzipCourse(extractDestPath, srcBucket, savedFilePath, tools);

      if (manifestExtracted) {
        // Download the extracted manifest file
        await srcBucket.file(extractDestPath + '/' + MANIFEST).download({ destination: MANIFEST });

        // Extract the configuration from the xml manifest file
        const config = parseXMLConfig(MANIFEST);

        // Save the configuration to the database
        await this.__saveConfiguration(config, req.orgId, req.courseId, tools);
      } else {
        tools.Logger.log(() => `Error Extracting Manifest`);

        return { status: 500 } as RestResult;
      }
      return { status: 200 } as RestResult;
    } catch (error) {
      tools.Logger.log(() => `Error Processing File: ${JSON.stringify(error)}`);

      return { status: 500 } as RestResult;
    }
  }


  private async __saveConfiguration(config: any, orgId: string, courseId: string, tools: HandlerTools)
  {
    let assignableUnit = config.au;
    
    await this.__saveAUs(assignableUnit, courseId, orgId, tools);

    await this.__saveCoursePackage(config, orgId, courseId, tools);
  }
  
  private async __saveCoursePackage(config: any, orgId: string, courseId: string, tools: HandlerTools) {
    const coursePackageRepo$ = tools.getRepository<CoursePackage>(`orgs/${orgId}/course-packages`);

    const couse = config.course;
    const configObjectives = config.objectives;

    const firstAUId = await this.__saveAUs(couse.au, courseId, orgId, tools);

    const objectives = this.__getObjectives(configObjectives);

    const newCoursePackage: CoursePackage = {
      id: courseId,
      title: couse.title.langstring,
      externalId: couse.Id,
      objectives: objectives,
      firstAU: firstAUId
    }

    await coursePackageRepo$.create(newCoursePackage);
    
  }

  private __getObjectives(configObjectives): CourseObjective[] {

    if(Array.isArray(configObjectives)) { 
      return configObjectives.map((obj) => {
        return {
          id: obj.id,
          title: obj.title.langstring,
          description: obj.description.langstring,
        } as CourseObjective;
      });
    } else {
      return [{
        id: configObjectives.id,
        title: configObjectives.title.langstring,
        description: configObjectives.description.langstring,
      } as CourseObjective];
    }
  }

  private async __saveAUs(assignableUnit: any, courseId: string, orgId: string, tools: HandlerTools)
  {
    const auRepo$ = tools.getRepository<AssignableUnit>(`orgs/${orgId}/course-packages/${courseId}/assignable-units`);

    let firstAUId: string;

    if (Array.isArray(assignableUnit)) {
      assignableUnit.forEach(async (au, i) =>
      {
        let newAU = this.__createAUObject(au, courseId);

        if(i === 0) { 
          firstAUId = newAU.id;
        }
        
        await auRepo$.create(newAU);
      });

    } else {
      const newAU = this.__createAUObject(assignableUnit, courseId);

      firstAUId = newAU.id;

      await auRepo$.create(newAU);
    }

    return firstAUId;
  }

  private __createAUObject(au: any, courseId: string)
  {

    const suffix = randomUUID().slice(0, 22);
    let auId = `${courseId}/${suffix}`;

    return {
      id: auId,
      title: au.title.langstring,
      description: au.description.langstring,
      externalId: au.Id,
      moveOn: au.moveOn,
      masteryScore: au.masteryScore,
      launchMethod: au.launchMethod,
      launchParameters: au.launchParameters,
      urlPath: au.url
    } as AssignableUnit;
  }
}