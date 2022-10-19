import { config } from 'firebase-functions';
import * as admin from 'firebase-admin';

// Init Firebase Upload
const conf = config().firebase;
admin.initializeApp(conf);

export * from './functions/fns-webhooks';
// export * from './functions/fns-messages';

// export * from './app/functions/bot/engineProcessMessage.function';
// export * from './app/functions/bot/registerEndUser.function';
// export * from './app/functions/bot/engineAddMessage.function';
export * from './app/functions/bot/engineChatManager.function';
