import * as admin from 'firebase-admin';



export class BlockDataService {
  async saveBlocks(orgId: string, storyId: string, blocks: any[]): Promise<void> {
    const blocksRef = admin.firestore().collection(`orgs/${orgId}/stories/${storyId}/blocks`);

    for (const block of blocks) {
      await blocksRef.doc(block.id).set(block);
    }
  }
}
