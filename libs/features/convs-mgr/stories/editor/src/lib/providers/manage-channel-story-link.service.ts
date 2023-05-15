import { Injectable } from '@angular/core';
import { runTransaction, getFirestore, doc, collection, updateDoc} from "firebase/firestore";

import { BehaviorSubject, Observable, Subject, from } from 'rxjs';

import { concatMap, map } from 'rxjs/operators';

import { Query } from '@ngfi/firestore-qbuilder';
import { DataService, Repository } from '@ngfi/angular';

import { CommunicationChannel, PlatformType } from '@app/model/convs-mgr/conversations/admin/system';

import { Logger } from '@iote/bricks-angular';
// import * as firebase from 'firebase/firestore';

const db = getFirestore();


const currentChannel: CommunicationChannel = {
  id: "string",
  name: "string",
  orgId: "string",
  defaultStory: "string",
  n: 1,
  type: PlatformType.WhatsApp
};

@Injectable({ providedIn: 'root' })

export class ManageChannelStoryLinkService
{


  private _currentChannel = new BehaviorSubject<CommunicationChannel>(currentChannel)

 

  setCurrentChannel(channel: CommunicationChannel) {
    this._currentChannel.next(channel);
    // this._currentChannel.complete();

  }

  getCurrentChannel() {
    return this._currentChannel.asObservable();
  }

  getDefaultChannel () {
    return currentChannel
  }


  constructor(private _repoFac: DataService, protected _logger: Logger,) {}

  private _getChannelRepo(): Repository<CommunicationChannel>
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

    const _channelRepo = this._getChannelRepo();
    const channelCount = from(this.incrementCounter(channel.orgId));

    return channelCount.pipe(concatMap(count =>
    {
      channel.n = count;
      return _channelRepo.write(channel, channel.id as string);
    }));

  }

  public updateChannel(channelToUpdate: CommunicationChannel) {
   
   console.log(channelToUpdate.id)

const channelsRef = collection(db, "channels");
  const channelDocRef = doc(channelsRef, channelToUpdate.id);
  return updateDoc(channelDocRef, {
    id: channelToUpdate.id,
    name: channelToUpdate.name,
    orgId: channelToUpdate.orgId,
    type: channelToUpdate.type,
  });
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
    const channelRepo = this._getChannelRepo();
    return channelRepo.getDocuments(new Query().where("id", "==", channel.id));
  }

  getChannelByName(name: string): Observable<CommunicationChannel> {
    const channelRepo = this._getChannelRepo();
    return channelRepo.getDocuments(new Query().where('name', '==', name).limit(1)).pipe(
      map((channels: CommunicationChannel[]) => channels[0])
    );
  }
  
  
}