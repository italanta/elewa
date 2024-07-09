import { FormBuilder, Validators } from '@angular/forms';
import { StoryModuleTypes } from '@app/model/convs-mgr/stories/main';

/**
 * Defintion of the bot module creation form.
 */
export function CREATE_BOT_MODULE_FORM(_fb: FormBuilder) {
  return _fb.group({
    name: ['', Validators.required],
    description: [''],
    type: [StoryModuleTypes.SubStory, Validators.required]
  });
}

export interface CreateStoryModuleForm 
{
  name: string;
  description: string;
  type: StoryModuleTypes;
}

export const SUBSTORY_TYPES = [
  { label: 'Sub-Module', value: StoryModuleTypes.SubStory },
  { label: 'In-app Flow', value: StoryModuleTypes.Flow },
  { label: 'Assessment', value: StoryModuleTypes.Assessment },
];

export const DEFAULT_SUBSTORY_TYPE = SUBSTORY_TYPES[0];
