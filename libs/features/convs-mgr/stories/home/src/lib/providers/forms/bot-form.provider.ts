import { FormBuilder } from '@angular/forms';

import { Bot } from '@app/model/convs-mgr/bots';

import { generateName } from '../util/generate-name';

export function BOT_FORM(_fb: FormBuilder, bot?:Bot) {
  return _fb.group({
    id: [bot ? bot.id : ''],
    botName: [bot ? bot.name : generateName()],
    botDesc: [bot ? bot.description : ''],
    botImage: [bot ? bot.imageField : ''],
    modules: [bot? bot.modules : []],
    type: ['Bot']
  });
}
