import { FormBuilder, Validators } from '@angular/forms';
import { generateName } from '../util/generate-name';
import { Story } from '@app/model/convs-mgr/stories/main';

export function STORY_FORM(_fb: FormBuilder, story?: Story) {
  return _fb.group({
    id: [story ? story.id : ''],
    storyName: [story ? story.name : generateName(), Validators.required],
    storyDesc: [story ? story.description : ''],
    parentModule: [story ? story.parentModule : '', Validators.required],
  });
}
