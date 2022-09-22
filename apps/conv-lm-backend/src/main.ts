export * from './app/a-basic-function';

import { config } from 'firebase-functions';
import * as admin from 'firebase-admin';

// Init Firebase Upload
const conf = config().firebase;
admin.initializeApp(conf);

export * from './app/a-basic-function';
export * from './app/functions/bot/processMessage.function';
export * from './app/functions/bot/registerUser.function';