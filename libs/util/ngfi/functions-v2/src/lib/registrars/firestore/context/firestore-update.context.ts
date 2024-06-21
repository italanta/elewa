import { Change } from 'firebase-functions/v2/firestore';

import { FirestoreContext } from './firestore.context';

export interface FirestoreUpdateContext extends FirestoreContext
{
  change: Change<FirebaseFirestore.DocumentSnapshot>;
  before: any;
  after: any;
}
