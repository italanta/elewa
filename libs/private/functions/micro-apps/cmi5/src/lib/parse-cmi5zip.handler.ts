import * as admin from 'firebase-admin';

import { randomUUID } from 'crypto';
import { tmpdir } from 'os';
import * as path from 'path';

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
  private firstAUId: string;

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

        const tempFilePath = path.join(tmpdir(), (MANIFEST));

        // Download the extracted manifest file
        const response = await srcBucket.file(extractDestPath + '/' + MANIFEST).download({ destination: tempFilePath });

        response;

        // Extract the configuration from the xml manifest file
        // The xml parser returns an object in the structure of the xml file
        const config = parseXMLConfig(tempFilePath);

        // Save the configuration to the database
        await this.__saveConfiguration(config, req.orgId, req.courseId, tools);
      } else {
        tools.Logger.log(() => `Error Extracting Manifest`);

        return { status: 500 } as RestResult;
      }
      return { status: 200 } as RestResult;
    } catch (error) {
      tools.Logger.log(() => `Error Processing File: ${error}`);

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

    this.firstAUId = await this.__saveAUs(assignableUnit, courseId, orgId, tools);

    await this.__saveCoursePackage(config, orgId, courseId, tools);
  }

  /**
   * Specifically saves the course configuration from the configuration object extracted by the xml parser
   */
  private async __saveCoursePackage(config: any, orgId: string, courseId: string, tools: HandlerTools)
  {
    const coursePackageRepo$ = tools.getRepository<CoursePackage>(`orgs/${orgId}/course-packages`);

    // Get the course and course objectvies from the config
    const course = config.course;
    const courseObjectives = config.objectives;

    // Extract the objectives and map them into an Array
    const objectives = this.__getObjectives(courseObjectives);

    // Create the course package
    const newCoursePackage: CoursePackage = {
      id: courseId,
      title: course.title.langstring["#text"],
      externalId: course.id,
      objectives: objectives,
      firstAU: this.firstAUId,
      lang: course.title.langstring.lang
    };

    await coursePackageRepo$.write(newCoursePackage, courseId);

  }

  /**
   * Get's the list of course objectives as defined in the manifest.
   * 
   * Course objectives are not trackable therefore it is wise to use
   *  a platform that places them into Assignable Units. 
   */
  private __getObjectives(configObjectives): CourseObjective[]
  {

    if (Array.isArray(configObjectives.objective)) {
      return configObjectives.objective.map((obj) =>
      {
        return {
          id: obj.id,
          title: obj.title.langstring["#text"],
          description: obj.description.langstring["#text"],
        } as CourseObjective;
      });
    } else {
      return [{
        id: configObjectives.objective.id,
        title: configObjectives.objective.title.langstring["#text"],
        description: configObjectives.objective.description.langstring["#text"],
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

    const newAU = this.__createAUObject(assignableUnit, courseId);

    firstAUId = newAU.id;

    await auRepo$.write(newAU, newAU.id);

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
      title: au.title.langstring["#text"],
      description: au.description.langstring["#text"],
      externalId: au.id,
      moveOn: au.moveOn,
      masteryScore: au.masteryScore,
      launchMethod: au.launchMethod,
      launchParameters: au.launchParameters,
      urlPath: au.url
    } as AssignableUnit;
  }
}