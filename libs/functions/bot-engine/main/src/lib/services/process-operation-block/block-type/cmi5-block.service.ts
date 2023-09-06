/**
 * This service class handles CMI5 blocks and prepares them for launch. It interacts with data services
 * to fetch information about assignable units, prepares the block for launch using the CMI5Service,
 * and generates launch links.
 */
import { HandlerTools } from '@iote/cqrs';

import { CMI5Block } from '@app/model/convs-mgr/stories/blocks/messaging';
import { Actor, AssignableUnit, CoursePackage } from '@app/private/model/convs-mgr/micro-apps/base';
import { Cursor, EndUserPosition } from '@app/model/convs-mgr/conversations/admin/system';
import { EndUser } from '@app/model/convs-mgr/conversations/chats';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { CMI5Service } from '@app/private/functions/micro-apps/cmi5'; 
import { CMI5LaunchBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { BlockDataService } from '../../data-services/blocks.service';
import { ConnectionsDataService } from '../../data-services/connections.service';
import { IProcessOperationBlock } from '../models/process-operation-block.interface';

export class CMI5BlockService implements IProcessOperationBlock {
  // Operations service(firstblock.id)
  private cmi5Service: CMI5Service; // Create an instance of the CMI5Service
  /**
   * Creates an instance of CMI5BlockService.
   * @param _blockDataService The data service for handling blocks.
   * @param _connDataService The data service for handling connections.
   * @param tools The handler tools for performing operations.
   */
  constructor(
    private _blockDataService: BlockDataService,
    private _connDataService: ConnectionsDataService,
    private tools: HandlerTools
  ) 
  {
    this.cmi5Service = new CMI5Service(tools); 
  }
  sideOperations: Promise<any>[];
  /**
   * Handles a CMI5 block and prepares it for launch.
   * @param storyBlock The CMI5 block to handle.
   * @param updatedCursor The updated cursor object.
   * @param orgId The organization ID.
   * @param endUser The end user for whom the block is being handled.
   * @returns An object containing the launch link and the new cursor.
   */
  async handleBlock(
    storyBlock: CMI5Block,
    updatedCursor: Cursor,
    orgId: string,
    endUser: EndUser
  ) {
    try {
      // Fetch the details of the first AU from the CoursePackage
      const coursePackage = await this.getCoursePackage(orgId, storyBlock.courseId);
      
      if (coursePackage) {
        const firstAUID = coursePackage.firstAU; // Get the ID of the first AU
        
        // Fetch the first AU by ID
        const firstAU = await this.getAssignableUnit(orgId, firstAUID);
        
        if (firstAU) {
          // Now you have the first AssignableUnit (AU) and can work with it
          const firstAULocationURL = "";
          const firstAUId = firstAU.id;
          
          // Prepare the AU for launch using CMI5Service
          await this.cmi5Service.prepareForLaunch(orgId, endUser.id, firstAUId);
          
          // Create Actor "actor" is the end user or learner who will be engaging with the course module.
          const actor: Actor = {
            objectType: 'Agent',
            name: endUser.name,
            account: {
              homePage: orgId,
              name: endUser.id,
            },
          };
          
          // Generate the launch link using the AU details and actor properties
          const launchLink = this.cmi5Service.createLaunchURL(
            firstAULocationURL, // Use firstAULocationURL
            actor,
            endUser.id,
            firstAUId
          );
          
          const launchBlock : CMI5LaunchBlock = {
            link: launchLink,   
          }
          
          // Assuming storyBlock.id is a string
          const endUserPosition: EndUserPosition = {
            storyId: storyBlock.id,
            blockId: storyBlock.id,
          };
          
          // Then assign endUserPosition to updatedCursor.position
          updatedCursor.position = endUserPosition;
          
          return {
            storyBlock: launchBlock,
            newCursor: updatedCursor,
          };
        }
      }
    } catch (error) {
      this.tools.Logger.error(error);
    }
  }
  /**
   * Retrieves the CoursePackage for the given organization and course ID.
   * @param orgId The organization ID.
   * @param courseId The course ID.
   * @returns A Promise that resolves to a CoursePackage object.
   */
  private async getCoursePackage(orgId: string, courseId: string): Promise<CoursePackage | null> {
    try {
      // Fetch the CoursePackage based on orgId and courseId
      const repository = this.tools.getRepository<CoursePackage>(
        `orgs/${orgId}/course-packages/${courseId}`
      );
      const coursePackage = await repository.getDocumentById(courseId);
      return coursePackage || null;
    } catch (error) {
      this.tools.Logger.error(error);
      return null;
    }
  }
  /**
   * Retrieves an AssignableUnit by its ID.
   * @param orgId The organization ID.
   * @param auId The AssignableUnit ID.
   * @returns A Promise that resolves to an AssignableUnit object.
   */
  private async getAssignableUnit(orgId: string, auId: string): Promise<AssignableUnit | null> {
    try {
      // Fetch the AssignableUnit based on orgId and auId
      const repository = this.tools.getRepository<AssignableUnit>(
        `orgs/${orgId}/assignable-units/${auId}`
      );
      const au = await repository.getDocumentById(auId);
      return au || null;
    } catch (error) {
      this.tools.Logger.error(error);
      return null;
    }
  }
}
