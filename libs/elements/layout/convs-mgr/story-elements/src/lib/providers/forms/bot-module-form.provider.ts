import { FormBuilder, Validators } from '@angular/forms';

import { BotModule } from '@app/model/convs-mgr/bot-modules';

import { generateName } from '../util/generate-name';

export function BOT_MODULE_FORM(_fb: FormBuilder, botModule: BotModule) {
  return _fb.group({
    id: [botModule ? botModule.id : ''],
    moduleName: [
      botModule ? botModule.name : generateName(),
      Validators.required,
    ],
    moduleDesc: [botModule ? botModule.description : ''],
    parentBot: [botModule ? botModule.parentBot : '', Validators.required],
    stories: [botModule ? botModule.stories : []],
    type: ['BotModule'],
    isInteractiveVoiceResponse: [botModule ? botModule.isInteractiveVoiceResponse : false]
  });
}
