import { config } from 'firebase-functions';
import * as admin from 'firebase-admin';

// Init Firebase Upload
const conf = config().firebase;
admin.initializeApp(conf);

export * from './app/webhooks/whatsapp-receive-incoming-message.function';
