import { FormBuilder, Validators } from '@angular/forms';
import { StoryModuleTypes } from '@app/model/convs-mgr/stories/blocks/structural';

/**
 * Defintion of the bot module creation form.
 */
export function CREATE_BOT_MODULE_FORM(_fb: FormBuilder) {
  return _fb.group({
    botName: ['', Validators.required],
    botDesc: [''],
    type: [StoryModuleTypes.SubStory, Validators.required]
  });
}
