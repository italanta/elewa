import { Injectable } from '@angular/core';
import { runTransaction, getFirestore, doc } from "firebase/firestore";

import { from } from 'rxjs';

import { concatMap } from 'rxjs/operators';

import { Query } from '@ngfi/firestore-qbuilder';
import { DataService, Repository } from '@ngfi/angular';

import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';
import { Logger } from '@iote/bricks-angular';
import { SharedService } from '../components/shared-service';
// import * as firebase from 'firebase/firestore';

const db = getFirestore();

@Injectable({ providedIn: 'root' })

export class ManageChannelStoryLinkService
{


  constructor(private _repoFac: DataService, protected _logger: Logger,   private sharedService: SharedService,) {}

  private _getChannelRepo(channel: CommunicationChannel): Repository<CommunicationChannel>
  {
    const _channelRepo = this._repoFac.getRepo<CommunicationChannel>(`channels`);

    return _channelRepo;
  }

  /**
   * Sets the value of 'n' and writes the new communication channel to the database
   * 
   * @see CommunicationChannel.n
   */
  public addStoryToChannel(channel: CommunicationChannel)
  {

    const _channelRepo = this._getChannelRepo(channel);
    const channelCount = from(this.incrementCounter(channel.orgId));

    return channelCount.pipe(concatMap(count =>
    {
      this.sharedService.setPublishedStatus(channel);
      channel.n = count;
      return _channelRepo.write(channel, channel.id as string);
    }));

  }

  public updateChannel(channelToUpdate: CommunicationChannel) {
    // Construct a new channel object with the same ID and phone number ID as the existing channel,
    // but with all other properties from the updated channel
    // const channelToUpdate: CommunicationChannel = {
    //   id: existingChannel.id,
    //   orgId: existingChannel.orgId,
    //   n: existingChannel.n,
    //   type: existingChannel.type,
    //   name: updatedChannel.name,
    //   description: updatedChannel.description,
    //   // Add other properties that can be updated here
    //   phone_number_id: existingChannel.phone_number_id
    // };
  
    // Call the repository's write method to update the channel
    const _channelRepo = this._getChannelRepo(channelToUpdate);
    return _channelRepo.write(channelToUpdate, channelToUpdate.id as string);
  }
  


  /**
   * Increments 'n' from @type {CommunicationChannel} 
   *
   * We save 'n' per organization. So we use a separate collection to save and increment the value of 'n'.
   * 
   * To avoid race conditions, we use firebase transactions to read the current value, increment it and 
   *  update the document. In the case of a concurrent edit, Cloud Firestore runs the entire transaction again
   * 
   * The final value is returned and is set to the CommunicationChannel object before writing to firebase in
   *  addStoryToChannel();
   * 
   * @see https://firebase.google.com/docs/firestore/manage-data/transactions
   */
  public async incrementCounter(orgId: string)
  {
    const docRef = doc(db, `channels/counter/${orgId}/--n--`);

    try {
      return runTransaction(db, async (transaction) =>
      {
        const counterDoc = await transaction.get(docRef);
        if (!counterDoc.exists()) {
          transaction.set(docRef, { n: 1 });
        } else {
          const newCount = counterDoc.data()['n'] + 1;

          transaction.update(docRef, { n: newCount });

          this._logger.log(() => "Transaction successful");

          return newCount;
        }
      });

    } catch (e) {
      this._logger.log(() => `Transaction failed: ${e}`);
    }
  }

  public getSingleStoryInChannel(channel: CommunicationChannel)
  {
    const channelRepo = this._getChannelRepo(channel);
    return channelRepo.getDocuments(new Query().where("id", "==", channel.id));
  }
  
  // public getData(channelId) {
  //   const channelRepo = this._getChannelRepo(channel);
  //   return channelRepo.getDocuments(new Query().where("id", "==", channelId));
  // }
  
}