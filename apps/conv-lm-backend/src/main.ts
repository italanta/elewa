import { config } from 'firebase-functions';
import * as admin from 'firebase-admin';

// Init Firebase Upload
const conf = config().firebase;
admin.initializeApp(conf);

export * from './app/bot/whatsapp-channel/whatsapp-receive-incoming-message.function';
export * from './app/bot/whatsapp-channel/whatsapp-upload-media.function';
export * from './app/bot/whatsapp-channel/whatsapp-templates-api.function';
export * from './app/bot/whatsapp-channel/whatsapp-get-templates.function';
export * from './app/bot/whatsapp-channel/whatsapp-upload-media.function';
export * from './app/bot/whatsapp-channel/whatsapp-upload-media-cron.function';

export * from './app/bot/main/send-outgoing-message.function';
export * from './app/bot/main/talk-to-human.function';
export * from './app/bot/main/move-chat.function';

export * from './app/analytics/fns-measure-group-progress';
export * from './app/analytics/fns-aggregate-progress';

export * from './app/bot/messenger/messenger-receive-message.function';
export * from './app/bot/main/send-multiple-messages.function';
export * from './app/bot/main/schedule/schedule-message-templates.function';
export * from './app/bot/main/schedule/check-inactivity.function';
export * from './app/bot/main/schedule/set-inactivity.function';
export * from './app/bot/main/schedule/run-schedule.function';

export * from './app/micro-apps/cmi5/fetch-token.function';
export * from './app/micro-apps/cmi5/cmi5-zip-parser.function';
export * from './app/micro-apps/cmi5/cmi-listener.function';
export * from './app/micro-apps/surveys/start-survey.function';

export * from './app/user/create-new-user.function';

export * from './app/organisation/on-create-org-assign-user-to-org.function';


// Intent CRUD
export * from './app/ai-agent/intent/create-intent.function';
export * from './app/ai-agent/intent/delete-intent.function';
export * from './app/ai-agent/intent/edit-intent.function';
export * from './app/ai-agent/intent/get-intent.function';

// Whatsapp flows
export * from './app/whatsapp-flows/on-create-whatsapp-flow.function';
export * from './app/whatsapp-flows/on-update-whatsapp-flow.function';

// Ivr functions
export * from './app/bot/ivr/azure-audio-upload.function';
export * from './app/bot/ivr/azure-tts.function';
export * from './app/bot/ivr/twilio-handle-incoming-calls.function';