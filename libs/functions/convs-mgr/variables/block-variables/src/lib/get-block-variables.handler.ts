import * as admin from 'firebase-admin';
import { FunctionHandler } from '@ngfi/functions';

export class fetchBlockVariables extends FunctionHandler<{ botId: string, orgId: string }, any> {

 public async execute(data: { botId: string, orgId: string }): Promise<any> {
   const { botId, orgId } = data;

   // Step 1: Fetch modules
   const modulesPath = `orgs/${orgId}/bots/${botId}`;
   const botRef = admin.firestore().doc(modulesPath);
   const botSnapshot = await botRef.get();

   const botData = botSnapshot.data();
   const modules = Array.isArray(botData?.modules) ? botData.modules : [];

   // Step 2: Fetch stories using module IDs
   const storiesPromises = modules.map(async (moduleId: string) => {
     const storiesPath = `orgs/${orgId}/modules/${moduleId}`;
     const storiesRef = admin.firestore().doc(storiesPath);
     const storiesSnapshot = await storiesRef.get();

     const storiesData = storiesSnapshot.data();
     const stories = Array.isArray(storiesData?.stories) ? storiesData.stories : [];
     return stories;
   });

   const allStories = await Promise.all(storiesPromises);

   // Flatten the array of arrays into a single array of story IDs
   const storyIds = allStories.reduce((acc, stories) => acc.concat(stories), []);

   // Step 3: Fetch blocks using story IDs
   const blocksPromises = storyIds.map(async (storyId: string) => {
     const blocksPath = `orgs/${orgId}/stories/${storyId}/blocks`;
     const blocksRef = admin.firestore().doc(blocksPath);
     const blocksSnapshot = await blocksRef.get();

     const blocksData = blocksSnapshot.data();
     const blocks = Array.isArray(blocksData?.blocks) ? blocksData.blocks : [];
     return blocks;
   });

   const allBlocks = await Promise.all(blocksPromises);

   // Flatten the array of arrays into a single array of block IDs
   const blockIds = allBlocks.reduce((acc, blocks) => acc.concat(blocks), []);

   // Step 4: Fetch variables using block IDs
   const variablesPromises = blockIds.map(async (blockId: string) => {
     const variablesPath = `orgs/${orgId}/stories/${storyIds}/blocks/${blockId}`;
     const variablesRef = admin.firestore().doc(variablesPath);
     const variablesSnapshot = await variablesRef.get();

     const variablesData = variablesSnapshot.data();
     const variables = Array.isArray(variablesData?.variables) ? variablesData.variables : [];
     return variables;
   });

   const allVariables = await Promise.all(variablesPromises);

   // Flatten the array of arrays into a single array of variables
   const allVariablesFlat = allVariables.reduce((acc, variables) => acc.concat(variables), []);

   return allVariablesFlat;
 }
}
