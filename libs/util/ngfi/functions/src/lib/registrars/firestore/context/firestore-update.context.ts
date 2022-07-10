import { Change } from 'firebase-functions';

import { FirestoreContext } from './firestore.context';

export interface FirestoreUpdateContext extends FirestoreContext
{
  change: Change<FirebaseFirestore.DocumentSnapshot>;
}
