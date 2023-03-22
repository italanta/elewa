import { config } from 'firebase-functions';
import * as admin from 'firebase-admin';

// Init Firebase Upload
const conf = config().firebase;
admin.initializeApp(conf);

export * from './app/bot/whatsapp-channel/whatsapp-receive-incoming-message.function';
export * from './app/bot/main/send-outgoing-message.function';
export * from './app/bot/main/talk-to-human.function';
