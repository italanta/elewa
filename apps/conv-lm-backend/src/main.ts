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
export * from './app/bot/main/delete-bot.function';
export * from './app/bot/main/delete-module.function';
export * from './app/bot/main/delete-story.function';

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


//  Micro Apps Base
export * from './app/micro-apps/base/init-microapp.function'
export * from './app/micro-apps/base/update-microapp.function'
export * from './app/micro-apps/base/get-app-progress.function'
export * from './app/micro-apps/base/complete-micro-app.function'

// Assessment Micro App
export * from './app/micro-apps/assessments/get-assessment-results.function'
export * from './app/micro-apps/assessments/get-assessment-users.function'