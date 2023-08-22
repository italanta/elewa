import * as admin from 'firebase-admin';

import { randomUUID } from 'crypto';

import { HandlerTools } from '@iote/cqrs';
import { FunctionContext, FunctionHandler, RestResult } from '@ngfi/functions';

import { AssignableUnit, CourseObjective, CoursePackage } from '@app/private/model/convs-mgr/micro-apps/base';
import { CMI5ParserPayload } from '@app/private/model/convs-mgr/micro-apps/cmi5';

import { UnzipCourse } from './utils/unzip-course.util';
import { parseXMLConfig } from './utils/parse-xml-config.util';

/**
 * The cmi5 zip is a package that contains the course structure, launch configuration and 
 *   the html content of all the units published.
 * 
 * On a platform such as 'Articulate', when you publish the course you can select the cmi5 spec
 *   and it will export the course you have created to a cmi5 zip.
 * 
 * This zip can then be uploaded to the CLM via the cmi5 block and processed by this handler.
 * 
 * The below handler does three things:
 *  1. Extract the zip and save the files in firebase storage
 *  2. Parse the manifest xml file (cmi5.xml)
 *  3. Store the manifest configuration to firestore
 * 
 * @see CoursePackage
 * @see AssignableUnit
 */
export class CMI5ZipParser extends FunctionHandler<CMI5ParserPayload, RestResult>
{
  public async execute(req: CMI5ParserPayload, context: FunctionContext, tools: HandlerTools)
  {
    // Set the manifest name and bucket name
    const MANIFEST = 'cmi5.xml';
    const BUCKET_NAME = process.env.BUCKET_NAME;

    // Path of the saved cmi5 zip file
    const savedFilePath = `orgs/${req.orgId}/course-packages/${req.courseId}/${req.fileName}`;

    // Path to save the extracted course contents
    const extractDestPath = `orgs/${req.orgId}/course-packages/${req.courseId}`;

    // Get the firebase storage bucket
    const srcBucket = admin.storage().bucket(BUCKET_NAME);

    try {
      // Unzip the files and wait for the manifest to be extracted
      // Once it is extracted, we can download it and parse it as the rest of the files are unzipping
      const manifestExtracted = await UnzipCourse(extractDestPath, srcBucket, savedFilePath, tools);

      if (manifestExtracted) {
        // Download the extracted manifest file
        await srcBucket.file(extractDestPath + '/' + MANIFEST).download({ destination: MANIFEST });

        // Extract the configuration from the xml manifest file
        // The xml parser returns an object in the structure of the xml file
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

  /**
   * Takes the configuration object returned by the xml parser, and saves the configuration
   *  of the AUs and the Course to firestore.
   * 
   * The course is saved to `orgs/${orgId}/course-packages`
   * The AUs are saved to `orgs/${orgId}/course-packages/${courseId}/assignable-units`
   */
  private async __saveConfiguration(config: any, orgId: string, courseId: string, tools: HandlerTools)
  {
    let assignableUnit = config.au;
    
    await this.__saveAUs(assignableUnit, courseId, orgId, tools);

    await this.__saveCoursePackage(config, orgId, courseId, tools);
  }
  
  /**
   * Specifically saves the course configuration from the configuration object extracted by the xml parser
   */
  private async __saveCoursePackage(config: any, orgId: string, courseId: string, tools: HandlerTools) {
    const coursePackageRepo$ = tools.getRepository<CoursePackage>(`orgs/${orgId}/course-packages`);

    // Get the course and course objectvies from the config
    const course = config.course;
    const configObjectives = config.objectives;

    // Pass and save all the AUs in the manifest, and returns the first Id
    const firstAUId = await this.__saveAUs(course.au, courseId, orgId, tools);

    // Extract the objectives and map them into an Array
    const objectives = this.__getObjectives(configObjectives);

    // Create the course package
    const newCoursePackage: CoursePackage = {
      id: courseId,
      title: course.title.langstring,
      externalId: course.Id,
      objectives: objectives,
      firstAU: firstAUId
    }

    await coursePackageRepo$.create(newCoursePackage);
    
  }

  /**
   * Get's the list of course objectives as defined in the manifest.
   * 
   * Course objectives are not trackable therefore it is wise to use
   *  a platform that places them into Assignable Units. 
   */
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

  /**
   * Saves the AUs as defined in the configuration and returns the first AU. This AU
   *  will then be saved to the course object so that when launching, we know where to
   *    start from.
   */
  private async __saveAUs(assignableUnit: any, courseId: string, orgId: string, tools: HandlerTools)
  {
    const auRepo$ = tools.getRepository<AssignableUnit>(`orgs/${orgId}/course-packages/${courseId}/assignable-units`);

    let firstAUId: string;

    // If it is an array of AUs, then we loop through each
    //  and save them to the database.
    // The first AU, in the xml file will be the first unit of our course
    if (Array.isArray(assignableUnit)) {
      assignableUnit.forEach(async (au, i) =>
      {
        // Maps the configuration into our own
        //  defined interface
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

  /**
   * Maps the configuration into our own defined Assignable Unit interface
   */
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