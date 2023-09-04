import { HandlerTools } from '@iote/cqrs';
import { Query } from '@ngfi/firestore-qbuilder';

import { CMI5Block } from '@app/model/convs-mgr/stories/blocks/messaging';
import { Actor, AssignableUnit } from '@app/private/model/convs-mgr/micro-apps/base';
import { Cursor } from '@app/model/convs-mgr/conversations/admin/system';
import { EndUser } from '@app/model/convs-mgr/conversations/chats';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { CMI5Service } from '@app/private/functions/micro-apps/cmi5'; 

import { BlockDataService } from '../../data-services/blocks.service';
import { ConnectionsDataService } from '../../data-services/connections.service';
import { IProcessOperationBlock } from '../models/process-operation-block.interface';





export class CMI5BackendBlockService implements IProcessOperationBlock {
  // Operations service(firstblock.id)
  private cmi5Service: CMI5Service; // Create an instance of the CMI5Service

  /**
   * Creates an instance of CMI5BackendBlockService.
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
   
      // Fetch the details of the first AU
      const firstAUs = await this.getAssignableUnits(orgId, storyBlock.id);
 

      if (firstAUs.length === 0) {
        console.error('No assignable units found.');
        return;
      }

      const firstAU = firstAUs[0];
      // Assuming you want the first item in the array
      const firstAULocationURL = firstAU.urlPath;

      const firstAUId = firstAU.id;

      // Prepare the AU for launch
      await this.cmi5Service.prepareForLaunch(orgId, endUser.id, firstAUId);

      // Define the actor properties here
      const actor: Actor = {
        objectType: 'Agent',
        name: endUser.name,
        account: {
          homePage: endUser.id,
          name: endUser.name,
        },
      };

      // Generate the launch link using the AU details and actor properties
      const launchLink = this.cmi5Service.createLaunchURL(
        firstAULocationURL, // Use firstAULocationURL
        actor,
        endUser.id,
        firstAUId
      );

      const launchBlock: CMI5LaunchBlock = {
        link: launchLink
      }


      const response = {
        storyBlock: launchBlock,
        newCursor: updatedCursor,
      };

      return response;


    } catch (error) {
      console.error('Error handling CMI5 block:', error);
    }
  }


   /**
   * Retrieves a list of assignable units for a given organization and course ID.
   * @param orgId The organization ID.
   * @param courseId The course ID.
   * @returns A Promise that resolves to an array of AssignableUnit objects.
   */

    private async getAssignableUnits(
      orgId: string,
      courseId: string
    ): Promise<AssignableUnit[]> {
      try {
        // Use the Repository to get the assignable units
        const repository = this.tools.getRepository<AssignableUnit>(
          `orgs/${orgId}/course-packages/${courseId}/assignable-units`
        );
        const assignableUnit = await repository.getDocuments(new Query().orderBy("createdOn", "desc").limit(1));
        return assignableUnit;
      } catch (error) {
        console.error('Error fetching Assignable Units:', error);
        return [];
      }
    }
}


